const VisaCategory = require('../models/VisaCategory');
const VisaCountry = require('../models/VisaCountry');
const Visa = require('../models/Visa');
const VisaPage = require('../models/VisaPage');
const { visaCategories, visaCountries, visas, visaPageDefaults } = require('../data/visaDefaults');

const sortBy = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.label || a.city || '').localeCompare(String(b.label || b.city || ''));

let seedPromise;
async function ensureSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const [catCount, countryCount, visaCount, page] = await Promise.all([
      VisaCategory.countDocuments(),
      VisaCountry.countDocuments(),
      Visa.countDocuments(),
      VisaPage.findOne({ key: 'visa-page' }).lean(),
    ]);
    const jobs = [];
    if (catCount === 0 && visaCategories.length) jobs.push(VisaCategory.insertMany(visaCategories, { ordered: false }).catch(() => []));
    if (countryCount === 0 && visaCountries.length) jobs.push(VisaCountry.insertMany(visaCountries, { ordered: false }).catch(() => []));
    if (visaCount === 0 && visas.length) jobs.push(Visa.insertMany(visas, { ordered: false }).catch(() => []));
    if (!page) jobs.push(VisaPage.create(visaPageDefaults).catch(() => null));
    if (jobs.length) await Promise.all(jobs);
  })().catch((err) => { seedPromise = null; throw err; });
  return seedPromise;
}

exports.listCategories = async () => { await ensureSeeded(); return (await VisaCategory.find().lean()).sort(sortBy); };
exports.createCategory = async (data) => { await ensureSeeded(); return VisaCategory.create(data); };
exports.updateCategory = async (id, data) => VisaCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
exports.deleteCategory = async (id) => VisaCategory.findByIdAndDelete(id).lean();

exports.listCountries = async () => { await ensureSeeded(); return (await VisaCountry.find().lean()).sort(sortBy); };
exports.createCountry = async (data) => { await ensureSeeded(); return VisaCountry.create(data); };
exports.updateCountry = async (id, data) => VisaCountry.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
exports.deleteCountry = async (id) => VisaCountry.findByIdAndDelete(id).lean();

exports.listVisas = async () => { await ensureSeeded(); return (await Visa.find().lean()).sort(sortBy); };
exports.getVisaBySlug = async (slug) => { await ensureSeeded(); return Visa.findOne({ slug: String(slug || '').toLowerCase().trim() }).lean(); };
exports.createVisa = async (data) => { await ensureSeeded(); return Visa.create(data); };
exports.updateVisa = async (id, data) => Visa.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
exports.deleteVisa = async (id) => Visa.findByIdAndDelete(id).lean();

const strip = (doc) => { if (!doc) return null; const { key, __v, ...rest } = doc; return rest; };
exports.getPage = async () => { await ensureSeeded(); return strip(await VisaPage.findOne({ key: 'visa-page' }).lean()) || strip(visaPageDefaults); };
exports.savePage = async (data) => {
  await ensureSeeded();
  const doc = await VisaPage.findOneAndUpdate(
    { key: 'visa-page' },
    { $set: { ...data, key: 'visa-page' } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  ).lean();
  return strip(doc);
};

exports.getPublic = async () => {
  const [categories, countries, items, page] = await Promise.all([
    exports.listCategories(),
    exports.listCountries(),
    exports.listVisas(),
    exports.getPage(),
  ]);
  const catByKey = new Map(categories.map((c) => [c.key, c.label]));
  const countryByKey = new Map(countries.map((c) => [c.key, c.label]));
  const visasOut = items.map((v) => ({
    ...v,
    country: v.country || countryByKey.get(v.countryKey) || '',
    type: v.type || catByKey.get(v.categoryKey) || '',
  }));
  return { categories, countries, visas: visasOut, page };
};
