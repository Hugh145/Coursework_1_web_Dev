import React, { useState } from "react";
import TalkItem from "./TalkItem";

const TalkOrder = ({ talks }) => {
  const [selectedTalk, setSelectedTalk] = useState(null);

  const handleTalkClick = (talk) => {
    setSelectedTalk(talk);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left column: list of talks */}
        <div className="col-3 submenu">
          <h2>Talks</h2>
          <ul className="list-group">
            {talks.map((talk) => (
              <TalkItem key={talk.id} talk={talk} onClick={handleTalkClick} />
            ))}
          </ul>
        </div>

        {/* Right column: selected talk details */}
        <div className="col-9">
  <h2>Talk Details</h2>
  {selectedTalk ? (
    <div
      style={{
        marginTop: "1rem",
        padding: "1.5rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4 className="m-0 text-primary" style={{ marginBottom: "1rem" }}>
        Title: {selectedTalk.title}
      </h4>
      <br></br>
      <p>
        <strong>Description:</strong> {selectedTalk.description}
      </p>
      <p>
        <strong>Speaker:</strong> {selectedTalk.speaker}
      </p>
      <p>
        <strong>Session:</strong> {selectedTalk.session}
      </p>
      <p>
        <strong>Time:</strong> {selectedTalk.time}
      </p>
      {selectedTalk.tags && selectedTalk.tags.length > 0 && (
        <div>
          <strong>Tags:</strong>
          {selectedTalk.tags.map((tag, index) => (
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
        </div>
      )}
    </div>
  ) : (
    <p>Please select a talk from the menu.</p>
  )}
</div>
</div>
</div>
  );
};

export default TalkOrder;
