require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const HomeAbout = require('../models/HomeAbout');
const defaults = require('../data/homeAboutDefaults');
const r2Service = require('../services/r2Service');

async function main() {
  const videoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'videos', 'letsfly-home.mp4');
  const posterPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'videos', 'letsfly-home-poster.jpg');
  if (!fs.existsSync(videoPath)) throw new Error(`Video not found: ${videoPath}`);

  await mongoose.connect(process.env.MONGO_URI);

  const videoBuffer = fs.readFileSync(videoPath);
  const videoUrl = await r2Service.uploadRaw(videoBuffer, 'video/mp4', 'home-about');
  console.log('Uploaded video:', videoUrl);

  let posterUrl = null;
  if (fs.existsSync(posterPath)) {
    const ext = path.extname(posterPath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const dataUrl = `data:${mime};base64,${fs.readFileSync(posterPath).toString('base64')}`;
    posterUrl = await r2Service.uploadDataUrl(dataUrl, 'home-about');
    console.log('Uploaded poster:', posterUrl);
  } else {
    console.log('Poster not found, leaving existing/default poster.');
  }

  const existing = await HomeAbout.findOne({ key: 'home-about' }).lean();
  const base = existing ? { ...existing } : { ...defaults };
  delete base._id; delete base.__v; delete base.createdAt; delete base.updatedAt;
  const update = { ...base, key: 'home-about', video: videoUrl };
  if (posterUrl) update.videoPoster = posterUrl;

  const doc = await HomeAbout
    .findOneAndUpdate({ key: 'home-about' }, { $set: update }, { new: true, upsert: true, setDefaultsOnInsert: true })
    .lean();
  console.log('HomeAbout saved:', { id: String(doc && doc._id), video: doc && doc.video, videoPoster: doc && doc.videoPoster });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err && err.message ? err.message : err);
  process.exitCode = 1;
});
