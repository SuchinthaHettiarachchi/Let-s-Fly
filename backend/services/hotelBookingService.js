const HotelBooking = require('../models/HotelBooking');
const defaults = require('../data/hotelBookingDefaults');

const stripKey = (doc) => {
  if (!doc) return null;
  const { key, __v, ...content } = doc;
  return content;
};

exports.getContent = async () => {
  const doc = await HotelBooking.findOne({ key: 'hotel-booking' }).lean();
  return stripKey(doc) || stripKey(defaults);
};

exports.saveContent = async (content) => {
  const doc = await HotelBooking
    .findOneAndUpdate(
      { key: 'hotel-booking' },
      { $set: { ...content, key: 'hotel-booking' } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
    .lean();
  return stripKey(doc);
};
