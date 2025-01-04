// src/components/DisplayTalks.js
import React from "react";
import useFetchTalks from "../hooks/useFetchTalks"; // Adjust path as needed
import TalkOrder from "./TalkOrder";

const DisplayTalks = () => {
  const { status, talks } = useFetchTalks();

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

