const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: 'work' },
    status: { type: String, enum: ['Hiring', 'Soon', 'Open'], default: 'Hiring' },
    employment: { type: String, default: 'Full-time' },
    location: { type: String, default: 'Rajagiriya' },
    experience: { type: String, default: '' },
    description: { type: String, default: '' },
    posted: { type: String, default: 'Posted recently' },
    visible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Job', jobSchema);
