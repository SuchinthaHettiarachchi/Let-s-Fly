const { validateSlides } = require('../validators/heroValidator');
const heroService = require('../services/heroService');

exports.get = async (req, res) => {
  res.json({ slides: await heroService.getSlides() });
};

exports.save = async (req, res) => {
  const slides = validateSlides(req.body);
  await heroService.saveSlides(slides);
  res.json({ slides });
};
