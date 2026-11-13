const homeAboutService = require('../services/homeAboutService');
const { validateHomeAbout } = require('../validators/homeAboutValidator');

exports.get = async (_req, res, next) => {
  try {
    res.json({ content: await homeAboutService.getContent() });
  } catch (error) {
    next(error);
  }
};

exports.save = async (req, res, next) => {
  try {
    const content = await homeAboutService.saveContent(validateHomeAbout(req.body));
    res.json({ content });
  } catch (error) {
    next(error);
  }
};
