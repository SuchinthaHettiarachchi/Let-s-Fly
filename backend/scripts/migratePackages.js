require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Package = require('../models/Package');

const seedPath = path.join(__dirname, '..', 'data', 'packages.seed.json');

async function migrate() {
  const packages = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  await mongoose.connect(process.env.MONGO_URI);
  const operations = packages.map((packageItem) => ({
    updateOne: {
      filter: { slug: packageItem.slug },
      update: { $set: packageItem },
      upsert: true,
    },
  }));
  const result = await Package.bulkWrite(operations);
  console.log(`Migrated ${packages.length} packages (${result.upsertedCount} inserted, ${result.modifiedCount} updated).`);
  await mongoose.disconnect();
}

migrate().catch((error) => {
  console.error('Package migration failed:', error.message);
  process.exitCode = 1;
});
