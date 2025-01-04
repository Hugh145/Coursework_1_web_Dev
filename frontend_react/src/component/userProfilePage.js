import React, { useState, useEffect } from "react";

//the detail that will be updated 
const UserProfilePage = ({ loggedInUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    address1: "",
    address2: "",
  });
  const [originalData, setOriginalData] = useState(null); // Store original user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [message, setMessage] = useState(null); // Success or error messages

  // Fetch user details on page load
  useEffect(() => {
    if (loggedInUser) {
      fetch(`http://localhost:3001/user/${loggedInUser}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user details.");
          }
          return response.json();
        })
        .then((data) => {
          setFormData(data);
          setOriginalData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending update request:", { username: loggedInUser, updates: formData });

    // Check if changes have been made
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      setMessage({ type: "info", text: "No changes made to update." });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedInUser, updates: formData }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setOriginalData(formData); // Update original data after a successful update
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-4">
      {/* User Profile Details */}
      <div className="card p-4 shadow">
      <h2>Your Profile Details</h2>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>First Name:</strong> {formData.firstName}</p>
        <p><strong>Last Name:</strong> {formData.lastName}</p>
        <p><strong>Date of Birth:</strong> {formData.dob}</p>
        <p><strong>Address 1:</strong> {formData.address1}</p>
        {formData.address2 && (
          <p><strong>Address 2:</strong> {formData.address2}</p>
        )}
        </div>

      {/* Update Profile Form */}
      <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2>Update Profile</h2>
        {message && (
          <div
            className={`alert alert-${
              message.type === "success" ? "success" : message.type === "info" ? "info" : "danger"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address1" className="form-label">Address 1</label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address2" className="form-label">Address 2 (Optional)</label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
     </div>
    </div>
  );
};

export default UserProfilePage;


