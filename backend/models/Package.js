const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  region: { type: String, required: true, trim: true },
  area: { type: String, trim: true, default: '' },
  category: { type: String, enum: ['outbound', 'sri-lanka'], required: true },
  themes: { type: [String], default: [] },
  badge: { type: String, trim: true, default: '' },
  days: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  flightsIncluded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
