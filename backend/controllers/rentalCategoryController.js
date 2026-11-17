const rentalCategoryService = require('../services/rentalCategoryService');
const { validateCategoryCreate, validateCategoryUpdate } = require('../validators/rentalValidator');

exports.list = async (_req, res, next) => {
  try {
    res.json({ categories: await rentalCategoryService.list() });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await rentalCategoryService.create(validateCategoryCreate(req.body));
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await rentalCategoryService.update(req.params.id, validateCategoryUpdate(req.body));
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json({ category });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await rentalCategoryService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Category not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
