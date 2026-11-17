/* Seeds the Travellers Gallery: four categories (stable ids) plus the eight
   genuine photos migrated from the old frontend mock — each uploaded to
   Cloudflare R2. Idempotent: existing gallery items are left untouched. */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const GalleryCategory = require('../models/GalleryCategory');
const GalleryItem = require('../models/GalleryItem');
const r2Service = require('../services/r2Service');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'frontend', 'public');
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

const CATEGORIES = [
  { _id: '675b00000000000000000001', name: 'Travel Sri Lanka', sortOrder: 1 },
  { _id: '675b00000000000000000002', name: 'Overseas Travel', sortOrder: 2 },
  { _id: '675b00000000000000000003', name: 'Hotel bookings', sortOrder: 3 },
  { _id: '675b00000000000000000004', name: 'Train & Cruise Adventures', sortOrder: 4 },
];

// The eight genuine photos from the removed frontend/src/data/gallery.ts mock.
const ITEMS = [
  { caption: 'Dubai', category: 'Overseas Travel', image: '/images/packages/dubai-family-escape.jpg' },
  { caption: 'Ella', category: 'Train & Cruise Adventures', image: '/images/packages/kandy-ella-rail.jpg' },
  { caption: 'Maldives', category: 'Hotel bookings', image: '/images/packages/maldives-overwater-villa.jpg' },
  { caption: 'Yala', category: 'Travel Sri Lanka', image: '/images/packages/yala-safari.jpg' },
  { caption: 'Bali', category: 'Overseas Travel', image: '/images/packages/bali-honeymoon.jpg' },
  { caption: 'Singapore cruise', category: 'Train & Cruise Adventures', image: '/images/packages/singapore-malaysia-cruise.jpg' },
  { caption: 'Bangkok', category: 'Overseas Travel', image: '/images/packages/bangkok-phuket.jpg' },
  { caption: 'Mirissa', category: 'Travel Sri Lanka', image: '/images/hero/maldives-beach.jpg' },
];

async function localToR2(relPath) {
  const file = path.join(PUBLIC_DIR, relPath.replace(/^\//, ''));
  if (!fs.existsSync(file)) throw new Error(`Missing local file: ${relPath}`);
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`Unsupported image type: ${relPath}`);
  const dataUrl = `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  const url = await r2Service.uploadDataUrl(dataUrl, 'gallery');
  console.log(`  uploaded ${relPath} → ${url}`);
  return url;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const categoryIds = {};
  for (const cat of CATEGORIES) {
    await GalleryCategory.findOneAndUpdate(
      { name: cat.name },
      { $setOnInsert: { _id: cat._id, name: cat.name, sortOrder: cat.sortOrder } },
      { upsert: true, new: true },
    );
    categoryIds[cat.name] = cat._id;
    console.log(`category: ${cat.name}`);
  }

  const existing = await GalleryItem.countDocuments({});
  if (existing > 0) {
    console.log(`\nGallery items already seeded (${existing}). Nothing to migrate.`);
  } else {
    console.log('\nMigrating gallery photos to Cloudflare R2…');
    for (let i = 0; i < ITEMS.length; i += 1) {
      const item = ITEMS[i];
      const media = await localToR2(item.image);
      await GalleryItem.create({
        caption: item.caption,
        category: categoryIds[item.category],
        media,
        mediaType: 'image',
        sortOrder: i + 1,
      });
      console.log(`item: ${item.caption} · ${item.category} · position ${i + 1}`);
    }
  }

  const [cats, items] = await Promise.all([
    GalleryCategory.find({}).sort({ sortOrder: 1, name: 1 }).lean(),
    GalleryItem.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean(),
  ]);
  console.log(`\nGallery: ${cats.length} categories, ${items.length} items`);
  cats.forEach((c) => console.log(`  [cat] ${c._id}  ${c.name}`));
  items.forEach((it) => console.log(`  [item] #${it.sortOrder} ${it.caption} (${it.mediaType})`));
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Gallery seed failed:', error.message);
  process.exitCode = 1;
});
