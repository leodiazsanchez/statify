import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider"; // Assuming you have this context

const PrivateRoute = ({ element }) => {
  const { token } = useAuth(); // Get token from context

  if (!token) {
    // Redirect to login page if no token
    window.location.href = "/api/login";
    return <Navigate to="/"></Navigate>;
  }

  // If authenticated, render the element (protected page)
  return element;
};

export default PrivateRoute;
