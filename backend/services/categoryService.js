const Category = require('../models/Category');
const { sriLankaDefaults, outboundDefaults } = require('../data/categoryDefaults');

const sortCats = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.label.localeCompare(b.label));
const defaultsFor = (scope) => (scope === 'outbound' ? outboundDefaults : sriLankaDefaults);

exports.list = async (scope = 'sri-lanka') => {
  const normalized = scope === 'outbound' ? 'outbound' : 'sri-lanka';
  const docs = await Category.find({ scope: normalized }).lean();
  if (docs.length) return sortCats(docs);
  const defaults = defaultsFor(normalized);
  const seeded = await Category.insertMany(defaults, { ordered: false }).catch(() => []);
  return sortCats(seeded.length ? seeded : defaults);
};

exports.create = (data) => Category.create(data);
exports.update = (id, data) => Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
exports.remove = (id) => Category.findByIdAndDelete(id);
exports.findByKey = (key, scope) => Category.findOne(scope ? { key, scope } : { key }).lean();
