// src/components/TalkItem.js
import React from "react";

const TalkItem = ({ talk, onClick }) => {
  // Renders a list-group item that displays the talk title.
  // When clicked, it calls onClick(talk) to select that talk.
  return (
    <li
      className="menu-list list-group-item"
      onClick={() => onClick(talk)}
      style={{ cursor: "pointer" }}
    >
      {talk.title}
    </li>
  );
};

export default TalkItem;
