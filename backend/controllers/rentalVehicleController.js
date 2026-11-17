const rentalVehicleService = require('../services/rentalVehicleService');
const { validateVehicle } = require('../validators/rentalValidator');

exports.list = async (req, res, next) => {
  try {
    res.json({ vehicles: await rentalVehicleService.list(req.query.category) });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ vehicle: await rentalVehicleService.create(validateVehicle(req.body)) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const vehicle = await rentalVehicleService.update(req.params.id, validateVehicle(req.body));
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    return res.json({ vehicle });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await rentalVehicleService.remove(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Vehicle not found' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
