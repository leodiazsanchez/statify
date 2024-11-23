import { useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { useAuth } from "../providers/authProvider";

// Create Axios instance outside the hook to ensure it persists across renders
const apiClient = axios.create({
  timeout: 10000,
});

export const useAxiosWithAuth = (): AxiosInstance => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      console.log("Using token:", token); // Log to ensure token is available
      // Add request interceptor to include token in headers
      const requestInterceptor = apiClient.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Cleanup interceptor when the token changes
      return () => {
        apiClient.interceptors.request.eject(requestInterceptor);
      };
    } else {
      console.log("No token found"); // Log if token is not found
    }
  }, [token]); // Runs when token changes

  return apiClient;
};
