const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

const homeAboutSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'home-about' },
  eyebrow: { type: String, default: 'Who we are' },
  heading: { type: String, default: '' },
  paragraph: { type: String, default: '' },
  stats: { type: [statSchema], default: [] },
  video: { type: String, default: '' },
  videoPoster: { type: String, default: '' },
  ratingScore: { type: String, default: '' },
  ratingCount: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('HomeAbout', homeAboutSchema);
