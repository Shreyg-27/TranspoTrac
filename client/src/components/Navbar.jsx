// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-yellow-500 flex flex-col items-center py-4">
            <h1 className="text-3xl font-bold text-black">Welcome to TranspoTrac</h1>
            <ul className="flex space-x-10 mt-2"> {/* Increased spacing here */}
                <li>
                    <Link to="/dashboard/home" className="text-black font-bold text-lg hover:text-yellow-600">
                        Bookings
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/profile" className="text-black font-bold text-lg hover:text-yellow-600">
                        Bookings History
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/settings" className="text-black font-bold text-lg hover:text-yellow-600">
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

export default Navbar;
