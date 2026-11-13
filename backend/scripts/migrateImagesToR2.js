require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const r2Service = require('../services/r2Service');

const OLD_BASE = 'https://4a3c5b8eb3711f5cf2d6021c0189044a.r2.cloudflarestorage.com';
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'frontend', 'public');

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

function localToDataUrl(relPath) {
  const clean = relPath.replace(/^\//, '');
  const file = path.join(PUBLIC_DIR, clean);
  if (!fs.existsSync(file)) return null;
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return null;
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function rewriteR2Base(value) {
  if (typeof value !== 'string' || !value.startsWith(OLD_BASE)) return value;
  const rest = value.slice(OLD_BASE.length);
  const pub = process.env.R2_PUBLIC_URL || '';
  if (!pub) throw new Error('R2_PUBLIC_URL is not set');
  return `${pub}${rest}`;
}

async function toPublicUrl(current, folder) {
  if (!current || typeof current !== 'string') return current;
  if (current.startsWith(OLD_BASE) || current.includes('.r2.cloudflarestorage.com')) {
    return rewriteR2Base(current);
  }
  if (current.startsWith('data:')) {
    return r2Service.uploadDataUrl(current, folder);
  }
  if (current.startsWith('/images/')) {
    const dataUrl = localToDataUrl(current);
    if (!dataUrl) {
      console.warn(`  skip missing local file: ${current}`);
      return current;
    }
    return r2Service.uploadDataUrl(dataUrl, folder);
  }
  return current;
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  let changed = 0;

  // 1) Hero slides: base64 / old R2 → public R2 URLs
  const hero = await db.collection('herosliders').find({}).toArray();
  for (const doc of hero) {
    let dirty = false;
    const slides = (doc.slides || []).map((slide) => {
      const next = { ...slide };
      for (const key of ['desktop', 'mobile']) {
        const before = next[key];
        if (!before) continue;
        if (before.startsWith('data:') || before.includes('r2.cloudflarestorage.com')) {
          // sync-ish: upload is async — collect below
        }
      }
      return next;
    });
    // async pass
    for (const slide of slides) {
      for (const key of ['desktop', 'mobile']) {
        const before = slide[key];
        if (!before) continue;
        if (before.startsWith('data:') || before.includes('r2.cloudflarestorage.com')) {
          const after = await toPublicUrl(before, 'hero');
          if (after !== before) {
            slide[key] = after;
            dirty = true;
            console.log(`hero ${doc.key} slide ${slide.id} ${key}: → ${after.slice(0, 100)}…`);
          }
        } else if (before.includes('r2.cloudflarestorage.com')) {
          slide[key] = rewriteR2Base(before);
          dirty = true;
        }
      }
    }
    if (dirty) {
      await db.collection('herosliders').updateOne({ _id: doc._id }, { $set: { slides } });
      changed += 1;
    }
  }

  // 2) Who we are: old R2 base + local inset → R2
  const who = await db.collection('whoweares').find({}).toArray();
  for (const doc of who) {
    const update = {};
    if (doc.mainImage) {
      const after = await toPublicUrl(doc.mainImage, 'who-we-are');
      if (after !== doc.mainImage) {
        update.mainImage = after;
        console.log(`who mainImage: → ${after.slice(0, 120)}`);
      }
    }
    if (doc.insetImage) {
      const after = await toPublicUrl(doc.insetImage, 'packages');
      if (after !== doc.insetImage) {
        update.insetImage = after;
        console.log(`who insetImage: → ${after.slice(0, 120)}`);
      }
    }
    if (doc.video && doc.video.includes('r2.cloudflarestorage.com')) {
      update.video = rewriteR2Base(doc.video);
      console.log(`who video: → ${update.video.slice(0, 120)}`);
    }
    if (Object.keys(update).length) {
      await db.collection('whoweares').updateOne({ _id: doc._id }, { $set: update });
      changed += 1;
    }
  }

  // 3) Packages: local /images + old R2 → R2
  const packages = await db.collection('packages').find({}).toArray();
  for (const doc of packages) {
    const update = {};
    if (doc.image && (doc.image.startsWith('/images/') || doc.image.includes('r2.cloudflarestorage.com'))) {
      const after = await toPublicUrl(doc.image, 'packages');
      if (after !== doc.image) {
        update.image = after;
        console.log(`pkg ${doc.slug} image: → ${after.slice(0, 120)}`);
      }
    }
    if (Array.isArray(doc.gallery) && doc.gallery.length) {
      const gallery = [];
      let galleryDirty = false;
      for (const item of doc.gallery) {
        if (typeof item === 'string' && (item.startsWith('/images/') || item.includes('r2.cloudflarestorage.com'))) {
          const after = await toPublicUrl(item, 'packages');
          gallery.push(after);
          if (after !== item) galleryDirty = true;
        } else {
          gallery.push(item);
        }
      }
      if (galleryDirty) {
        update.gallery = gallery;
        console.log(`pkg ${doc.slug} gallery: ${gallery.length} item(s) migrated`);
      }
    }
    if (doc.brochureUrl && doc.brochureUrl.includes('r2.cloudflarestorage.com')) {
      update.brochureUrl = rewriteR2Base(doc.brochureUrl);
    }
    if (Object.keys(update).length) {
      await db.collection('packages').updateOne({ _id: doc._id }, { $set: update });
      changed += 1;
    }
  }

  console.log(`Done. ${changed} document(s) updated.`);
  await mongoose.disconnect();
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
