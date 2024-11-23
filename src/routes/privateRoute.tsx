import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider"; 

const PrivateRoute = ({ element }) => {
  const { token } = useAuth(); 

  if (!token) {
    window.location.href = "/api/login";
    return <Navigate to="/"></Navigate>;
  }

  return element;
};

export default PrivateRoute;
