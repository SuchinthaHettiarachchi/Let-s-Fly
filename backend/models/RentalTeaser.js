const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  id: { type: String, required: true, enum: ['cars', 'vans', 'bikes', 'scooters'] },
  image: { type: String, default: '' },
  line1: { type: String, default: '' },
  line2: { type: String, default: '' },
}, { _id: false });

const rentalTeaserSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'home-rental-teaser' },
  slots: { type: [slotSchema], default: () => [] },
}, { timestamps: true });

module.exports = mongoose.model('RentalTeaser', rentalTeaserSchema);
