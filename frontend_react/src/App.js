import './App.css';
import Home from './component/home';
import TalkFilterPage from "./component/TalkFilterPage";
import Register from './component/Register';
import Login from './component/login';
import Itinerary from './component/Itinerary';
import UserProfilePage from "./component/userProfilePage";
import Navigation from './component/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <Navigation loggedInUser={loggedInUser} userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TalkFilterPage" element={<TalkFilterPage loggedInUser={loggedInUser} />} />
        <Route path="/Itinerary" element={<Itinerary loggedInUser={loggedInUser} />} />
        <Route path="/userProfilePage" element={<UserProfilePage loggedInUser={loggedInUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setLoggedInUser={setLoggedInUser} setUserRole={setUserRole} />}
        />
        <Route path="/staff" element={<div>Staff Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

