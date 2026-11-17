const mongoose = require('mongoose');

const rentalCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  icon: { type: String, required: true, trim: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RentalCategory', rentalCategorySchema);
