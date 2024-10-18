const express = require('express');
const { createBooking, getAllBookings, getUserBookings , getDriverBookings, updateBookingStatus, cancelBooking, assignDriverToBooking, unassignDriverFromBooking, 
    getTotalBookings, getBookingsByStatus, getAverageCost, submitFeedback} = require('../controllers/bookingController');
const router = express.Router();

// Create a new booking
router.post('/bookings', createBooking);
router.get('/allbookings', getAllBookings);
router.get('/user-bookings/:userEmail', getUserBookings);
router.get('/driver-bookings/:driverEmail', getDriverBookings);
router.put('/bookings/:bookingId/status', updateBookingStatus);
router.delete('/bookings/:bookingId', cancelBooking);
// these 2 are on halt right now assign and unassign
router.put('/bookings/:bookingId/assign-driver', assignDriverToBooking);
router.put('/bookings/:bookingId/unassign-driver', unassignDriverFromBooking);
// ANALYTICS SECTION
router.get('/analytics/total-bookings', getTotalBookings);
router.get('/analytics/bookings-by-status', getBookingsByStatus);
router.get('/analytics/average-cost', getAverageCost);
// submitting feedback
router.post('/feedback', submitFeedback);


module.exports = router;
