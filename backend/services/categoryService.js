const Category = require('../models/Category');
const defaults = require('../data/categoryDefaults');

const sortCats = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.label.localeCompare(b.label));

exports.list = async () => {
  const docs = await Category.find({ scope: 'sri-lanka' }).lean();
  if (docs.length) return sortCats(docs);
  // Seed defaults on first read so the visitor filter and CMS stay in sync.
  const seeded = await Category.insertMany(defaults, { ordered: false }).catch(() => []);
  return sortCats(seeded.length ? seeded : defaults);
};

exports.create = (data) => Category.create(data);

exports.update = (id, data) =>
  Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

exports.remove = (id) => Category.findByIdAndDelete(id);

exports.findByKey = (key) => Category.findOne({ key, scope: 'sri-lanka' }).lean();
