import React, { useState, useEffect } from "react";
import Star from "./star"


const TalkFilterPage = ({ loggedInUser }) => { 
  const [talks, setTalks] = useState([]);//storing the talks information
  const [filteredTalks, setFilteredTalks] = useState([]);
  const [itinerary, setItinerary] = useState([]); // Storing itinerary for the login user
  const [selectedSession, setSelectedSession] = useState(""); //getting the session of the API
  const [selectedTags, setSelectedTags] = useState([]); //getting the tags 
  const [selectedTime, setSelectedTime] = useState(""); //getting the time 
  const [minRating, setMinRating] = useState(0); //getting the ratting 
  const [selectedSpeaker, setSelectedSpeaker] = useState(""); // State for speaker filter
  const [interestingTalks, setInterestingTalks] = useState([]); // State for marked talks
  const [showMarkedOnly, setShowMarkedOnly] = useState(false); // Toggle to show only marked talks
  const [comments, setComments] = useState({}); // Comments mapped by talkId
  

  // Fetch talks data from the API or the database 
  useEffect(() => {
    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        const enrichedData = data.map((talk) => ({
          ...talk,
          rating: talk.rating || 0, // Ensure all talks have a rating
        }));
        setTalks(enrichedData);
        setFilteredTalks(enrichedData);
      })
      .catch((error) => console.error("Error fetching talks:", error));
  }, []);

  // Fetch user's current itinerary
  useEffect(() => {
    if (loggedInUser) {
      fetch(`http://localhost:3001/itinerary/${loggedInUser}`)
        .then((response) => response.json())
        .then((data) => setItinerary(data.itinerary || []))
        .catch((error) => console.error("Error fetching itinerary:", error));
    }
  }, [loggedInUser]);

  // Unique options for dropdowns and checkboxes
  const sessions = [...new Set(talks.map((talk) => talk.session))];
  const tags = [...new Set(talks.flatMap((talk) => talk.tags))];
  const times = [...new Set(talks.map((talk) => talk.time))];
  const speakers = [...new Set(talks.map((talk) => talk.speaker))]; 

  // Filter talks
  useEffect(() => {
    let filtered = talks;
  // filter for the session 
    if (selectedSession) {
      filtered = filtered.filter((talk) => talk.session === selectedSession);
    }
  // filter for the tags 
    if (selectedTags.length > 0) {
      filtered = filtered.filter((talk) =>
        talk.tags.some((tag) => selectedTags.includes(tag))
      );
    }
  //filter for time 
    if (selectedTime) {
      filtered = filtered.filter((talk) => talk.time === selectedTime);
    }

  // Filter by minimum rating
  if (minRating > 0) {
    filtered = filtered.filter((talk) => getAverageRating(talk.ratings) >= minRating);
  }
  //filter by Speaker 
    if (selectedSpeaker) {
      filtered = filtered.filter((talk) => talk.speaker === selectedSpeaker);
    }
  
    setFilteredTalks(filtered);
  }, [selectedSession, selectedTags, selectedTime, minRating, selectedSpeaker, talks]);

  const SelectingTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addToItinerary = (talk) => {
    if (!loggedInUser) {
      alert("Please log in to add talks to your itinerary.");
      return;
    }
  
    const checkingTime = itinerary.some((existingTalk) => existingTalk.time === talk.time);
    if (checkingTime) {
      alert("Time conflict: A talk is already scheduled at this time.");
      return;
    }

    // Check for duplicate talks
    const isDuplicate = itinerary.some((existingTalk) => existingTalk.id === talk.id);
    if (isDuplicate) {
      alert("This talk is already in your itinerary.");
      return;
    }
  
    fetch("http://localhost:3001/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedInUser, talk }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          setItinerary((prev) => [...prev, talk]);
        } else if (data.error) {
          alert(data.error);
        }
      })
      .catch((err) => console.error("Error adding to itinerary:", err));
  };
  


  // Toggle mark/unmark a talk as interesting
  const toggleMarkTalk = (talkId) => {
    setInterestingTalks((prev) =>
      prev.includes(talkId) ? prev.filter((id) => id !== talkId) : [...prev, talkId]
    );
  };

  // Get displayed talks based on "show marked only" toggle
  const displayedTalks = showMarkedOnly
    ? filteredTalks.filter((talk) => interestingTalks.includes(talk.id))
    : filteredTalks;

  //handing the rating system of the website of the talk information 
  // Handle rating
  const rateTalk = (talkId, newRating) => {
    fetch(`http://localhost:3001/talks/rate/${talkId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ talkId, rating: newRating }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Display confirmation message
          // Update the talk's ratings locally
          setTalks((prevTalks) =>
            prevTalks.map((talk) =>
              talk.id === talkId
                ? { ...talk, ratings: [...talk.ratings, newRating] }
                : talk
            )
          );
        } else {
          alert("Failed to add rating.");
        }
      })
      .catch((err) => console.error("Error rating talk:", err));
  };

  const getAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);
  };
  // Fetch comments for a specific talk
  const fetchComments = (talkId) => {
    fetch(`http://localhost:3001/talks/${talkId}/comments`)
      .then((response) => response.json())
      .then((data) =>
        setComments((prev) => ({
          ...prev,
          [talkId]: data,
        }))
      )
      .catch((error) => console.error("Error fetching comments:", error));
  };
  // Fetch comments for all talks for all the user can see the comments
  useEffect(() => {
    // Fetch comments for all talks
    talks.forEach((talk) => {
      fetch(`http://localhost:3001/talks/${talk.id}/comments`)
        .then((response) => response.json())
        .then((data) => setComments((prev) => ({ ...prev, [talk.id]: data })))
        .catch((error) => console.error(`Error fetching comments for talk ${talk.id}:`, error));
    });
  }, [talks]);
  // Add a comment
  const addComment = (talkId, commentText) => {
    if (!loggedInUser) {
      alert("Please log in to add a comment.");
      return;
    }
    fetch(`http://localhost:3001/talks/${talkId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedInUser, comment: commentText }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchComments(talkId);
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  // Delete a comment
  const deleteComment = (talkId, commentId) => {
    fetch(`http://localhost:3001/talks/${talkId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loggedInUser }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          fetchComments(talkId); // Refresh comments for the talk
        } else {
          alert("Failed to delete comment.");
        }
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <h2>Filter Talks</h2>
        {/* Filter Controls */}
        {/* Button to Show Only Marked Talks */}
        <div className="col-12 mb-3">
          <button
            className={`btn ${showMarkedOnly ? "btn-danger" : "btn-primary"}`}
            onClick={() => setShowMarkedOnly((prev) => !prev)}
          >
            {showMarkedOnly ? "Show All Talks" : "Show Marked Talks"}
          </button>
        </div>
        
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="speaker" className="form-label">
              Select Speaker
            </label>
            <select
              id="speaker"
              className="form-select"
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
            >
              <option value="">All Speakers</option>
              {speakers.map((speaker) => (
                <option key={speaker} value={speaker}>
                  {speaker}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="session" className="form-label">
              Select Session
            </label>
            <select
              id="session"
              className="form-select"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">All Sessions</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Tags</label>
            {tags.map((tag) => (
              <div className="form-check" key={tag}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onChange={() => SelectingTagChange(tag)}
                />
                <label className="form-check-label" htmlFor={`tag-${tag}`}>
                  {tag}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label">
              Select Time
            </label>
            <select
              id="time"
              className="form-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">All Times</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="rating" className="form-label">
              Minimum Rating Range: {minRating}
            </label>
            <input
              type="range"
              id="rating"
              className="form-range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>
        </div>

 {/* Filtered Talks List */}
 <div className="col-md-8">
          <h3>{showMarkedOnly ? "Marked Talks Information" : "All Talks Information"}</h3>
          {displayedTalks.length > 0 ? (
            <ul className="list-group">
              {displayedTalks.map((talk) => (
                <li
                  key={talk.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    interestingTalks.includes(talk.id) ? "--bs-danger-border-subtle" : ""
                  }`} style={{
                    marginTop: "1rem",
                    padding: "1.5rem",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",}}
                >
                  <div>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => toggleMarkTalk(talk.id)}
                    title={interestingTalks.includes(talk.id) ? "Unmark as Interesting" : "Mark as Interesting"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill={interestingTalks.includes(talk.id) ? "red" : "currentColor"}
                      className="bi bi-bookmark"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                  </button>
                    <h5 className="m-0 text-primary">{talk.title}</h5>
                    <p></p>
                    <p><strong>Description:</strong> {talk.description}</p>
                    <p><strong>Speaker:</strong> {talk.speaker}</p>
                    <p><strong>Time:</strong> {talk.time}</p>
                    <p><strong>Sessons:</strong> {talk.session}</p>
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
                    <p><strong>Rating:</strong> {getAverageRating(talk.ratings)} / 5</p>
                    <div>
                    <strong>Rate this talk:</strong>
                    {[...Array(5)].map((_, index) => (
                    <Star
                    key={index}
                    selected={index < getAverageRating(talk.ratings)}
                    onSelect={() => rateTalk(talk.id, index + 1)}
                    />
                    ))}
                    </div>
                    <br></br>
                     {/* Comments Section */}
                     <div className="card-body">
                     <h6>Comments:</h6>
                     <ul>
                     {comments[talk.id]?.length > 0 ? (
                     comments[talk.id].map((comment) => (
                     <li key={comment.id} className="d-flex justify-content-between">
                     <span>
                     <strong>{comment.username}:</strong> {comment.text}
                     </span>
          {loggedInUser === comment.username && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteComment(talk.id, comment.id)}
            >
              Delete
            </button>
          )}
        </li>
      ))
    ) : (
      <li>No comments yet. Be the first to comment by registering as login user!</li>
    )}
  </ul>
  {loggedInUser && (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const commentText = e.target.comment.value;
        addComment(talk.id, commentText);
        e.target.reset();
      }}
    >
      <input
        type="text"
        name="comment"
        placeholder="Add a comment"
        className="form-control"
        required
      />
      <button type="submit" className="btn btn-primary mt-2">
      Add new comment
      </button>
    </form>
  )}
</div>

         
{/* Add to Itinerary Button */}
   {loggedInUser && (
              <button className="btn btn-primary mt-3" onClick={() => addToItinerary(talk)}>
                Add talks details to your itinerary
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No talks match the selected filters that you selected .</p>
  )}
</div>
</div>
</div>
  );
};

export default TalkFilterPage;




