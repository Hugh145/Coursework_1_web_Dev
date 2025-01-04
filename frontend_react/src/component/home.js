import React from "react";
import useFetchTalks from "./useFetchTalks";
import Search from "./Search";

const Home = () => {
  const { talks, status } = useFetchTalks();

  // Render some simple loading/error states:
  if (status === "loading") return <p>Loading talks...</p>;
  if (status === "error") return <p>There was an error fetching talks.</p>;

  // If data is successfully fetched, render page content
  return (
    <div className="container-fluid">

      {/* Row 1: Intro text */}
      <div className="row py-4 bg-white rounded shadow-sm">
        <div className="col">
          <h3>welcome to the Home Page</h3>
          <p>about this website is for Technology conferences are popular events which allow developers to learn about the latest developments and
            trends in the industry and to network with like-minded persons.
            Many conferences provide a web application that helps attendees plan their day(s)at the conference 
            and which provide feedback to the conference organisers and speakers. </p>
            <p>
            You are required to design and implement a responsive, single-page application to allow conference attendees to plan their event. 
            The application should allow users to search for presenters, view information about talks; check times and sessions;
            create a personal itinerary; store and review their itinerary and record their priorities about which talks to attend. 
            </p>
        </div>
      </div>
      <br></br>
      {/* Row 2: Web application features and talks */}
      <div className="row py-4 bg-white rounded shadow-sm">
        <div className="col">
          <h3 >What the Web Application Can Do</h3>
          <ul>
            <li>Search talks by speaker</li>
            <li>Browse talks by session</li>
            <li>Mark talks as of potential interest</li>
            <li>View an individualized schedule of talks (no overlapping times)</li>
            <li>Rate talks and view the average rating from all users</li>
          </ul>
    </div>
    </div>
    <br></br>
    <div className="row py-4 bg-white rounded shadow-sm" >
    <div className="col">
          <h3 >Search Talks</h3>
          {/* Include the Search component */}
          <Search talks={talks} />
        </div>
    </div>
    </div>
  );
};

export default Home;

