import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/authProvider";

export const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("auth/profile");

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const json = await res.json(); // Parse response as JSON
        setProfile(json.profileData); // Set the profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <nav className="navbar navbar-expand-lg mx-5 py-4 navbar-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Spotify Analytics <i className="bi bi-bar-chart accent"></i>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/artists">
                Top Artists
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tracks">
                Top Tracks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/genres">
                Top Genres
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/recommendations">
                Recommendations
              </NavLink>
            </li>
          </ul>
          <div className="d-flex">
            {profile ? (
              <div className="dropdown">
                <button
                  className="btn profileButton rounded-pill text-light fw-bold dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="rounded-circle profilePic me-2"
                    src={profile.images[0].url}
                    alt="Profile"
                  />
                  {profile.display_name}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <Link className="dropdown-item" to="/">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/auth/logout">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <a
                className="btn signIn text-light fw-bold rounded-pill"
                href="/auth/login"
              >
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
