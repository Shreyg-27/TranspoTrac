// components/DriverNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DriverNavbar = () => {
    return (
        <nav className="bg-yellow-500 flex flex-col items-center py-4">
            <h1 className="text-3xl font-bold text-black">Welcome to TranspoTrac</h1>
            <ul className="flex space-x-10 mt-2">
                <li>
                    <Link to="/driver/bookings" className="text-black font-bold text-lg hover:text-yellow-600">
                        Booking Requests
                    </Link>
                </li>
                <li>
                    <Link to="/driver/history" className="text-black font-bold text-lg hover:text-yellow-600">
                        Booking History
                    </Link>
                </li>
                <li>
                    <Link to="/driver/profile" className="text-black font-bold text-lg hover:text-yellow-600">
                        Profile
                    </Link>
                </li>
                <li>
                    <Link to="/logout" className="text-black font-bold text-lg hover:text-yellow-600">
                        Logout
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default DriverNavbar;
