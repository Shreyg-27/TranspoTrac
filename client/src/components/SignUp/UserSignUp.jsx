import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserSignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        address: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleButtonClick = () => {
        // Additional functionality on button click
        console.log('Sign up button clicked!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/login'); // Redirecting to the login page
            } else {
                console.error('Error signing up:', data);
                setErrorMessage(data.message || 'Signup failed. Please try again.'); // Show error message
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setErrorMessage('Network error. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            <header className="flex justify-between items-center py-4 px-8 bg-yellow-500">
                <h1 className="text-xl font-bold text-black">TranspoTrac</h1>
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded">
                    <Link to="/login" className="block w-full h-full">
                        Login
                    </Link>
                </button>
            </header>

            {/* Main Section */}
            <main className="flex flex-col lg:flex-row justify-center items-center lg:space-x-16 py-12 px-8 lg:px-16">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                    <div className="relative">
                        <img
                            src="https://th.bing.com/th/id/OIP.OPH4oJdeW9zZQ6jMR_FqbAHaE7?w=297&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                            alt="Passenger in car"
                            className="rounded-lg object-cover w-full"
                        />
                        <div className="absolute inset-0 border-4 border-yellow-500 rounded-lg"></div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-3xl font-semibold mb-6">Move Goods with Trust and Ease</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
                            required
                        />

                        {/* Mobile Number */}
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter Mobile Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
                            required
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
                            required
                        />

                        {/* Password and Address */}
                        <div className="flex space-x-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-1/2 p-4 border border-yellow-500 rounded-md focus:outline-none"
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-1/2 p-4 border border-yellow-500 rounded-md focus:outline-none"
                                required
                            />
                        </div>

                        {/* Sign up button */}
                        <button
                            type="submit"
                            onClick={handleButtonClick} // Attach onClick handler
                            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
                        >
                            Sign up to Ride
                        </button>

                        {/* Error message */}
                        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    </form>

                    {/* Driver Section */}
                    <div className="mt-4 text-center">
                        <p>Become a Driver?</p>
                        <a href="/signup/driver" className="text-yellow-500 hover:underline">
                            Sign up as a Driver
                        </a>
                    </div>

                    {/* Admin Section */}
                    <div className="mt-4 text-center">
                        <p>Admin Access?</p>
                        <a href="#" className="text-yellow-500 hover:underline">
                            Sign up as Admin
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer with Feature Cards */}
            <footer className="bg-gray-100 py-8 px-8 lg:px-16">
                <div className="flex flex-wrap justify-center lg:justify-between space-y-8 lg:space-y-0">
                    {/* Card 1: Easy Booking */}
                    <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
                        <h3 className="text-lg font-semibold mb-4">Easy Booking</h3>
                        <p className="text-gray-600">
                            Schedule your goods transport with just a few clicks. Our intuitive platform ensures easy and fast bookings.
                        </p>
                    </div>

                    {/* Card 2: Real-Time Tracking */}
                    <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
                        <h3 className="text-lg font-semibold mb-4">Real-Time Tracking</h3>
                        <p className="text-gray-600">
                            Track your shipments in real-time and get live updates on the status and location of your goods.
                        </p>
                    </div>

                    {/* Card 3: Secure Payments */}
                    <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
                        <h3 className="text-lg font-semibold mb-4">Secure Payments</h3>
                        <p className="text-gray-600">
                            Make payments securely through our platform. Your financial data is protected with industry-standard encryption.
                        </p>
                    </div>

                    {/* Card 4: Dedicated Support */}
                    <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
                        <h3 className="text-lg font-semibold mb-4">Dedicated Support</h3>
                        <p className="text-gray-600">
                            Our customer support is available 24/7 to help you with any issues related to your transport needs.
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© 2024 TranspoTrac. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default UserSignUp;
