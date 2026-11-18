const Journey = require('../models/Journey');

const sortJourn = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

const toJourney = (doc) => {
  if (!doc) return null;
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return { id: String(_id), ...rest };
};

exports.list = async (filter = {}) => {
  const q = {};
  if (filter.kind === 'train' || filter.kind === 'cruise') q.kind = filter.kind;
  const docs = await Journey.find(q).lean();
  return sortJourn(docs).map(toJourney);
};

exports.create = async (data) => {
  const doc = await new Journey(data).save();
  return toJourney(doc.toObject());
};

exports.update = async (id, data) => {
  const doc = await Journey.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  return toJourney(doc);
};

exports.remove = (id) => Journey.findByIdAndDelete(id);

exports.findById = async (id) => toJourney(await Journey.findById(id).lean());