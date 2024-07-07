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
  const [expiresIn, setExpiresIn] = useState();
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      fetch("http://localhost:3001/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          setToken(data.accessToken);
          setExpiresIn(data.expiresIn);
        })
        .catch(() => {
          document.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

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
            element={
              <Recommendations accessToken={token} deviceId={deviceId} />
            }
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
