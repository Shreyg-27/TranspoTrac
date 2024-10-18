// components/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <nav className="bg-yellow-500 flex flex-col items-center py-4">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <ul className="flex space-x-10 mt-2">
                <li>
                    <Link to="/admin/bookings" className="text-black font-bold text-lg hover:text-yellow-600">
                        Booking Overview
                    </Link>
                </li>
                <li>
                    <Link to="/admin/fleet" className="text-black font-bold text-lg hover:text-yellow-600">
                        Fleet Management
                    </Link>
                </li>
                <li>
                    <Link to="/admin/analytics" className="text-black font-bold text-lg hover:text-yellow-600">
                        Analytics
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

export default AdminNavbar;
