const HomeAbout = require('../models/HomeAbout');
const defaults = require('../data/homeAboutDefaults');

const stripKey = (doc) => {
  if (!doc) return null;
  const { key, __v, ...content } = doc;
  return content;
};

exports.getContent = async () => {
  const doc = await HomeAbout.findOne({ key: 'home-about' }).lean();
  // Seed row exists in the API fallback until the first save replaces it.
  return stripKey(doc) || stripKey(defaults);
};

exports.saveContent = async (content) => {
  const doc = await HomeAbout
    .findOneAndUpdate({ key: 'home-about' }, { $set: { ...content, key: 'home-about' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    .lean();
  return stripKey(doc);
};
