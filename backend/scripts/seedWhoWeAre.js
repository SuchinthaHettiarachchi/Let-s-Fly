// One-time seed: stores the current About page "Who we are" section in MongoDB.
// Run from backend/: node scripts/seedWhoWeAre.js
require('dotenv').config();
const mongoose = require('mongoose');
const WhoWeAre = require('../models/WhoWeAre');
const defaults = require('../data/whoWeAreDefaults');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await WhoWeAre.findOne({ key: 'who-we-are' }).lean();
    if (existing) {
      console.log('Who-we-are content already exists — leaving it untouched.');
    } else {
      await WhoWeAre.create(defaults);
      console.log('Seeded who-we-are content from the current About page.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
})();
