const packageService = require('../services/packageService');

exports.listLatest = async (_req, res, next) => {
  try {
    res.json({ packages: await packageService.getLatestPackages() });
  } catch (error) {
    next(error);
  }
};
