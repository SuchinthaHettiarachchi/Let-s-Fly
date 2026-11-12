const Package = require('../models/Package');

const getLatestPackages = () => Package.find({})
  .sort({ createdAt: -1, _id: -1 })
  .limit(12)
  .lean();

const listPackages = (category) => {
  const query = category ? { category } : {};
  return Package.find(query).sort({ createdAt: -1, _id: -1 }).lean();
};

const getPackageBySlug = (slug) => Package.findOne({ slug }).lean();
const createPackage = (data) => Package.create(data);
const updatePackage = (id, data) => {
  const changes = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  return Package.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).lean();
};
const deletePackage = (id) => Package.findByIdAndDelete(id);

module.exports = { getLatestPackages, listPackages, getPackageBySlug, createPackage, updatePackage, deletePackage };
