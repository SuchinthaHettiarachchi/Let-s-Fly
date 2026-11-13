require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const defaults = require('../data/categoryDefaults');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Category.countDocuments({});
  if (existing > 0) {
    console.log(`Categories already seeded (${existing}).`);
  } else {
    await Category.insertMany(defaults, { ordered: false });
    console.log(`Seeded ${defaults.length} categories.`);
  }
  const cats = await Category.find({ scope: 'sri-lanka' }).sort({ sortOrder: 1 }).lean();
  for (const cat of cats) console.log(`  ${cat.key}: ${cat.label}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Category seed failed:', error.message);
  process.exitCode = 1;
});
