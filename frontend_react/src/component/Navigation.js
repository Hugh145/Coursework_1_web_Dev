import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = ({ loggedInUser, userRole, handleLogout }) => {
  return (
    <div className="container-fluid bg-white sticky-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-white navbar-light py-2 py-lg-0">
          <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto">
            <h1 className="m-0 text-primary">Conference Website</h1>
          </NavLink>

          <button
            type="button"
            className="navbar-toggler ms-auto me-0"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
              <NavLink to="/" className="nav-item nav-link">
                Home
              </NavLink>
              <NavLink to="/TalkFilterPage" className="nav-item nav-link">
                Talk Filter
              </NavLink>

              {userRole === "staff" && (
                <NavLink to="/staff" className="nav-item nav-link">
                  Staff Page
                </NavLink>
              )}

              {loggedInUser ? (
                <>
                  <span className="nav-item nav-link">Welcome, {loggedInUser}</span>
                  <NavLink to="/itinerary" className="nav-item nav-link">
                  Itinerary
                  </NavLink>
                  <NavLink to="/userProfilePage" className="nav-item nav-link">
                  Profile Details
                  </NavLink>
                  <button
                    className="btn btn-outline-primary nav-item nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="nav-item nav-link">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="nav-item nav-link">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;

