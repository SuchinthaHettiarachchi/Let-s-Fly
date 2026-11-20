const Job = require('../models/Job');
const JobSetting = require('../models/JobSetting');
const defaults = require('../data/jobDefaults');

const toDto = (doc) => ({
  id: String(doc._id),
  title: doc.title,
  icon: doc.icon || 'work',
  status: doc.status,
  employment: doc.employment || '',
  location: doc.location || '',
  experience: doc.experience || '',
  description: doc.description || '',
  posted: doc.posted || '',
  visible: doc.visible !== false,
  sortOrder: doc.sortOrder ?? 0,
  meta: [
    { icon: 'work', label: doc.employment || '' },
    { icon: 'location_on', label: doc.location || '' },
    { icon: 'schedule', label: doc.experience || '' },
  ].filter((item) => item.label),
});

let seedPromise = null;
const seedIfEmpty = async () => {
  if (!seedPromise) {
    seedPromise = (async () => {
      if (!(await Job.countDocuments())) {
        await Job.insertMany(defaults, { ordered: false }).catch(() => {});
      }
      await JobSetting.findOneAndUpdate(
        { key: 'job-settings' },
        { $setOnInsert: { key: 'job-settings', sectionVisible: true } },
        { upsert: true, new: true },
      ).catch(() => {});
    })();
  }
  return seedPromise;
};

exports.list = async ({ publicOnly = false } = {}) => {
  await seedIfEmpty();
  const query = publicOnly ? { visible: true } : {};
  const docs = await Job.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return docs.map(toDto);
};

exports.getById = async (id) => {
  await seedIfEmpty();
  const doc = await Job.findById(id).lean();
  return doc ? toDto(doc) : null;
};

exports.create = async (data) => {
  await seedIfEmpty();
  return toDto(await Job.create(data));
};

exports.update = async (id, data) => {
  const doc = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  return doc ? toDto(doc) : null;
};

exports.remove = async (id) => Boolean(await Job.findByIdAndDelete(id));

exports.getSettings = async () => {
  await seedIfEmpty();
  const doc = await JobSetting.findOne({ key: 'job-settings' }).lean();
  return { sectionVisible: doc ? doc.sectionVisible !== false : true };
};

exports.saveSettings = async ({ sectionVisible }) => {
  await seedIfEmpty();
  const doc = await JobSetting.findOneAndUpdate(
    { key: 'job-settings' },
    { sectionVisible },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return { sectionVisible: doc.sectionVisible !== false };
};
