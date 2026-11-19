const Package = require('../models/Package');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

const ensureUniqueSlug = async (base, excludeId) => {
  const root = slugify(base) || 'package';
  let slug = root;
  let n = 2;
  while (true) {
    const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    // eslint-disable-next-line no-await-in-loop
    const exists = await Package.exists(query);
    if (!exists) return slug;
    slug = `${root}-${n++}`.slice(0, 120);
  }
};

const getLatestPackages = async () => {
  const [sriLanka, outbound] = await Promise.all([
    Package.find({ category: 'sri-lanka' }).sort({ createdAt: -1, _id: -1 }).limit(12).lean(),
    Package.find({ category: 'outbound' }).sort({ createdAt: -1, _id: -1 }).limit(12).lean(),
  ]);

  const primary = [...sriLanka.slice(0, 6), ...outbound.slice(0, 6)];
  const seen = new Set(primary.map((p) => String(p._id)));
  const chosen = [...primary];

  if (chosen.length < 12) {
    const rest = [...sriLanka.slice(6), ...outbound.slice(6)]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || String(b._id).localeCompare(String(a._id)));
    for (const p of rest) {
      if (chosen.length >= 12) break;
      const id = String(p._id);
      if (seen.has(id)) continue;
      seen.add(id);
      chosen.push(p);
    }
  }

  return chosen
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || String(b._id).localeCompare(String(a._id)))
    .slice(0, 12);
};

const listPackages = (category) => {
  const query = category ? { category } : {};
  return Package.find(query).sort({ createdAt: -1, _id: -1 }).lean();
};

const getPackageBySlug = (slug) => Package.findOne({ slug }).lean();

const createPackage = async (data) => {
  const slug = await ensureUniqueSlug(data.title || data.slug);
  return Package.create({ ...data, slug });
};

const updatePackage = async (id, data) => {
  const changes = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  // Slugs are generated automatically from title.
  if (Object.prototype.hasOwnProperty.call(data, 'title') || !data.slug) {
    const base = data.title || data.slug;
    if (base) changes.slug = await ensureUniqueSlug(base, id);
    else delete changes.slug;
  }
  return Package.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).lean();
};

const deletePackage = (id) => Package.findByIdAndDelete(id);

module.exports = { getLatestPackages, listPackages, getPackageBySlug, createPackage, updatePackage, deletePackage };
