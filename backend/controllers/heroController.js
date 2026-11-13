const { validateSlides } = require('../validators/heroValidator');
const heroService = require('../services/heroService');
const r2Service = require('../services/r2Service');

exports.get = async (req, res) => {
  res.json({ slides: await heroService.getSlides() });
};

exports.save = async (req, res) => {
  const slides = validateSlides(req.body);
  // Legacy payloads store base64 WebP in Mongo — push those to R2 and keep only the public URL.
  for (const slide of slides) {
    for (const key of ['desktop', 'mobile']) {
      if (slide[key].startsWith('data:')) {
        slide[key] = await r2Service.uploadDataUrl(slide[key], 'hero');
      }
    }
  }
  await heroService.saveSlides(slides);
  res.json({ slides });
};
