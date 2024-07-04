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

function App() {
  const [token, setToken] = useState('');


  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <Router>
      <Layout accessToken={token}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists accessToken={token}/>} />
          <Route path="/tracks" element={<Tracks accessToken={token}/>} />
          <Route path="/recommendations" element={<Recommendations accessToken={token}/>} />
          {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
