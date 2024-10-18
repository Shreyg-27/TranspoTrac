const express = require('express');
const { createDriver, getDriverProfile, updateDriverProfile, deleteDriver, DriverLogin, updateDriverLocation, getAvailableDrivers } = require('../controllers/driverController'); // Assuming userRoutes has the route handlers

const router = express.Router();

// Define routes
router.post('/driver/signup', createDriver);
router.get('/driver/:email/profile', getDriverProfile);
router.put('/driver/:email/update', updateDriverProfile);
router.delete('/driver/:email/delete', deleteDriver);
router.post('/driver/login', DriverLogin);
router.put('/drivers/location', updateDriverLocation);
router.get('/drivers/available', getAvailableDrivers);

module.exports = router;
