const galleryCategoryService = require('../services/galleryCategoryService');
const { validateCategoryCreate, validateCategoryUpdate } = require('../validators/galleryValidator');

exports.list = async (_req, res, next) => {
  try {
    res.json({ categories: await galleryCategoryService.list() });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await galleryCategoryService.create(validateCategoryCreate(req.body));
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await galleryCategoryService.update(req.params.id, validateCategoryUpdate(req.body));
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json({ category });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await galleryCategoryService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Category not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
