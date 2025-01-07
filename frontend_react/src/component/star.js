import React from "react";
// Star component to display a star icon that the user can click to select a talk from
// talkfilterPage so that the user can add the own rating score and 
// style the star in gold colour and background gray and the size by24x24.
const Star = ({ selected, onSelect }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill={selected ? "gold" : "lightgray"}
    className="bi bi-star"
    viewBox="0 0 16 16"
    onClick={onSelect}
    style={{ cursor: "pointer" }}
  >
    <path d="M2.866 14.85c-.078.444.36.791.732.593l4.39-2.256 4.389 2.256c.373.198.81-.149.732-.592l-.83-4.73 3.523-3.356c.33-.316.158-.888-.283-.95l-4.898-.696L8.465.792c-.197-.39-.73-.39-.927 0l-2.086 4.226-4.898.696c-.441.063-.613.635-.283.95l3.523 3.356-.83 4.73z" />
  </svg>
);

export default Star;