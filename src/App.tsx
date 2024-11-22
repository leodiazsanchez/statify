import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles/App.css";

import Routes from "./routes/routes";
import AuthProvider from "./providers/authProvider";
import DeviceProvider from "./providers/deviceProvider";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;
