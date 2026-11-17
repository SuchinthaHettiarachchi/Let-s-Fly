const galleryItemService = require('../services/galleryItemService');
const { validateItemCreate, validateItemUpdate } = require('../validators/galleryValidator');

exports.list = async (_req, res, next) => {
  try {
    res.json({ items: await galleryItemService.list() });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await galleryItemService.create(validateItemCreate(req.body));
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await galleryItemService.update(req.params.id, validateItemUpdate(req.body));
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    return res.json({ item });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await galleryItemService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Gallery item not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// POST /reorder — body: [{ id, sortOrder }, …] (validated lightly here).
exports.reorder = async (req, res, next) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [];
    const cleaned = updates
      .filter((u) => u && typeof u.id === 'string' && Number.isFinite(Number(u.sortOrder)))
      .map((u) => ({ id: u.id, sortOrder: Number(u.sortOrder) }));
    if (!cleaned.length) return res.status(400).json({ message: 'No reorder updates provided' });
    return res.json({ items: await galleryItemService.reorder(cleaned) });
  } catch (error) {
    return next(error);
  }
};
