const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'job-settings' },
    sectionVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('JobSetting', settingSchema);
