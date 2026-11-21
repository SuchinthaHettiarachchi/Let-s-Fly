const Inquiry = require('../models/Inquiry');
const defaults = require('../data/inquiryDefaults');

const toDto = (doc) => ({
  id: String(doc._id),
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
  customerName: doc.customerName,
  email: doc.email || '',
  phone: doc.phone || '',
  category: doc.category,
  subject: doc.subject || '',
  message: doc.message || '',
  status: doc.status,
  comments: Array.isArray(doc.comments) ? doc.comments : [],
});

let seedPromise = null;
const seedIfEmpty = async () => {
  if (!seedPromise) {
    seedPromise = (async () => {
      if (!(await Inquiry.countDocuments())) {
        await Inquiry.insertMany(defaults, { ordered: false }).catch(() => {});
      }
    })();
  }
  return seedPromise;
};

exports.list = async () => {
  await seedIfEmpty();
  const docs = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
  return docs.map(toDto);
};

exports.create = async (data) => {
  await seedIfEmpty();
  return toDto(await Inquiry.create(data));
};

exports.updateStatus = async (id, status) => {
  const doc = await Inquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
  return doc ? toDto(doc) : null;
};

exports.addComment = async (id, comment) => {
  const doc = await Inquiry.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true }).lean();
  return doc ? toDto(doc) : null;
};

exports.remove = async (id) => Boolean(await Inquiry.findByIdAndDelete(id));
