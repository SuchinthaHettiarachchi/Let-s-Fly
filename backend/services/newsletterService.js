const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const toDto = (doc) => ({
  id: String(doc._id),
  email: doc.email,
  source: doc.source || 'website',
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
});

exports.subscribe = async ({ email, source }) => {
  await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { $set: { email, source } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return { email };
};

exports.list = async () => {
  const docs = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean();
  return docs.map(toDto);
};

exports.remove = async (id) => Boolean(await NewsletterSubscriber.findByIdAndDelete(id));
