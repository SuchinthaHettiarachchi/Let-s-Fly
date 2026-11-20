const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['meetings', 'incentives', 'conferences', 'exhibitions'],
      required: true,
    },
    date: { type: String, default: '' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    cover: { type: imageSchema, default: () => ({ src: '', alt: '', name: '' }) },
    gallery: { type: [imageSchema], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Project', projectSchema);
