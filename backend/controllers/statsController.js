const statsService = require('../services/statsService');

exports.counts = async (_req, res, next) => {
  try {
    res.json(await statsService.getCounts());
  } catch (error) { next(error); }
};

exports.storage = async (_req, res, next) => {
  try {
    res.json(await statsService.getStorage());
  } catch (error) { next(error); }
};
