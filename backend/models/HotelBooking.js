const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const hotelBookingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'hotel-booking' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  stats: { type: [statSchema], default: [] },
  ctaLabel: { type: String, default: '' },
  ctaUrl: { type: String, default: '' },
  ctaNote: { type: String, default: '' },
  whatsappMessage: { type: String, default: '' },
  imagePrimary: { type: String, default: '' },
  imageSecondary: { type: String, default: '' },
  priceLabel: { type: String, default: '' },
  priceAmount: { type: String, default: '' },
  priceSuffix: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);
