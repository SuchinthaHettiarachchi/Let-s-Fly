const Project = require('../models/Project');
const defaults = require('../data/projectDefaults');
const { httpError } = require('../middleware/error');

const toDto = (doc) => ({
  id: String(doc._id),
  slug: doc.slug,
  title: doc.title,
  category: doc.category,
  date: doc.date || '',
  summary: doc.summary || '',
  description: doc.description || '',
  cover: {
    src: doc.cover?.src || '',
    alt: doc.cover?.alt || '',
    name: doc.cover?.name || '',
  },
  gallery: (doc.gallery || []).map((item) => ({
    src: item.src || '',
    alt: item.alt || '',
    name: item.name || '',
  })),
  status: doc.status,
  sortOrder: doc.sortOrder ?? 0,
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).getTime() : Date.now(),
});

let seedPromise = null;
const seedIfEmpty = async () => {
  if (!seedPromise) {
    seedPromise = (async () => {
      if (!(await Project.countDocuments())) {
        await Project.insertMany(defaults, { ordered: false }).catch(() => {});
      }
    })();
  }
  return seedPromise;
};

exports.list = async ({ publishedOnly = false } = {}) => {
  await seedIfEmpty();
  const query = publishedOnly ? { status: 'published' } : {};
  const docs = await Project.find(query).sort({ sortOrder: 1, date: -1, createdAt: -1 }).lean();
  return docs.map(toDto);
};

exports.getBySlug = async (slug) => {
  await seedIfEmpty();
  const doc = await Project.findOne({ slug, status: 'published' }).lean();
  return doc ? toDto(doc) : null;
};

exports.create = async (data) => {
  const doc = await Project.create(data);
  return toDto(doc);
};

exports.update = async (id, data) => {
  const doc = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  return doc ? toDto(doc) : null;
};

exports.remove = async (id) => Boolean(await Project.findByIdAndDelete(id));

exports.assertExists = async (id) => {
  if (!(await Project.exists({ _id: id }))) throw httpError(404, 'Project not found');
};
