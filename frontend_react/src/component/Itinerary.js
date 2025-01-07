import React, { useState, useEffect } from "react";

const Itinerary = ({ loggedInUser }) => {
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the user's itinerary on load
  useEffect(() => {
    if (!loggedInUser) {
      setError("Please log in to view your itinerary.");
      return;
    }
    // Fetch the user's itinerary from the server
    fetch(`http://localhost:3001/itinerary/${loggedInUser}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch itinerary data.");
        }
        return response.json();
      })
      .then((data) => setItinerary(data))
      .catch((err) => {
        console.error("Error fetching itinerary:", err);
        setError("Failed to load itinerary.");
      });
  }, [loggedInUser]);

  // Remove a talk from the user's itinerary
  const removeTalk = (talkId) => {
    fetch("http://localhost:3001/itinerary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedInUser, talkId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          setItinerary(data.itinerary || []);
        } else if (data.error) {
          alert(`Error: ${data.error}`);
        }
      })
      .catch((err) => console.error("Error removing talk:", err));
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!itinerary || itinerary.length === 0) {
    return <p>No talks in your itinerary yet.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Welcome {loggedInUser} to Your Itinerary</h2>
      <ul className="list-group">
        {itinerary.map((talk) => (
          <li
            key={talk.id}
            className="list-group-item"
            style={{
              marginBottom: "1rem",
              padding: "1.5rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-primary">{talk.title}</h5>
            <br></br>
            <p><strong>Description:</strong> {talk.description}</p>
            <p>
              <strong>Speaker:</strong> {talk.speaker}
            </p>
            <p>
              <strong>Time:</strong> {talk.time}
            </p>
            <p>
              <strong>Session:</strong> {talk.session}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {talk.tags &&
                talk.tags.map((tag, index) => (
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
                ))}
            </p>
            <button
              className="btn btn-danger"
              onClick={() => removeTalk(talk.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Itinerary;


