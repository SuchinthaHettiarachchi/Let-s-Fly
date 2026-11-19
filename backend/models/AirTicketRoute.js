const mongoose = require('mongoose');

const airTicketRouteSchema = new mongoose.Schema(
  {
    startLocation: { type: String, required: true, trim: true },
    endLocation: { type: String, required: true, trim: true },
    pricePerPerson: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('AirTicketRoute', airTicketRouteSchema);
