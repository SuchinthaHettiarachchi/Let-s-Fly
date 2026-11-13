const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, lowercase: true },
  label: { type: String, required: true, trim: true },
  scope: { type: String, enum: ['sri-lanka'], default: 'sri-lanka' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
