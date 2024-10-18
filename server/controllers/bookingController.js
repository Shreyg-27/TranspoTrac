const Booking = require('../Models/bookingModel');
const User = require('../Models/userModel');
const Driver = require('../Models/driverModel');
const Feedback = require('../Models/feedbackModel');
const axios = require('axios');

// Function to get coordinates using LocationIQ
const getCoordinates = async (address) => {
    try {
        const response = await axios.get(
            `https://us1.locationiq.com/v1/search.php?key=API_KEY=${encodeURIComponent(address)}&format=json`
        );

        // Check if the response has results
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0]; // Get lat, lon from the first result
            return { lat, lon }; // Return the coordinates
        } else {
            throw new Error('Could not find coordinates for the provided address.');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error; // Rethrow the error for handling in the caller function
    }
};


// Create a new booking
// Create a new booking
const createBooking = async (req, res) => {
    const { userEmail, pickupLocation, dropoffLocation, vehicleType, estimatedCost } = req.body;

    try {
        // Validate input data
        if (!userEmail || !pickupLocation || !dropoffLocation || !vehicleType || !estimatedCost) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Convert pickup and dropoff locations to coordinates
        const pickupCoordinates = await getCoordinates(pickupLocation);
        const dropoffCoordinates = await getCoordinates(dropoffLocation);

        console.log('Pickup Coordinates:', pickupCoordinates);
        console.log('Dropoff Coordinates:', dropoffCoordinates);

        // Create a new booking
        const newBooking = new Booking({
            user: user._id,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
            status: 'pending',
            pickupCoordinates,
            dropoffCoordinates
        });

        // Save the booking to the database
        await newBooking.save();

        // Return success response with pickup coordinates
        return res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking: newBooking,
            pickupCoordinates // Send pickup coordinates to the frontend
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};



  
// const createBooking = async (req, res) => {
//     const { userEmail, driverEmail, pickupLocation, dropoffLocation, vehicleType, estimatedCost } = req.body;

//     try {
//         // Validate input data
//         if (!userEmail || !driverEmail || !pickupLocation || !dropoffLocation || !vehicleType || !estimatedCost) {
//             return res.status(400).json({ error: "All fields are required." });
//         }

//         // Find user by email
//         const user = await User.findOne({ email: userEmail });
//         if (!user) {
//             return res.status(404).json({ error: "User not found." });
//         }

//         // Find driver by email
//         const driver = await Driver.findOne({ email: driverEmail });
//         if (!driver) {
//             return res.status(404).json({ error: "Driver not found." });
//         }

//         // Create a new booking
//         const newBooking = new Booking({
//             user: user._id,  // Use user ID
//             driver: driver._id,  // Use driver ID
//             pickupLocation,
//             dropoffLocation,
//             vehicleType,
//             estimatedCost,
//             status: 'pending',  // Set initial status to 'pending'
//         });

//         // Save the booking to the database
//         await newBooking.save();

//         // Return success response
//         return res.status(201).json({
//             success: true,
//             message: "Booking created successfully.",
//             booking: newBooking, // Optionally return the created booking details
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Server error. Please try again later." });
//     }
// };

// get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'email') // Populate user email
            .populate('driver', 'email') // Populate driver email
            .select('-__v'); // Exclude __v field

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// get user bookings
const getUserBookings = async (req, res) => {
    const { userEmail } = req.params; // Assuming userEmail is passed in the URL

    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const bookings = await Booking.find({ user: user._id })
            .populate('driver', 'email') // Populate driver email
            .select('-__v'); // Exclude __v field

        if (bookings.length === 0) {
            return res.status(404).json({ error: "No bookings found for this user." });
        }

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// get the driver bookings
const getDriverBookings = async (req, res) => {
    const { driverEmail } = req.params; // Assuming driverEmail is passed in the URL

    try {
        // Find driver by email
        const driver = await Driver.findOne({ email: driverEmail });
        if (!driver) {
            return res.status(404).json({ error: "Driver not found." });
        }

        const bookings = await Booking.find({ driver: driver._id })
            .populate('user', 'email') // Populate user email
            .select('-__v'); // Exclude __v field

        if (bookings.length === 0) {
            return res.status(404).json({ error: "No bookings found for this driver." });
        }

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// update booking status
const updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params; // Booking ID from the URL
    const { newStatus } = req.body; // New status from request body

    // Define valid status transitions
    const validStatusTransitions = {
        pending: ['in-progress', 'canceled'],
        'in-progress': ['completed', 'canceled'],
        completed: [], // No further transitions allowed
        canceled: [] // No further transitions allowed
    };

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Check if the new status is a valid transition
        const currentStatus = booking.status;
        if (!validStatusTransitions[currentStatus].includes(newStatus)) {
            return res.status(400).json({ error: `Cannot transition from ${currentStatus} to ${newStatus}.` });
        }

        // Update booking status
        booking.status = newStatus;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: `Booking status updated to ${newStatus}.`,
            booking
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// cancel booking
const cancelBooking = async (req, res) => {
    const { bookingId } = req.params; // Booking ID from the URL

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Check if the booking is already canceled
        if (booking.status === 'canceled') {
            return res.status(400).json({ error: "Booking is already canceled." });
        }

        // Update booking status to 'canceled'
        booking.status = 'canceled';
        await booking.save();

        // Notify driver or any other necessary business logic can be added here
        // For example, sending a notification to the driver about the cancellation

        return res.status(200).json({
            success: true,
            message: "Booking has been successfully canceled.",
            booking
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// assign driver WILL HAVE TO CHECK IT AND SEE WHERE TO USE
const assignDriverToBooking = async (req, res) => {
    const { bookingId, driverEmail } = req.body;

    try {
        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Check if driver is available (you may need to implement this logic)
        const driver = await Driver.findOne({ email: driverEmail });
        if (!driver) {
            return res.status(404).json({ error: "Driver not found." });
        }
        
        // Check driver's current status (available)
        if (driver.status !== 'available') {
            return res.status(400).json({ error: "Driver is not available." });
        }

        // Assign driver and update booking status
        booking.driver = driver._id;
        booking.status = 'in-progress';
        
        
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Driver assigned successfully.",
            booking
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// same for unassign, WILL HAVE TO SEE WHERE TO USE THIS AND HOW TO DO THIS
const unassignDriverFromBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Unassign driver and set status back to pending
        booking.driver = null; // or handle according to your logic
        booking.status = 'pending';
        
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Driver unassigned successfully.",
            booking
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// ANALYTICS SECTION

// count of all bookings
const getTotalBookings = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        return res.status(200).json({ totalBookings });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};
// get cout by status
const getBookingsByStatus = async (req, res) => {
    try {
        const bookingsByStatus = await Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        return res.status(200).json({ bookingsByStatus });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};
// get avg cost
const getAverageCost = async (req, res) => {
    try {
        const averageCost = await Booking.aggregate([
            { $group: { _id: null, averageCost: { $avg: "$estimatedCost" } } }
        ]);
        return res.status(200).json({ averageCost: averageCost[0]?.averageCost || 0 });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};


// FEEDBACK mechanism
const submitFeedback = async (req, res) => {
    const { bookingId, userId, rating, comments } = req.body;

    try {
        const feedback = new Feedback({ bookingId, userId, rating, comments });
        await feedback.save();

        return res.status(201).json({ success: true, message: 'Feedback submitted successfully.', feedback });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to submit feedback.' });
    }
};














module.exports = {createBooking, getAllBookings, getUserBookings, getDriverBookings, updateBookingStatus, cancelBooking, assignDriverToBooking, 
    unassignDriverFromBooking, getTotalBookings, getBookingsByStatus, getAverageCost, submitFeedback};
