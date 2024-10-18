const express = require('express');
const { userSignUp, UserLogin, getUserProfile, updateUserProfile, deleteUser } = require('../controllers/userController'); // Assuming userRoutes has the route handlers

const router = express.Router();

// Define routes
router.post('/signup', userSignUp);
router.post('/login', UserLogin);
router.get('/user/:email/profile', getUserProfile);
router.put('/user/:email/updateprofile', updateUserProfile); 
router.delete('/user/:email/delete', deleteUser);


module.exports = router;
