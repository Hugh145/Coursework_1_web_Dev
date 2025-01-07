// Importing styles and components from the react-bootstrap library:
import './App.css'; // Importing the App.css file to style the App component
import Home from './component/home'; // Importing the Home component
import TalkFilterPage from "./component/TalkFilterPage"; // Importing the TalkFilterPage component
import Register from './component/Register'; // Importing the Register component
import Login from './component/login'; // Importing the Login component
import Itinerary from './component/Itinerary'; // Importing the Itinerary component
import UserProfilePage from "./component/userProfilePage"; // Importing the UserProfilePage component
import Navigation from './component/Navigation'; // Importing the Navigation component
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing the Bootstrap CSS file
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importing the Bootstrap JS file
// Importing the BrowserRouter, Routes, and Route components from the react-router-dom library
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
// App component to render the navigation bar and the routes for the website
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
// Function to handle the logout of the user
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

