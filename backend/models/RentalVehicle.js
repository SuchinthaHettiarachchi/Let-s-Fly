const mongoose = require('mongoose');

const rentalVehicleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalCategory', required: true },
  seats: { type: Number, required: true, min: 1 },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
  fuel: { type: String, enum: ['Hybrid', 'Diesel', 'Petrol'], required: true },
  modes: {
    type: [{ type: String, enum: ['self-drive', 'with-driver'] }],
    validate: [(v) => v.length > 0, 'At least one drive mode is required'],
    default: () => ['self-drive', 'with-driver'],
  },
  image: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RentalVehicle', rentalVehicleSchema);
