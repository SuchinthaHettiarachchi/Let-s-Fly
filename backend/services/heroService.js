const HeroSlider = require('../models/HeroSlider');

exports.getSlides = async () => {
  const doc = await HeroSlider.findOne({ key: 'home' }).lean();
  return doc && Array.isArray(doc.slides) ? doc.slides : [];
};

exports.saveSlides = async (slides) => {
  await HeroSlider.updateOne({ key: 'home' }, { $set: { slides } }, { upsert: true });
  return slides;
};
