const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  region: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  area: { type: String, trim: true, default: '' },
  category: { type: String, enum: ['outbound', 'sri-lanka'], required: true },
  outboundRegion: { type: String, default: '' },
  themes: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  badge: { type: String, trim: true, default: '' },
  days: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  priceNote: { type: String, default: '' },
  flightsIncluded: { type: Boolean, default: false },
  rating: { type: mongoose.Schema.Types.Mixed, default: undefined },
  gallery: { type: [String], default: [] },
  brochureUrl: { type: String, default: '' },
  overview: { type: mongoose.Schema.Types.Mixed, default: undefined },
  itinerary: { type: mongoose.Schema.Types.Mixed, default: undefined },
  inclusions: { type: mongoose.Schema.Types.Mixed, default: undefined },
  payment: { type: mongoose.Schema.Types.Mixed, default: undefined },
  related: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
