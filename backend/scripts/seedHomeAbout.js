// One-time seed: stores the current home page "Who we are" (AboutIntro) section in MongoDB.
// Run from backend/: node scripts/seedHomeAbout.js
require('dotenv').config();
const mongoose = require('mongoose');
const HomeAbout = require('../models/HomeAbout');
const defaults = require('../data/homeAboutDefaults');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await HomeAbout.findOne({ key: 'home-about' }).lean();
    if (existing) {
      console.log('Home-about content already exists — leaving it untouched.');
    } else {
      await HomeAbout.create(defaults);
      console.log('Seeded home-about content from the current home page.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
})();
