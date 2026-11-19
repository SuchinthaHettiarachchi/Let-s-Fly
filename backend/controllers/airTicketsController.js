const airTicketsService = require('../services/airTicketsService');
const { validateContent, validateRoute } = require('../validators/airTicketsValidator');

exports.getPublic = async (_req, res, next) => {
  try {
    const data = await airTicketsService.getPublic();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getContent = async (_req, res, next) => {
  try {
    res.json({ content: await airTicketsService.getContent() });
  } catch (error) {
    next(error);
  }
};

exports.saveContent = async (req, res, next) => {
  try {
    const content = await airTicketsService.saveContent(validateContent(req.body));
    res.json({ content });
  } catch (error) {
    next(error);
  }
};

exports.listRoutes = async (_req, res, next) => {
  try {
    res.json({ routes: await airTicketsService.listRoutes() });
  } catch (error) {
    next(error);
  }
};

exports.createRoute = async (req, res, next) => {
  try {
    const route = await airTicketsService.createRoute(validateRoute(req.body));
    res.status(201).json({ route });
  } catch (error) {
    next(error);
  }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const route = await airTicketsService.updateRoute(req.params.id, validateRoute(req.body));
    if (!route) return res.status(404).json({ message: 'Route not found' });
    return res.json({ route });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await airTicketsService.deleteRoute(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
