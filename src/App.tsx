import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import Artists from "./pages/artists";
import Home from "./pages/home";
import Tracks from "./pages/tracks";
import Recommendations from "./pages/recommendations";
import NotFound from "./pages/notFound";

import WebPlayback from "./components/webPlayback";
function App() {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("/auth/token");
        if (!response.ok) throw new Error("Failed to fetch token");
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        await getRefreshToken();
      }
    }

    async function getRefreshToken() {
      const response = await fetch("/auth/refresh_token");
      if (!response.ok) throw new Error("Failed to fetch refresh token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  const handleDeviceIdReady = (id) => {
    console.log("Received Device ID from WebPlayback component:", id);
    setDeviceId(id);
  };

  return (
    <Router>
      <Layout accessToken={token}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists accessToken={token} />} />
          <Route
            path="/tracks"
            element={<Tracks accessToken={token} deviceId={deviceId} />}
          />
          <Route
            path="/recommendations"
            element={<Recommendations accessToken={token} deviceId={deviceId}/>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      {token && (
        <WebPlayback
          token={token}
          onDeviceIdReady={handleDeviceIdReady}
        ></WebPlayback>
      )}
    </Router>
  );
}

export default App;
