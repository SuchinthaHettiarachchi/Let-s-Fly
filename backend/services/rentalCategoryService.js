const RentalCategory = require('../models/RentalCategory');
const RentalVehicle = require('../models/RentalVehicle');
const { httpError } = require('../middleware/error');

const sortCats = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

exports.list = async () => sortCats(await RentalCategory.find({}).lean());

exports.create = (data) => RentalCategory.create(data);

exports.update = (id, data) =>
  RentalCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

exports.remove = async (id) => {
  const inUse = await RentalVehicle.countDocuments({ category: id });
  if (inUse > 0) {
    throw httpError(409, `Category is used by ${inUse} vehicle${inUse === 1 ? '' : 's'}. Reassign or delete them first.`);
  }
  return RentalCategory.findByIdAndDelete(id);
};

exports.findById = (id) => RentalCategory.findById(id).lean();
