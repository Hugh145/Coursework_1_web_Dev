import React from "react";
import useFetchTalks from "./useFetchTalks";
import Search from "./Search";

const Home = () => {
  const { talks, status } = useFetchTalks();

  // Render some simple loading/error states of the talks information:
  if (status === "loading") return <p>Loading talks...</p>;
  if (status === "error") return <p>There was an error fetching talks.</p>;

  // If talk data  has been is successfully fetched, render home page content
  return (
    <div className="container-fluid px-4">
      {/* Welcome Section of the home page*/}
      <div className="row py-4 bg-light rounded shadow-sm mb-4">
        <div className="col">
          <h1 className="text-center text-primary mb-3">Welcome to the Home Page</h1>
          <p className="text-dark">
            Technology conferences are popular events that allow developers to
            learn about the latest developments and trends in the industry and
            network with like-minded individuals. Many conferences provide web
            applications to help attendees plan their schedules and give
            feedback to organizers and speakers.
          </p>
          <p className="text-dark">
            This website is designed to help you plan your conference experience.
            Search for presenters, view information about talks, check times
            and sessions, create a personal itinerary, and more.
          </p>
        </div>
      </div>

      {/* Features Section  of what the website can do*/}
      <div className="row py-4 bg-light rounded shadow-sm mb-4">
        <h2 className="text-primary text-center mb-4">Website Features</h2>
        <div className="row">
          {/* Split up each of the Feature */}
          {[
            {
              title: "Search Talks",
              description:
                "Use the search bar on the home page to find talks by speaker or title.",
            },
            {
              title: "Browse Talks by Session",
              description:
                "Filter talks by sessions like Session A, B, or C to explore your options.",
            },
            {
              title: "Mark Talks as Interesting",
              description:
                "Click the icon to mark talks as interesting. Icons turn red for interest or blue when unmarked.",
            },
            {
              title: "Rate Talks",
              description:
                "Rate talks from 1 to 5 stars and view average ratings. Filter talks by minimum ratings.",
            },
            {
              title: "Filter Talks by Tags",
              description:
                "Use the tag filter to find talks that align with your interests.",
            },
            {
              title: "Register and Login",
              description:
                "Create an account to access personalized features like your itinerary and comments.",
            },
            {
              title: "View Personal Itinerary",
              description:
                "Logged-in users can view and manage their personal itinerary without overlapping talks.",
            },
            {
              title: "Comment on Talks",
              description:
                "Logged-in users can comment on talks, view others' comments, and manage their own.",
            },
          ].map((feature, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h4 className="m-0 text-primary">{feature.title}</h4>
                  <p className="text-black mt-2">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Talks Section */}
      <div className="row py-4 bg-light rounded shadow-sm mb-4">
        <div className="col">
          <h3 className="text-primary">Search Talks</h3>
          <p className="text-black">
            Use the search bar below to find talks by title or speaker.
          </p>
          {/* Include the Search Component from the search.js file */}
          <Search talks={talks} />
        </div>
      </div>
    </div>
  );
};

export default Home;