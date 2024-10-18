import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DriverNavbar from './DriverNavbar';
import L from 'leaflet'; // Import Leaflet
import { bookingData } from './bookings.js'; // Import booking data

function DriverHomePage() {
    const { email: emailParam } = useParams();
    const [driver, setDriver] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
    const [activeBookings, setActiveBookings] = useState(bookingData); // Store active bookings
    const email = emailParam || Cookies.get('email');
    const navigate = useNavigate();
    const mapRef = useRef(null); // Create a ref for the map instance

    useEffect(() => {
        if (!email) {
            console.error("No email found");
            return;
        }

        // Fetch the driver profile
        const fetchDriverProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/driver/${email}/profile`);
                const data = await response.json();
                if (data.success) {
                    setDriver(data.driver);
                } else {
                    console.error("Failed to fetch driver profile:", data.error);
                }
            } catch (error) {
                console.error("Error fetching driver profile:", error);
            }
        };

        fetchDriverProfile();
    }, [email]);

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });
                    initializeMap(latitude, longitude); // Initialize the map with the current location
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setCurrentLocation({ latitude: 'Error', longitude: 'Error' });
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const initializeMap = (latitude, longitude) => {
        // Check if the map is already initialized
        if (mapRef.current) {
            // If the map is already initialized, just set the view
            mapRef.current.setView([latitude, longitude], 13);
            return; // Exit the function
        }

        // Create a map centered on the current location
        mapRef.current = L.map('mymap').setView([latitude, longitude], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 20,
            minZoom: 2,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(mapRef.current);

        L.marker([latitude, longitude]).addTo(mapRef.current)
            .bindPopup('You are here!')
            .openPopup();
    };

    // Handle reject booking
    const handleReject = (id) => {
        setActiveBookings((prevBookings) => prevBookings.filter(booking => booking._id.$oid !== id));
    };

    // Handle accept booking
    const handleAccept = (id) => {
        navigate('/drive/update');
    };

    if (!driver) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DriverNavbar />
            <div className="min-h-screen flex flex-col bg-white">
                <main className="flex-grow px-8 py-6">
                    <div className="mb-6">
                        <h2 className="text-4xl font-semibold">Hello, {driver.name}!</h2>
                    </div>

                    <section className="border border-yellow-500 rounded-md p-4 mb-6">
                        <h3 className="text-xl font-semibold">Driver Details</h3>
                        <p><strong>Availability Status:</strong> {driver.isAvailable ? "Available" : "Not Available"}</p>
                        <p><strong>Vehicle Type:</strong> {driver.vehicleType}</p>
                        <p><strong>Vehicle Number:</strong> {driver.vehicleNumber}</p>
                        <p><strong>Phone Number:</strong> {driver.phone}</p>
                    </section>

                    {/* Section for updating the current location */}
                    <section className="border border-yellow-500 rounded-md p-4 mb-6">
                        <h3 className="text-xl font-semibold">Update Current Location</h3>
                        <p>You can update your current location by clicking the button below:</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={getCurrentLocation}
                        >
                            Get Current Location
                        </button>
                        {currentLocation.latitude && currentLocation.longitude ? (
                            <div className="mt-4">
                                <p><strong>Latitude:</strong> {currentLocation.latitude}</p>
                                <p><strong>Longitude:</strong> {currentLocation.longitude}</p>
                            </div>
                        ) : (
                            <p id="demo" className="mt-4">Click the button to get your location.</p>
                        )}
                    </section>

                    {/* Map Section */}
                    <div id="mymap" style={{ width: '300px', height: '300px', margin: '0 auto' }}></div>

                    {/* Active Bookings Section */}
                    <section className="border border-yellow-500 rounded-md p-4 mt-6">
                        <h3 className="text-xl font-semibold">Active Bookings</h3>
                        {activeBookings.length > 0 ? (
                            activeBookings.map((booking) => (
                                <div key={booking._id.$oid} className="bg-gray-100 p-4 mb-4 rounded-md shadow-md">
                                    <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                                    <p><strong>Dropoff Location:</strong> {booking.dropoffLocation}</p>
                                    <p><strong>Estimated Cost:</strong> ₹{booking.estimatedCost.$numberInt}</p>
                                    <div className="flex mt-4">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                            onClick={() => handleAccept(booking._id.$oid)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleReject(booking._id.$oid)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No active bookings.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DriverHomePage;
