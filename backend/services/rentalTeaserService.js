const RentalTeaser = require('../models/RentalTeaser');
const defaults = require('../data/rentalTeaserDefaults');

const stripKey = (doc) => {
  if (!doc) return null;
  const { key, __v, ...content } = doc;
  return content;
};

exports.getContent = async () => {
  const doc = await RentalTeaser.findOne({ key: 'home-rental-teaser' }).lean();
  return stripKey(doc) || stripKey(defaults);
};

exports.saveContent = async (content) => {
  const doc = await RentalTeaser
    .findOneAndUpdate(
      { key: 'home-rental-teaser' },
      { $set: { ...content, key: 'home-rental-teaser' } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
    .lean();
  return stripKey(doc);
};
