const Driver = require("../Models/driverModel");
const bcrypt = require("bcryptjs");

// create a driver
const createDriver = async (req, res) => {
    const { name, email, password, vehicleType, vehicleNumber, phoneNumber } = req.body;

    console.log("Request Body: ", req.body); // Log the request body to inspect received data

    // Check if all required fields are provided
    if (!name || !email || !password || !vehicleType || !vehicleNumber || !phoneNumber) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Check if driver with the same email already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ error: "Driver with this email already exists." });
        }

        // Hash the password before saving the driver
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new driver with hashed password and other required fields
        const newDriver = new Driver({
            name,
            email,
            password: hashedPassword,
            vehicleType,
            vehicleNumber, // Include vehicle number
            phone: phoneNumber, // Include phone number
            isAvailable: true,  // Default value when creating a new driver
        });

        // Save the driver to the database
        await newDriver.save();

        console.log("New Driver Created: ", newDriver); // Log new driver info
        return res.status(201).json({ success: true, driver: newDriver });
    } catch (err) {
        console.error("Error creating driver: ", err); // Log any errors
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};


// Driver Login Function
const DriverLogin = async (req, res) => {
    console.log("Driver login request received:", req.body); // Log the incoming request data

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(404).json({ error: "Driver not found" });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials!" });
        }

        console.log("Driver login successful!"); // Log for successful login
        return res.status(200).json({ msg: "Login successful" });

    } catch (err) {
        console.error("Error during driver login:", err);
        return res.status(500).json({ error: "Server error" });
    }
};


// get the driver profile 
const getDriverProfile = async (req, res) => {
    try {
        const { email } = req.params; // Get email from URL parameters
        
        // Find driver by email and exclude the password field
        const driver = await Driver.findOne({ email }).select("-password");

        // Check if driver exists
        if (!driver) {
            return res.status(404).json({ error: "Driver not found." });
        }

        // Return driver profile data with additional fields
        return res.status(200).json({
            success: true,
            driver: {
                id: driver._id,                  // Driver ID
                name: driver.name,               // Driver name
                email: driver.email,             // Driver email
                status: driver.status,           // Driver status (assuming you have a status field)
                vehicleType: driver.vehicleType, // Vehicle type
                vehicleNumber: driver.vehicleNumber, // Vehicle number
                phone: driver.phone,             // Driver phone number
                isAvailable: driver.isAvailable, // Availability status
                currentLocation: driver.currentLocation, // Current location
            },
        });
    } catch (err) {
        console.error("Error fetching driver profile:", err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

const updateDriverLocation = async (req, res) => {
    const { email, latitude, longitude } = req.body;

    try {
        // Validate latitude and longitude
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Invalid latitude or longitude.' });
        }

        // Check if driver exists
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found.' });
        }

        // Update the location using GeoJSON format
        driver.location = {
            type: 'Point',
            coordinates: [longitude, latitude] // Longitude first, then latitude
        };

        // Save updated driver profile
        const updatedDriver = await driver.save();

        return res.status(200).json({
            success: true,
            message: 'Driver location updated successfully.',
            driver: updatedDriver
        });
    } catch (error) {
        console.error('Error updating driver location:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};




// update the driver profile
const updateDriverProfile = async (req, res) => {
    const { name, email, password, vehicleType } = req.body;

    // Check if the email is provided
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    // Check for at least one field to update
    if (!name && !password && !vehicleType) {
        return res.status(400).json({ error: "At least one field (name, password, vehicleType) must be provided to update." });
    }

    try {
        // Find the driver by email
        const driver = await Driver.findOne({ email });

        // If driver not found
        if (!driver) {
            return res.status(404).json({ error: "Driver not found." });
        }

        // Update fields if provided
        if (name) driver.name = name;
        if (vehicleType) driver.vehicleType = vehicleType;

        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            driver.password = await bcrypt.hash(password, salt);
        }

        // Save the updated driver profile
        const updatedDriver = await driver.save();

        // Return success response with updated driver data
        return res.status(200).json({
            success: true,
            driver: {
                id: updatedDriver._id,
                name: updatedDriver.name,
                email: updatedDriver.email,
                vehicleType: updatedDriver.vehicleType
            },
        });
    } catch (err) {
        console.error("Error updating driver profile:", err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// delete driver
const deleteDriver = async (req, res) => {
    const email = req.params.email; // Extract email from the request parameters

    try {
        // Find the driver by email and remove them from the database
        const deletedDriver = await Driver.findOneAndDelete({ email });

        // If driver not found
        if (!deletedDriver) {
            return res.status(404).json({ error: "Driver not found." });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Driver deleted successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// get all drivers
const getAvailableDrivers = async (req, res) => {
    try {
        // Fetch drivers where isAvailable is true
        const availableDrivers = await Driver.find({ isAvailable: true });
        res.status(200).json({ success: true, data: availableDrivers });
    } catch (error) {
        console.error('Error fetching available drivers:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};




module.exports = { createDriver, getDriverProfile, updateDriverProfile, deleteDriver, DriverLogin, updateDriverLocation, getAvailableDrivers };
