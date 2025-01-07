import { useEffect, useState, useCallback } from "react";
// // Custom hook to fetch and manage talks data from an API 
const useFetchTalks = () => {
   // State to track the current status of the data fetching process
  const [status, setStatus] = useState("idle");  // 'idle' | 'loading' | 'fetched' | 'error'
  // State to store the fetched talks data
  const [talks, setTalks] = useState([
    {
      id: "", // Unique identifier for the talk
      title: "", // Title of the talk
      speaker: "", // Name of the speaker eg John Doe
      session: "", // Session of the talk eg A or B 
      time: "",   // Time of the talk 
    },
  ]);

  //// State to store the fetched talks data
  const fetchData = useCallback(() => {
    const url = "http://localhost:3001/talks"; // URL of the API endpoint to fetch talks data
    fetch(url)
      .then((response) => response.json())
      .then((incomingData) => {
        console.log(incomingData);
        setTalks(incomingData);
        setStatus("fetched");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    setStatus("loading");
    fetchData();
  }, [fetchData]);

  return { status, talks };
};

export default useFetchTalks;
