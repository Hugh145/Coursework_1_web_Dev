import React, { useState } from "react";
import TalkOrder from "./TalkOrder"; // Component to display filtered talks

const Search = ({ talks }) => {
  const [searchField, setSearchField] = useState("");

  // Filter talks based on the searchField input
  const filteredTalks = talks.filter((talk) => {
    return (
      talk.title.toLowerCase().includes(searchField.toLowerCase()) ||
      talk.speaker.toLowerCase().includes(searchField.toLowerCase())
      );
  });

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="form-control"
          type="text"
          placeholder="Search talks by title, speaker."
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
      </div>

      {/* Display the filtered talks */}
      <TalkOrder talks={filteredTalks} />
    </div>
  );
};

export default Search;
