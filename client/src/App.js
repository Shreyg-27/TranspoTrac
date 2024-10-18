// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSignUp from './components/UserSignUp';
import DriverSignUp from './components/DriverSignUp';
import Login from './components/Login';
import HomePage from './components/UserHomepage';
import CreateBooking from './components/CreateBooking';
import DriverHomePage from './components/DriverHomepage';
import DriveUpdate from './components/DriveUpdate';
import AdminHomePage from './components/AdminHomepage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UserSignUp />} />
          <Route exact path="/signup/driver" element={<DriverSignUp />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard/:email" element={<HomePage />} />
          <Route exact path="/create-booking" element = {<CreateBooking />} />
          <Route exact path='/driver-dashboard/:email' element= {<DriverHomePage />} />
          <Route exact path='/drive/update' element={<DriveUpdate />} />
          <Route exact path='/admin/profile' element={<AdminHomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
