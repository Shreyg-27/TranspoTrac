const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  vehicleType: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'canceled'], default: 'pending' },
  scheduledTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
