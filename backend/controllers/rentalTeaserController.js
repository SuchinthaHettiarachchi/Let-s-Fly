const rentalTeaserService = require('../services/rentalTeaserService');
const { validateRentalTeaser } = require('../validators/rentalTeaserValidator');

exports.get = async (_req, res, next) => {
  try {
    res.json({ content: await rentalTeaserService.getContent() });
  } catch (error) {
    next(error);
  }
};

exports.save = async (req, res, next) => {
  try {
    const content = await rentalTeaserService.saveContent(validateRentalTeaser(req.body));
    res.json({ content });
  } catch (error) {
    next(error);
  }
};
