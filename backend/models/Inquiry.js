const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['Contact', 'Plan my Trip Section', 'Air Ticket', 'Visa Inquiry', 'Travel Sri Lanka', 'Overseas Travel', 'Rentals', 'Travel Insurance', 'Hotels'],
      required: true,
    },
    subject: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    status: { type: String, enum: ['New', 'In Progress', 'Closed'], default: 'New' },
    comments: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Inquiry', inquirySchema);
