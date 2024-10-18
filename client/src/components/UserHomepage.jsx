import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from './Navbar';

function HomePage() {
    const { email: emailParam } = useParams(); // Extract email from URL parameters
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const email = emailParam || Cookies.get('email'); // Use email from param or cookie
    const navigate = useNavigate();

    const handleCreateBooking = () => {
        navigate('/create-booking');  // Navigate to the booking page
    };

    useEffect(() => {
        if (!email) {
            console.error("No email found");
            return;
        }

        // Fetch the user profile using the email from the URL or cookie
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${email}/profile`);
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                } else {
                    console.error("Failed to fetch user profile:", data.error);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        // Fetch the user bookings
        const fetchUserBookings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user-bookings/${email}`);
                const data = await response.json();
                if (data.success) {
                    setBookings(data.bookings);
                } else {
                    console.error("Failed to fetch bookings:", data.error);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchUserProfile();
        fetchUserBookings();
    }, [email]); // Run this effect when the email changes

    if (!user) {
        return <div>Loading...</div>;
    }

    const activeBooking = {
        _id: "671181ad4d0b21262ebc3134",
        driverassigned:"Suresh Gupta",
        pickupLocation: "Rohini Delhi India",
        dropoffLocation: "Sector 76 Noida Uttar Pradesh, India",
        vehicleType: "small",
        estimatedCost: 345,
        status: "pending",
        createdAt: "2024-10-10T10:10:10",
        updatedAt: "2024-10-10T10:10:10"
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col bg-white">
                <main className="flex-grow px-8 py-6">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-4xl font-semibold">Hello, {user.name}!</h2>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                            onClick={handleCreateBooking}
                        >
                            Create New Booking
                        </button>
                    </div>

                    {/* Booking History */}
                    <section className="border border-yellow-500 rounded-md p-4 mb-6">
                        <h3 className="text-xl font-semibold">Booking History</h3>
                        {bookings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {bookings.map((booking, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
                                    >
                                        <div className="mb-2">
                                            <h4 className="text-lg font-semibold">Trip #{index + 1}</h4>
                                        </div>
                                        <div className="mb-2">
                                            <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                                            <p><strong>Dropoff Location:</strong> {booking.dropoffLocation}</p>
                                        </div>
                                        <div className="mb-2">
                                            <p>
                                                <strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>No bookings done till now.</p>
                                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                                    <h4 className="text-lg font-semibold">Tips for Your Next Booking</h4>
                                    <ul className="list-disc list-inside">
                                        <li>Check availability in advance.</li>
                                        <li>Look for discounts and offers.</li>
                                        <li>Consider the time of travel for better rates.</li>
                                        <li>Read reviews before finalizing your booking.</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>


                    {/* Active Booking */}
                    <section className="border border-blue-500 rounded-md p-4 mb-6">
                        <h3 className="text-xl font-semibold">Active Booking</h3>
                        <div className="border p-4 rounded-md shadow-md bg-white">
                            <p><strong>Pickup Location:</strong> {activeBooking.pickupLocation}</p>
                            <p><strong>Dropoff Location:</strong> {activeBooking.dropoffLocation}</p>
                            <p><strong>Driver Details:</strong> {activeBooking.driverassigned}</p>
                            <p><strong>Vehicle Type:</strong> {activeBooking.vehicleType}</p>
                            <p><strong>Estimated Cost:</strong> ₹{activeBooking.estimatedCost}</p>
                            <p><strong>Status:</strong> {activeBooking.status}</p>
                            <p><strong>Created At:</strong> {new Date(activeBooking.createdAt).toLocaleString()}</p>
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                                onClick={() => navigate('/drive/update')}
                            >
                                Show Trip Details
                            </button>
                        </div>
                    </section>
                </main>

                <footer className="bg-gray-100 py-4 px-8">
                    <div className="text-center text-gray-500 text-sm">
                        <p>Contact Us | Reviews | Policies</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default HomePage;
