import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("/api/token");
        const json = await response.json();
        if (json.access_token && json.refresh_token) {
          setToken(json.access_token);
          setRefreshToken(json.refresh_token);
        } else {
          console.error("Tokens not found in the response");
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setToken(null);
        setRefreshToken(null);
      }
    };

    fetchTokens();
  }, []);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      refreshToken,
      setRefreshToken,
    }),
    [token, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
