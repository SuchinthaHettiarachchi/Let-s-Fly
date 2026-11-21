const Package = require('../models/Package');
const Project = require('../models/Project');
const GalleryItem = require('../models/GalleryItem');
const RentalVehicle = require('../models/RentalVehicle');
const r2Service = require('./r2Service');
const config = require('../config/config');

exports.getCounts = async () => {
  const [packages, projects, galleryImages, vehicles] = await Promise.all([
    Package.countDocuments({}),
    Project.countDocuments({}),
    GalleryItem.countDocuments({ mediaType: 'image' }),
    RentalVehicle.countDocuments({}),
  ]);
  return { packages, projects, galleryImages, vehicles };
};

const emptyStorage = (quotaBytes, error) => ({
  usedBytes: 0,
  quotaBytes,
  objectCount: 0,
  percent: 0,
  unavailable: true,
  error,
});

exports.getStorage = async () => {
  const { quotaBytes } = config.r2;
  try {
    const { usedBytes, objectCount } = await r2Service.getStorageUsage();
    return {
      usedBytes,
      quotaBytes,
      objectCount,
      percent: quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 1000) / 10) : 0,
      unavailable: false,
    };
  } catch (error) {
    return emptyStorage(quotaBytes, error instanceof Error ? error.message : 'Could not load R2 storage');
  }
};
