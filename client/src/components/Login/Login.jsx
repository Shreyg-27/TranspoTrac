import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'user', // default userType is 'user'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, userType } = formData;
        
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            // Adjust URL based on user type
            const url = userType === 'user' ? 'http://localhost:5000/login' : 'http://localhost:5000/driver/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
              console.log(`${userType.charAt(0).toUpperCase() + userType.slice(1)} login successful:`, data);
          
              // Set the email in a cookie
              Cookies.set('email', email, { expires: 7 }); // Cookie expires in 7 days
          
              // Redirect to the respective dashboard based on user type
              const dashboardPath = userType === 'driver' ? `/driver-dashboard/${email}` : `/dashboard/${email}`;
              navigate(dashboardPath);
            } else {
                console.error(`Error logging in ${userType}:`, data);
                alert(data.error || "Login failed!");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert("Network error, please try again later.");
        }
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
          <h2 className="text-3xl font-semibold mb-6">Login to Your Account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* User Type Dropdown */}
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>

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

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
            >
              Login
            </button>
          </form>

          {/* Links to Signup */}
          <div className="mt-4 text-center">
            <p>Don't have an account?</p>
            <a href="/" className="text-yellow-500 hover:underline">
              Sign up here
            </a>
          </div>
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

export default Login;
