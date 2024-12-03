import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/authProvider";
import { useAxiosWithAuth } from "../utils/useAxiosWithAuth";

const NavbarContent = ({ profile, loading }) => (
  <nav className="navbar navbar-expand-lg mx-2 mx-lg-5 py-4 navbar-dark">
    <div className="container-fluid">
      <NavLink className="navbar-brand" to="/">
        <span className="brand-font">Statify </span>
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
          {loading ? (
            <button className="btn text-light fw-bold rounded-pill" disabled>
              Loading...
            </button>
          ) : profile ? (
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
                  <a className="dropdown-item" href="/api/logout">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <a
              className="btn signIn text-light fw-bold rounded-pill"
              href="/api/login"
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </div>
  </nav>
);

export const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const apiClient = useAxiosWithAuth();

  useEffect(() => {
    const init = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await apiClient.get("api/profile");
          if (res.status !== 200) throw new Error("Failed to fetch profile");
          setProfile(res.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    if (token != undefined) {
      init();
    }
  }, [token]);

  return <NavbarContent profile={profile} loading={loading} />;
};

export default Navbar;
