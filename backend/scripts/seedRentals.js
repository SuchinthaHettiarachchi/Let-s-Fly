require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const RentalCategory = require('../models/RentalCategory');
const RentalVehicle = require('../models/RentalVehicle');
const r2Service = require('../services/r2Service');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'frontend', 'public');
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

// Mirrors the previous frontend/src/data/rentals.ts mock (transmission "Auto" → "Automatic").
const CATEGORIES = [
  { name: 'Cars', icon: 'directions_car', sortOrder: 0 },
  { name: 'SUVs', icon: 'directions_car', sortOrder: 1 },
  { name: 'Vans', icon: 'airport_shuttle', sortOrder: 2 },
  { name: 'Bikes', icon: 'two_wheeler', sortOrder: 3 },
];

const VEHICLES = [
  { name: 'Toyota Axio Hybrid', category: 'Cars', seats: 4, transmission: 'Automatic', fuel: 'Hybrid', modes: ['self-drive', 'with-driver'], image: null },
  { name: 'Honda Vezel', category: 'Cars', seats: 5, transmission: 'Automatic', fuel: 'Hybrid', modes: ['self-drive', 'with-driver'], image: '/images/rentals/car.jpg' },
  { name: 'Toyota Land Cruiser', category: 'SUVs', seats: 7, transmission: 'Automatic', fuel: 'Diesel', modes: ['self-drive', 'with-driver'], image: null },
  { name: 'Toyota KDH High-roof', category: 'Vans', seats: 12, transmission: 'Manual', fuel: 'Diesel', modes: ['self-drive', 'with-driver'], image: '/images/rentals/van.jpg' },
  { name: 'Royal Enfield Classic', category: 'Bikes', seats: 2, transmission: 'Manual', fuel: 'Petrol', modes: ['self-drive'], image: '/images/rentals/bike.jpg' },
  { name: 'Honda Dio Scooter', category: 'Bikes', seats: 2, transmission: 'Automatic', fuel: 'Petrol', modes: ['self-drive'], image: '/images/rentals/scooter.jpg' },
];

async function localToR2(relPath, cache) {
  if (!relPath) return '';
  if (cache.has(relPath)) return cache.get(relPath);
  const file = path.join(PUBLIC_DIR, relPath.replace(/^\//, ''));
  if (!fs.existsSync(file)) {
    console.warn(`  missing local file: ${relPath}`);
    cache.set(relPath, '');
    return '';
  }
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`Unsupported image type: ${relPath}`);
  const dataUrl = `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  const url = await r2Service.uploadDataUrl(dataUrl, 'rentals');
  console.log(`  uploaded ${relPath} → ${url}`);
  cache.set(relPath, url);
  return url;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existingVehicles = await RentalVehicle.countDocuments({});
  if (existingVehicles > 0) {
    console.log(`Rentals already seeded (${existingVehicles} vehicles).`);
    await mongoose.disconnect();
    return;
  }

  const categoryIds = {};
  for (const cat of CATEGORIES) {
    const doc = await RentalCategory.findOneAndUpdate(
      { name: cat.name },
      { $setOnInsert: cat },
      { new: true, upsert: true },
    ).lean();
    categoryIds[cat.name] = doc._id;
    console.log(`category ${cat.name} (${cat.icon})`);
  }

  const cache = new Map();
  for (const v of VEHICLES) {
    const image = await localToR2(v.image, cache);
    await RentalVehicle.findOneAndUpdate(
      { name: v.name },
      {
        $setOnInsert: {
          name: v.name,
          category: categoryIds[v.category],
          seats: v.seats,
          transmission: v.transmission,
          fuel: v.fuel,
          modes: v.modes,
          image,
        },
      },
      { upsert: true },
    );
    console.log(`vehicle ${v.name} · ${v.seats} seats · ${v.transmission} · ${v.fuel}${image ? ' · image' : ''}`);
  }

  console.log(`Done. ${VEHICLES.length} vehicles, ${CATEGORIES.length} categories.`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Rental seed failed:', error.message);
  process.exitCode = 1;
});
