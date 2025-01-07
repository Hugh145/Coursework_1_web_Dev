// src/components/DisplayTalks.js
import React from "react";
import useFetchTalks from "../hooks/useFetchTalks"; // Import useFetchTalks hook view the talks items 
import TalkOrder from "./TalkOrder";

// DisplayTalks component to fetch and display talks
const DisplayTalks = () => {
  const { status, talks } = useFetchTalks();

  // Render some simple loading/error states of the talks information:
  if (status === "loading") {
    return <p>Loading talks...</p>;
  }

  if (status === "error") {
    return <p>Error loading talks.</p>;
  }

  if (status === "fetched") {
    return <TalkOrder talks={talks} />;
  }

  return null;
};

export default DisplayTalks;

