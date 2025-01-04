import React, { useEffect, useState } from "react";

const Itinerary = ({ loggedInUser }) => {
  const [itinerary, setItinerary] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // Handle errors

  // Fetch itinerary when the component loads
  useEffect(() => {
    if (!loggedInUser) {
      setError("Please log in to view your itinerary.");
      return;
    }

    fetch(`http://localhost:3001/itinerary/${loggedInUser}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch itinerary data.");
        }
        return response.json();
      })
      .then((data) => setItinerary(data.itinerary || [])) // Ensure data.itinerary is an array
      .catch((err) => {
        console.error("Error fetching itinerary:", err);
        setError("Failed to load itinerary.");
      });
  }, [loggedInUser]);

  // Handle talk deletion
  const deleteTalk = (talkId) => {
    fetch("http://localhost:3001/itinerary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedInUser, talkId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete talk.");
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the remaining talks
        const updatedItinerary = itinerary.filter((talk) => talk.id !== talkId);
        setItinerary(updatedItinerary);
      })
      .catch((err) => {
        console.error("Error deleting talk:", err);
        setError("Failed to delete talk.");
      });
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return <p>No talks in your itinerary yet.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Welcome {loggedInUser} to the Itinerary Page</h2>
      <ul className="list-group">
        {itinerary.map((talk) => (
          <li key={talk.id} className="list-group-item" style={{
            marginTop: "1rem",
            padding: "1.5rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",}}>
            <h5 class="m-0 text-primary">{talk.title}</h5>
            <br></br>
            <p><strong>Description:</strong> {talk.description}</p>
            <p><strong>Time:</strong> {talk.time}</p>
            <p><strong>Session:</strong> {talk.session}</p>
            <p><strong>Speaker:</strong> {talk.speaker}</p>
            <p><strong>Tags:</strong>  {talk.tags.map((tag, index) => (
            <span
            key={index}
            className="badge bg-secondary me-2"
            style={{
            fontSize: "0.85rem",
            padding: "0.4rem 0.7rem",
            }}
            >
            {tag}
            </span>
            ))}</p>

            <button
              className="btn btn-danger"
              onClick={() => deleteTalk(talk.id)}
            >
              Remove talk from itinerary
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Itinerary;

