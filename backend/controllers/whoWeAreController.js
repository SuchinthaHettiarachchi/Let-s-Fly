const whoWeAreService = require('../services/whoWeAreService');
const { validateWhoWeAre } = require('../validators/whoWeAreValidator');

exports.get = async (_req, res, next) => {
  try {
    res.json({ content: await whoWeAreService.getContent() });
  } catch (error) {
    next(error);
  }
};

exports.save = async (req, res, next) => {
  try {
    const content = await whoWeAreService.saveContent(validateWhoWeAre(req.body));
    res.json({ content });
  } catch (error) {
    next(error);
  }
};
