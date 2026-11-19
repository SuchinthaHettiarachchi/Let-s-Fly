const mongoose = require('mongoose');

const factSchema = new mongoose.Schema({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const documentItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  note: { type: String, default: '' },
}, { _id: false });

const documentGroupSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  items: { type: [documentItemSchema], default: [] },
}, { _id: false });

const feeItemSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  note: { type: String, default: '' },
}, { _id: false });

const feeGroupSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  items: { type: [feeItemSchema], default: [] },
}, { _id: false });

const extraSectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  items: { type: [documentItemSchema], default: [] },
}, { _id: false });

const visaSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  countryKey: { type: String, default: '', trim: true, lowercase: true },
  country: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  categoryKey: { type: String, default: '', trim: true, lowercase: true },
  type: { type: String, default: '', trim: true },
  image: { type: String, default: '' },
  flag: { type: String, default: '' },
  summary: { type: String, default: '' },
  facts: { type: [factSchema], default: [] },
  documentGroups: { type: [documentGroupSchema], default: [] },
  warning: { type: String, default: '' },
  feeGroups: { type: [feeGroupSchema], default: [] },
  extraSections: { type: [extraSectionSchema], default: [] },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Visa', visaSchema);
