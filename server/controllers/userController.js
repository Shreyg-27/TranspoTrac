const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Sign Up Function
const userSignUp = async (req, res) => {
    const { name, password, email, phone, address } = req.body;

    // Check for missing fields
    if (!name || !password || !email) {
        return res.status(400).json({ error: "Please fill in all required fields (name, email, password)." });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "This email is already registered." });
        }

        // Create a new user object
        const newUser = new User({
            name,
            email,
            phone,
            address,
            password, 
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword;

        // Save the user to the database
        const savedUser = await newUser.save();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// Login Function
const UserLogin = async (req, res) => {
    console.log("Login request received:", req.body); // Log the incoming request data

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials!" });
        }

        console.log("User login successful!"); // Log for successful login
        return res.status(200).json({ msg: "Login successful" });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

// get the user profile
const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params; // Get email from URL parameters
        const user = await User.findOne({ email }).select("-password"); // Find user by email and exclude password

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return user profile data
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                bookingHistory: user.bookingHistory,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// update user details
const updateUserProfile = async (req, res) => {
    const { email, name, phone, address } = req.body;

    // Check if the email is provided
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    // Check for at least one field to update
    if (!name && !phone && !address) {
        return res.status(400).json({ error: "At least one field (name, phone, address) must be provided to update." });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        // Save the updated user
        const updatedUser = await user.save();

        // Return success response with updated user data
        return res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};


// delete user
const deleteUser = async (req, res) => {
    const email = req.params.email; // Extract email from the request parameters

    try {
        // Find the user by email and remove them from the database
        const deletedUser = await User.findOneAndDelete({ email });

        // If user not found
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// booking system is left in this will have to do later. 



module.exports = { userSignUp, UserLogin, getUserProfile, updateUserProfile, deleteUser };
