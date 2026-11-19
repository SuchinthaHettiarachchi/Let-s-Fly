const mongoose = require('mongoose');

const airTicketContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'air-tickets' },
    photo: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('AirTicketContent', airTicketContentSchema);
