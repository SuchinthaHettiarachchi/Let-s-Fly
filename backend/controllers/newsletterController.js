const newsletterService = require('../services/newsletterService');
const { validateSubscribe } = require('../validators/newsletterValidator');

exports.subscribe = async (req, res, next) => {
  try {
    res.status(201).json({ subscriber: await newsletterService.subscribe(validateSubscribe(req.body)) });
  } catch (error) { next(error); }
};

exports.list = async (_req, res, next) => {
  try {
    res.json({ subscribers: await newsletterService.list() });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await newsletterService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Subscriber not found' });
    return res.status(204).end();
  } catch (error) { next(error); }
};
