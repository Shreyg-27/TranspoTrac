

// const DriverForm = () => {
//   const [driverData, setDriverData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     vehicleType: '',
//     vehicleNumber: '',
//     phoneNumber: '', // Adding phone number to the state
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setDriverData({ ...driverData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // API call to save driver data
//       const response = await fetch('http://localhost:5000/driver/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(driverData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       alert('Driver signed up successfully!');
//       console.log(data);
//     } catch (error) {
//       console.error('Error signing up driver:', error);
//       alert('There was an error signing up the driver.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">
//       <header className="flex justify-between items-center py-4 px-8 bg-yellow-500">
//         <h1 className="text-xl font-bold text-black">TranspoTrac</h1>
//         <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded">
//           Login
//         </button>
//       </header>

//       {/* Main Section */}
//       <main className="flex flex-col lg:flex-row justify-center items-center lg:space-x-16 py-12 px-8 lg:px-16">
//         {/* Image Section */}
//         <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
//           <div className="relative">
//             <img
//               src="https://th.bing.com/th/id/OIP.O_N-FnaPvwbqPl2eAHyptgHaGS?w=199&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
//               alt="Driver with vehicle"
//               className="rounded-lg object-cover w-full"
//             />
//             <div className="absolute inset-0 border-4 border-yellow-500 rounded-lg"></div>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="w-full lg:w-1/2">
//           <h2 className="text-3xl font-semibold mb-6">Become a Driver</h2>
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             {/* Name */}
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter Full Name"
//               value={driverData.name}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter Email Address"
//               value={driverData.email}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Password */}
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter Password"
//               value={driverData.password}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Vehicle Type */}
//             <input
//               type="text"
//               name="vehicleType"
//               placeholder="Enter Vehicle Type"
//               value={driverData.vehicleType}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Vehicle Number */}
//             <input
//               type="text"
//               name="vehicleNumber"
//               placeholder="Enter Vehicle Number"
//               value={driverData.vehicleNumber}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Phone Number */}
//             <input
//               type="tel"
//               name="phoneNumber"
//               placeholder="Enter Phone Number"
//               value={driverData.phoneNumber}
//               onChange={handleChange}
//               className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
//               required
//             />

//             {/* Sign Up button */}
//             <button
//               type="submit"
//               className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
//             >
//               Sign Up as Driver
//             </button>
//           </form>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-100 py-8 px-8 lg:px-16">
//         <div className="mt-8 text-center text-gray-500 text-sm">
//           <p>© 2024 TranspoTrac. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios via npm

function DriverSignUp() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    vehicleType: 'small',
    vehicleNumber: '',
    phoneNumber: '',
  });

  // State to manage submission status
  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    error: null,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus({ success: false, error: null }); // Reset status

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:5000/driver/signup', formData);
      console.log("Response from server: ", response.data);

      // If the submission is successful
      setSubmissionStatus({ success: true, error: null });
      // Clear form or redirect to another page as necessary
      setFormData({
        name: '',
        email: '',
        password: '',
        vehicleType: 'small',
        vehicleNumber: '',
        phoneNumber: '',
      });
    } catch (error) {
      console.error("Error submitting the form: ", error);
      // Handle error case
      setSubmissionStatus({ success: false, error: 'Failed to sign up. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-8 bg-yellow-500">
        <h1 className="text-xl font-bold text-black">TranspoTrac Driver Portal</h1>
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded">
          Login
        </button>
      </header>

      {/* Main Section */}
      <main className="flex flex-col lg:flex-row justify-center items-center lg:space-x-16 py-12 px-8 lg:px-16">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <div className="relative">
            <img
              src="https://th.bing.com/th/id/OIP.O_N-FnaPvwbqPl2eAHyptgHaGS?w=199&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Driver with vehicle"
              className="rounded-lg object-cover w-full"
            />
            <div className="absolute inset-0 border-4 border-yellow-500 rounded-lg"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold mb-6">Sign up to Drive for TranspoTrac</h2>
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

            {/* Vehicle Type */}
            <div>
              <label className="block mb-2 text-gray-600 font-medium">Select Vehicle Type:</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Vehicle Number */}
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Enter Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />

            {/* Phone Number */}
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-4 border border-yellow-500 rounded-md focus:outline-none"
              required
            />

            {/* Sign up button */}
            <button
              type="submit"
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
            >
              Sign up to Drive
            </button>
          </form>

          {/* Submission Status */}
          {submissionStatus.success && (
            <p className="mt-4 text-green-600">Sign up successful!</p>
          )}
          {submissionStatus.error && (
            <p className="mt-4 text-red-600">{submissionStatus.error}</p>
          )}

          {/* Notes Section */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Vehicle Type Information</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-2">
                <strong>Small:</strong> Includes vehicles like Tempo, Pickup Truck.
              </li>
              <li className="mb-2">
                <strong>Medium:</strong> Includes vehicles like Mini Van, Cargo Van.
              </li>
              <li>
                <strong>Large:</strong> Includes vehicles like Truck, Container.
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer with Feature Cards */}
      <footer className="bg-gray-100 py-8 px-8 lg:px-16">
        <div className="flex flex-wrap justify-center lg:justify-between space-y-8 lg:space-y-0">
          {/* Card 1: Flexible Working Hours */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
            <h3 className="text-lg font-semibold mb-4">Flexible Working Hours</h3>
            <p className="text-gray-600">
              Drive at your convenience, manage your own hours, and enjoy the flexibility of choosing your workload.
            </p>
          </div>

          {/* Card 2: Competitive Rates */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
            <h3 className="text-lg font-semibold mb-4">Competitive Rates</h3>
            <p className="text-gray-600">
              Earn higher payouts with every completed trip and receive incentives for completing more rides.
            </p>
          </div>

          {/* Card 3: Secure Payments */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
            <h3 className="text-lg font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-600">
              All payments are made securely and on time. Your earnings are safe and deposited directly to your account.
            </p>
          </div>

          {/* Card 4: 24/7 Driver Support */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-64 text-center">
            <h3 className="text-lg font-semibold mb-4">24/7 Driver Support</h3>
            <p className="text-gray-600">
              Get round-the-clock assistance from our dedicated support team for any issues while on the road.
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

export default DriverSignUp;



