const Package = require('../models/Package');

const getLatestPackages = () => Package.find({})
  .sort({ createdAt: -1, _id: -1 })
  .limit(12)
  .lean();

module.exports = { getLatestPackages };
