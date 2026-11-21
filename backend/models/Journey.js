const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  kind: { type: String, enum: ['train', 'cruise'], required: true },
  name: { type: String, required: true },
  label: { type: String, default: '' },
  text: { type: String, required: true },
  price: { type: Number, required: true },
  priceNote: { type: String, default: '' },
  image: { type: String, required: true },
  chips: { type: [String], default: [] },

  // Train-specific: country classification (null for cruises)
  country: { type: String, enum: ['Sri Lankan', 'Overseas'], default: null },

  // Route/stops (Task 2)
  startingPoint: { type: String, default: '' },
  stops: { type: [String], default: [] },

  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Journey', journeySchema);