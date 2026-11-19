const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
}, { _id: false });

const factSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
}, { _id: false });

const sriLankaVisaSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  short: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  text: { type: String, default: '' },
  purposes: { type: [String], default: [] },
  facts: { type: [factSchema], default: [] },
}, { _id: false });

const residenceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  text: { type: String, default: '' },
  highlight: { type: String, default: '' },
}, { _id: false });

const visaPageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'visa-page' },
  outboundEyebrow: { type: String, default: '' },
  outboundTitle: { type: String, default: '' },
  inboundEyebrow: { type: String, default: '' },
  inboundTitle: { type: String, default: '' },
  inboundIntro: { type: String, default: '' },
  residenceEyebrow: { type: String, default: '' },
  residenceTitle: { type: String, default: '' },
  residenceDescription: { type: String, default: '' },
  residenceRenewalTitle: { type: String, default: '' },
  residenceRenewalText: { type: String, default: '' },
  rulesNote: { type: String, default: '' },
  stepsEyebrow: { type: String, default: '' },
  stepsTitle: { type: String, default: '' },
  steps: { type: [stepSchema], default: [] },
  sriLankaVisas: { type: [sriLankaVisaSchema], default: [] },
  residenceCategories: { type: [residenceSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('VisaPage', visaPageSchema);
