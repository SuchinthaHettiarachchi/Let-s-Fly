const Journey = require('../models/Journey');
const { validateJourneyCreate, validateJourneyUpdate } = require('../validators/journeyValidator');

const sortJourn = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

exports.list = async () => sortJourn(await Journey.find({}).lean());

exports.create = async (data) => {
  const doc = new Journey(data);
  return doc.save();
};

exports.update = (id, data) =>
  Journey.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

exports.remove = (id) => Journey.findByIdAndDelete(id);

exports.findById = (id) => Journey.findById(id).lean();