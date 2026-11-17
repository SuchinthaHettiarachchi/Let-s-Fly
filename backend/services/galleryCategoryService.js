const GalleryCategory = require('../models/GalleryCategory');
const GalleryItem = require('../models/GalleryItem');
const { httpError } = require('../middleware/error');

const sortCats = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

exports.list = async () => sortCats(await GalleryCategory.find({}).lean());

exports.create = async (data) => {
  const duplicate = await GalleryCategory.findOne({ name: data.name }).lean();
  if (duplicate) throw httpError(409, 'A category with this name already exists');
  return GalleryCategory.create(data);
};

exports.update = (id, data) =>
  GalleryCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

exports.remove = async (id) => {
  const inUse = await GalleryItem.countDocuments({ category: id });
  if (inUse > 0) {
    throw httpError(409, `Category is used by ${inUse} gallery item${inUse === 1 ? '' : 's'}. Reassign or delete them first.`);
  }
  return GalleryCategory.findByIdAndDelete(id);
};

exports.findById = (id) => GalleryCategory.findById(id).lean();
