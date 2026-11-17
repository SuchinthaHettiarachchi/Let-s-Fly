// Checks whether an image URL is still referenced anywhere in the CMS database
// before it is permanently deleted from Cloudflare R2. Never delete an image that
// another page or CMS section still points at.
const Package = require('../models/Package');
const RentalTeaser = require('../models/RentalTeaser');
const HeroSlider = require('../models/HeroSlider');
const WhoWeAre = require('../models/WhoWeAre');
const HomeAbout = require('../models/HomeAbout');
const RentalVehicle = require('../models/RentalVehicle');
const GalleryItem = require('../models/GalleryItem');

/**
 * @param {string} url - image/video URL to check
 * @param {string|null} excludeVehicleId - vehicle id to ignore (the record being updated)
 * @returns {Promise<boolean>} true when at least one other record still uses the URL
 */
exports.isImageInUse = async (url, excludeVehicleId = null) => {
  if (!url || typeof url !== 'string') return false;
  const vehicleQuery = excludeVehicleId
    ? { image: url, _id: { $ne: excludeVehicleId } }
    : { image: url };
  const checks = [
    Package.exists({ $or: [{ image: url }, { gallery: url }] }),
    RentalTeaser.exists({ 'slots.image': url }),
    HeroSlider.exists({ $or: [{ 'slides.desktop': url }, { 'slides.mobile': url }] }),
    WhoWeAre.exists({ $or: [{ mainImage: url }, { insetImage: url }] }),
    HomeAbout.exists({ videoPoster: url }),
    RentalVehicle.exists(vehicleQuery),
    GalleryItem.exists({ media: url }),
  ];
  const results = await Promise.all(checks);
  return results.some(Boolean);
};

// Best-effort cleanup: removes the R2 object only when nothing references it anymore.
exports.deleteImageIfUnused = async (url, excludeVehicleId = null) => {
  if (!url) return false;
  try {
    const inUse = await exports.isImageInUse(url, excludeVehicleId);
    if (inUse) return false;
    return await require('./r2Service').deleteByUrl(url);
  } catch (error) {
    console.warn(`R2 image cleanup skipped for ${url}: ${error.message}`);
    return false;
  }
};
