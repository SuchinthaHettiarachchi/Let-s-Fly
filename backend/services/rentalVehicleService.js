const mongoose = require('mongoose');
const RentalVehicle = require('../models/RentalVehicle');
const RentalCategory = require('../models/RentalCategory');
const imageRefService = require('./imageRefService');
const { httpError } = require('../middleware/error');

const sortVehicles = (list) =>
  [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

const assertCategory = async (categoryId) => {
  const exists = await RentalCategory.exists({ _id: categoryId });
  if (!exists) throw httpError(400, 'Category does not exist');
};

exports.list = async (categoryId) => {
  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) throw httpError(400, 'Invalid category id');
    return sortVehicles(await RentalVehicle.find({ category: categoryId }).lean());
  }
  return sortVehicles(await RentalVehicle.find({}).lean());
};

exports.create = async (data) => {
  await assertCategory(data.category);
  return RentalVehicle.create(data);
};

exports.update = async (id, data) => {
  const before = await RentalVehicle.findById(id).lean();
  if (!before) return null;
  await assertCategory(data.category);
  const updated = await RentalVehicle
    .findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .lean();
  // The image was replaced — drop the old R2 object if nothing else uses it.
  if (before.image && data.image !== before.image) {
    await imageRefService.deleteImageIfUnused(before.image, id);
  }
  return updated;
};

exports.remove = async (id) => {
  const removed = await RentalVehicle.findByIdAndDelete(id).lean();
  if (!removed) return null;
  // Record is gone — clean up its R2 image when no other record references it.
  if (removed.image) await imageRefService.deleteImageIfUnused(removed.image);
  return removed;
};
