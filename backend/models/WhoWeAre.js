const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  initials: { type: String, default: '' },
  quote: { type: String, default: '' },
  name: { type: String, default: '' },
  role: { type: String, default: '' },
}, { _id: false });

const whoWeAreSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'who-we-are' },
  eyebrow: { type: String, default: 'Who we are' },
  headingLead: { type: String, default: 'More Than ' },
  headingHighlight: { type: String, default: 'Just Travel' },
  paragraphs: { type: [String], default: [] },
  quote: { type: quoteSchema, default: () => ({}) },
  statValue: { type: String, default: '14+' },
  statLabel: { type: String, default: '' },
  mainImage: { type: String, default: '' },
  insetImage: { type: String, default: '' },
  video: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('WhoWeAre', whoWeAreSchema);
