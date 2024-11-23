import axios from "axios";
import {
  createContext,
  useContext,
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
        const response = await fetch("/api/token");
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
        setToken(null);
      }
    };

    fetchToken();
  }, []);

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
