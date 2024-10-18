import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import driversData from './drivers';

function CreateBooking() {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    vehicleType: 'small',
    estimatedCost: '',
  });

  const [nearestDriver, setNearestDriver] = useState(null); // State to hold the nearest driver
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false); // State for booking confirmation

  // useEffect to log/display the nearest driver information
  useEffect(() => {
    if (nearestDriver) {
      const minDistance = calculateDistance(
        { lat: nearestDriver.location.lat, lng: nearestDriver.location.lng }, 
        nearestDriver.location // Assuming this is the pickup location
      );
      console.log(`Nearest Driver: ${nearestDriver.name}, Distance: ${minDistance.toFixed(2)} km`);
      // Display in UI if needed
    }
  }, [nearestDriver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const calculateDistance = (coords1, coords2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
    const dLon = (coords2.lng - coords1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1.lat * (Math.PI / 180)) * Math.cos(coords2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = Cookies.get('email');

    if (!bookingData.pickupLocation || !bookingData.dropoffLocation || !bookingData.estimatedCost) {
        alert('Please fill in all fields.');
        return;
    }

    // Construct the body to send to backend
    const body = {
        userEmail,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        vehicleType: bookingData.vehicleType,
        estimatedCost: bookingData.estimatedCost,
    };

    try {
        const response = await fetch('http://localhost:5000/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();

        if (response.ok) {
            console.log('Booking successful:', data);
            setIsBookingSuccessful(true); // Set booking success state
            alert('Booking created successfully!');

            // Use pickupCoordinates from response to find the nearest driver
            const pickupCoordinates = data.pickupCoordinates;
            findNearestDriver(pickupCoordinates); // Pass the pickup coordinates to this function
        } else {
            console.error('Error creating booking:', data);
            alert(data.error || 'Booking creation failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error, please try again later.');
    }
  };

  // Update the findNearestDriver function to accept pickupCoordinates
  const findNearestDriver = (pickupCoordinates) => {
    const availableDrivers = driversData.data.filter(driver => driver.isAvailable);
    console.log("Available Drivers", availableDrivers);
    let minDistance = Infinity;
    let nearestDriver = null; // Initialize nearestDriver variable here

    availableDrivers.forEach(driver => {
        console.log("Driver's Location:", driver.location);
        console.log("Pickup Coordinates", pickupCoordinates);
        
        // Extracting coordinates from driver's location
        const driverCoords = {
            lat: driver.location.coordinates[1], // Latitude is at index 1
            lng: driver.location.coordinates[0], // Longitude is at index 0
        };

        // Convert pickup coordinates to numbers
        const pickupCoords = {
            lat: parseFloat(pickupCoordinates.lat), // Convert lat to number
            lng: parseFloat(pickupCoordinates.lon), // Convert lon to number
        };

        const distance = calculateDistance(driverCoords, pickupCoords);
        console.log(`Distance to Driver ${driver._id}: ${distance.toFixed(2)} km`); // Log each driver's distance
        if (distance < minDistance) {
            minDistance = distance;
            nearestDriver = driver; // Set the nearest driver
        }
    });

    setNearestDriver(nearestDriver); // Update nearest driver after the loop
    console.log("Nearest Driver:", nearestDriver);
    console.log("Minimum Distance:", minDistance);
};

  const handleConfirmBooking = () => {
    // Handle the confirmation logic here, like updating the state or sending a confirmation to the backend
    alert(`Booking confirmed for ${nearestDriver.name}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center py-4 px-8 bg-yellow-500">
        <h1 className="text-xl font-bold text-black">TranspoTrac</h1>
      </header>

      <main className="flex flex-col lg:flex-row justify-center items-center flex-grow">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <div className="relative">
            <img
              src="https://th.bing.com/th/id/OIP.OPH4oJdeW9zZQ6jMR_FqbAHaE7?w=297&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Passenger in car"
              className="rounded-lg object-cover w-full h-full"
            />
            <div className="absolute inset-0 border-4 border-yellow-500 rounded-lg"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 px-8">
          <h2 className="text-3xl font-semibold mb-6">Create a Booking</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="pickupLocation"
              placeholder="Enter Pickup Location (lat,lng)"
              value={bookingData.pickupLocation}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />
            <input
              type="text"
              name="dropoffLocation"
              placeholder="Enter Dropoff Location"
              value={bookingData.dropoffLocation}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />
            <select
              name="vehicleType"
              value={bookingData.vehicleType}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <input
              type="number"
              name="estimatedCost"
              placeholder="Estimated Cost"
              value={bookingData.estimatedCost}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
            >
              Create Booking
            </button>
          </form>

          {/* Nearest Driver Info Card */}
          {nearestDriver && isBookingSuccessful && (
            <div className="mt-6 p-4 border border-yellow-500 rounded-md">
              <h3 className="text-xl font-bold">{nearestDriver.name}</h3>
              <p>Email: {nearestDriver.email}</p>
              <p>Phone: {nearestDriver.phone}</p>
              <p>Vehicle Number: {nearestDriver.vehicleNumber}</p>
              <button
                onClick={handleConfirmBooking}
                className="mt-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-8 lg:px-16">
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 TranspoTrac. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default CreateBooking;
