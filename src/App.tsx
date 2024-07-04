import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { fetchProfile } from "./scripts/APIscript";

import Layout from "./compontents/layout";
import Artists from "./pages/artists";
import Home from "./pages/home";
import Tracks from "./pages/tracks";
import Recommendations from "./pages/recommendations";
import NotFound from "./pages/notFound";
import Callback from "./pages/callback";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const signIn = async (accessToken : string) => {
    setAccessToken(accessToken);
    const profile = await fetchProfile(accessToken);
    setProfile(profile);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setProfile(null);
    setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const tempToken = localStorage.getItem("accessToken");
    if(tempToken){
      try {
        signIn(tempToken);
      } catch {
        signOut();
      }
    }
  }, []);

  return (
    <Router>
      <Layout authStatus={{ isAuthenticated, profile, signOut }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists accessToken={accessToken}/>} />
          <Route path="/tracks" element={<Tracks accessToken={accessToken}/>} />
          <Route path="/recommendations" element={<Recommendations accessToken={accessToken}/>} />
          <Route
            path="/callback"
            element={
              <Callback signIn={signIn} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
