const GalleryItem = require('../models/GalleryItem');
const GalleryCategory = require('../models/GalleryCategory');
const imageRefService = require('./imageRefService');
const { httpError } = require('../middleware/error');

const assertCategory = async (categoryId) => {
  const exists = await GalleryCategory.exists({ _id: categoryId });
  if (!exists) throw httpError(400, 'Category does not exist');
};

// Sorted list with `categoryName` resolved so both the visitor wall and the
// admin table can render without a second lookup.
exports.list = async () => {
  const [items, categories] = await Promise.all([
    GalleryItem.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    GalleryCategory.find({}).lean(),
  ]);
  const names = new Map(categories.map((c) => [String(c._id), c.name]));
  return items.map((item) => ({ ...item, categoryName: names.get(String(item.category)) ?? null }));
};

exports.create = async (data) => {
  await assertCategory(data.category);
  return GalleryItem.create(data);
};

exports.update = async (id, data) => {
  const before = await GalleryItem.findById(id).lean();
  if (!before) return null;
  if (data.category) await assertCategory(data.category);
  const updated = await GalleryItem
    .findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .lean();
  // The media was replaced — drop the old R2 object if nothing else uses it.
  if (before.media && data.media && data.media !== before.media) {
    await imageRefService.deleteImageIfUnused(before.media);
  }
  return updated;
};

exports.remove = async (id) => {
  const removed = await GalleryItem.findByIdAndDelete(id).lean();
  if (!removed) return null;
  // Record is gone — clean up its R2 media when no other record references it.
  if (removed.media) await imageRefService.deleteImageIfUnused(removed.media);
  return removed;
};

exports.findById = (id) => GalleryItem.findById(id).lean();

// Bulk sortOrder rewrite for the up/down reorder buttons.
exports.reorder = async (updates) => {
  await Promise.all(
    updates.map(({ id, sortOrder }) => GalleryItem.findByIdAndUpdate(id, { sortOrder })),
  );
  return exports.list();
};
