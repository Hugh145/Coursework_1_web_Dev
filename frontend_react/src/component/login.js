import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Login component to allow users to login to the website
const Login = ({ setLoggedInUser, setUserRole }) => { // Set the loggedInUser and userRole states
  const [formData, setFormData] = useState({ username: "", password: "" }); // Set the formData state
  const [error, setError] = useState(null); // Set the error state
  const navigate = useNavigate(); // Use the navigate hook to redirect to different pages

  // Handle input changes in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to login a user
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // Get the response data and display the message
      const data = await response.json();

      if (response.ok) {
        setLoggedInUser(data.username);
        setUserRole(data.role);

        if (data.role === "staff") {
          navigate("/staff");
        } else if (data.role === "user") {
          navigate("/");
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
