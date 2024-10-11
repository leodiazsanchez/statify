import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string>();

  useLayoutEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/auth/token");
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
        setToken(null);
      }
    };

    fetchToken();
  }, []);

  useLayoutEffect(() => {
    if (token) {
      // Set the token in axios headers
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      // Remove the Authorization header if no token
      delete axios.defaults.headers.common["Authorization"];
    }
    console.log("Token set:", token);
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
