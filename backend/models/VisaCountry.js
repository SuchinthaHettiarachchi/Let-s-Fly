const mongoose = require('mongoose');

const visaCountrySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, lowercase: true },
  label: { type: String, required: true, trim: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('VisaCountry', visaCountrySchema);
