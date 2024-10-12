import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import Routes from "./routes/routes";
import AuthProvider from "./providers/authProvider";
import DeviceProvider from "./providers/deviceProvider";

function App() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <Routes />
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;
