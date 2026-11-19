const AirTicketContent = require('../models/AirTicketContent');
const AirTicketRoute = require('../models/AirTicketRoute');
const imageRefService = require('./imageRefService');
const { contentDefaults, routeDefaults } = require('../data/airTicketsDefaults');

const stripKey = (doc) => {
  if (!doc) return null;
  const { key, __v, ...rest } = doc;
  return rest;
};

async function ensureSeeded() {
  let content = await AirTicketContent.findOne({ key: 'air-tickets' }).lean();
  if (!content) {
    content = await AirTicketContent.create(contentDefaults).then((d) => d.toObject());
  }
  const routeCount = await AirTicketRoute.countDocuments();
  if (routeCount === 0 && Array.isArray(routeDefaults) && routeDefaults.length) {
    await AirTicketRoute.insertMany(routeDefaults, { ordered: false }).catch(() => []);
  }
  return stripKey(content);
}

exports.getPublic = async () => {
  const content = await ensureSeeded();
  const routes = await AirTicketRoute.find({}).sort({ sortOrder: 1, createdAt: -1, _id: -1 }).lean();
  return { content, routes };
};

exports.getContent = async () => {
  const content = await ensureSeeded();
  return content;
};

exports.saveContent = async (data) => {
  const existing = await AirTicketContent.findOne({ key: 'air-tickets' }).lean();
  const doc = await AirTicketContent.findOneAndUpdate(
    { key: 'air-tickets' },
    { $set: { ...data, key: 'air-tickets' } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  ).lean();
  // Clean up replaced hero photo if unused elsewhere.
  if (existing?.photo && data.photo !== existing.photo) {
    await imageRefService.deleteImageIfUnused(existing.photo);
  }
  return stripKey(doc);
};

exports.listRoutes = async () => {
  await ensureSeeded();
  return AirTicketRoute.find({}).sort({ sortOrder: 1, createdAt: -1, _id: -1 }).lean();
};

exports.createRoute = async (data) => {
  await ensureSeeded();
  const route = await AirTicketRoute.create(data);
  return route.toObject();
};

exports.updateRoute = async (id, data) => {
  const before = await AirTicketRoute.findById(id).lean();
  if (!before) return null;
  const updated = await AirTicketRoute.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (before.image && data.image !== undefined && data.image !== before.image) {
    await imageRefService.deleteImageIfUnused(before.image, id);
  }
  return updated;
};

exports.deleteRoute = async (id) => {
  const removed = await AirTicketRoute.findByIdAndDelete(id).lean();
  if (!removed) return null;
  if (removed.image) await imageRefService.deleteImageIfUnused(removed.image);
  return removed;
};
