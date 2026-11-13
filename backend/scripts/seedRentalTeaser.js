require('dotenv').config();
const mongoose = require('mongoose');
const RentalTeaser = require('../models/RentalTeaser');
const defaults = require('../data/rentalTeaserDefaults');

// Writes the current frontend rentalTypes values into Mongo before the mock is removed.
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const doc = await RentalTeaser
    .findOneAndUpdate(
      { key: 'home-rental-teaser' },
      { $set: defaults },
      { new: true, upsert: true },
    )
    .lean();
  console.log(`Seeded rental teaser (${doc.slots.length} slots):`);
  for (const slot of doc.slots) console.log(`  ${slot.id}: ${slot.line1} · ${slot.line2} · ${slot.image}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
});
