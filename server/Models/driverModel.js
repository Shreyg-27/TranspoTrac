const mongoose = require('mongoose');

// const driverSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   name: { type: String, required: true },
//   password: { type: String, required: true },
//   phone: { type: String },
//   isAvailable: { type: Boolean, default: true }, // Driver availability
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], required: true }, // [longitude, latitude]
//   },
//   vehicleType: { type: String, enum: ['small', 'medium', 'large'], required: true }, // Vehicle type field
// });

const driverSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  vehicleNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  vehicleType: { type: String, enum: ['small', 'medium', 'large'], required: true },
  location: { // Update here for better geospatial handling
    type: { type: String, enum: ['Point'], default: 'Point' }, // Ensure type is Point for geospatial indexing
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }
});

driverSchema.index({ location: '2dsphere' }); // Enable geospatial queries
module.exports = mongoose.model('Driver', driverSchema);


