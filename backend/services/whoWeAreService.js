const WhoWeAre = require('../models/WhoWeAre');
const defaults = require('../data/whoWeAreDefaults');

const stripKey = (doc) => {
  if (!doc) return null;
  const { key, __v, ...content } = doc;
  return content;
};

exports.getContent = async () => {
  const doc = await WhoWeAre.findOne({ key: 'who-we-are' }).lean();
  // Seed row exists in the API fallback until the first save replaces it.
  return stripKey(doc) || stripKey(defaults);
};

exports.saveContent = async (content) => {
  const doc = await WhoWeAre
    .findOneAndUpdate({ key: 'who-we-are' }, { $set: { ...content, key: 'who-we-are' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    .lean();
  return stripKey(doc);
};
