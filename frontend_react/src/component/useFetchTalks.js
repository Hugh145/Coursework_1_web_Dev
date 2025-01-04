import { useEffect, useState, useCallback } from "react";

const useFetchTalks = () => {
  const [status, setStatus] = useState("idle");  // 'idle' | 'loading' | 'fetched' | ...
  const [talks, setTalks] = useState([
    {
      id: "",
      title: "",
      speaker: "",
      session: "",
      time: "",
    },
  ]);

  const fetchData = useCallback(() => {
    const url = "http://localhost:3001/talks"; // Adjust this to match your endpoint
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
