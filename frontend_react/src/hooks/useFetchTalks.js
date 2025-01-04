// src/hooks/useFetchTalks.js
import { useState, useEffect } from "react";

const useFetchTalks = () => {
  const [talks, setTalks] = useState([]);
  const [status, setStatus] = useState("idle"); 
  // status can be 'idle' | 'loading' | 'fetched' | 'error'

  useEffect(() => {
    setStatus("loading");
    fetch("http://localhost:3001/talks")  // <--  the API endpoint of the connection 
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching talks");
        }
        return res.json();
      })
      .then((data) => {
        setTalks(data);
        setStatus("fetched");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  return { status, talks };
};

export default useFetchTalks;
