const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize express and dotenv
dotenv.config();
const app = express();

// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from your frontend

// MongoDB connection string
const db = 'mongodb+srv://shreyaganjoo:iATblM53nqy7Xp9o@cluster0.8rpdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Server port configuration
const PORT = process.env.PORT || 5000;

// Calling out all the models 
const User = require("./Models/userModel");
const Admin = require("./Models/adminModel");
const Driver = require("./Models/driverModel");
const Booking = require("./Models/bookingModel");
const Transaction = require("./Models/transactionModel");
const Feedback = require("./Models/feedbackModel");

// routing paths
const userRoute = require("./routes/userRoute");
const driverRoute = require("./routes/driverRoute");
const bookingRoute = require("./routes/bookingRoute");
app.use(express.json());

// Initialize MongoDB connection and start the server
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB successfully");

        // Start the server after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server running successfully on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
    });

app.use(userRoute);
app.use(driverRoute);
app.use(bookingRoute);