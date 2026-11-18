const hotelBookingService = require('../services/hotelBookingService');
const { validateHotelBooking } = require('../validators/hotelBookingValidator');

exports.get = async (_req, res, next) => {
  try {
    res.json({ content: await hotelBookingService.getContent() });
  } catch (error) {
    next(error);
  }
};

exports.save = async (req, res, next) => {
  try {
    const content = await hotelBookingService.saveContent(validateHotelBooking(req.body));
    res.json({ content });
  } catch (error) {
    next(error);
  }
};
