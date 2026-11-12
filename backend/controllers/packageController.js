const packageService = require('../services/packageService');
const { validatePackage } = require('../validators/packageValidator');

exports.listLatest = async (_req, res, next) => {
  try {
    res.json({ packages: await packageService.getLatestPackages() });
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.json({ packages: await packageService.listPackages(req.query.category) });
  } catch (error) {
    next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const packageItem = await packageService.getPackageBySlug(req.params.slug);
    if (!packageItem) return res.status(404).json({ message: 'Package not found' });
    return res.json({ package: packageItem });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ package: await packageService.createPackage(validatePackage(req.body)) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await packageService.updatePackage(req.params.id, validatePackage(req.body));
    if (!updated) return res.status(404).json({ message: 'Package not found' });
    return res.json({ package: updated });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await packageService.deletePackage(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Package not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
