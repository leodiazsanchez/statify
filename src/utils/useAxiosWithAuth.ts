import { useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { useAuth } from "../providers/authProvider";

// Create Axios instance outside the hook to ensure it persists across renders
const apiClient = axios.create({
  timeout: 10000,
});

export const useAxiosWithAuth = (): AxiosInstance => {
  const { token, refreshToken, setToken } = useAuth(); // Assuming you have setToken to update the token

  useEffect(() => {
    if (token) {
      console.log("Using token:", token); // Log to ensure token is available
      console.log("Using refresh:", refreshToken);

      // Add request interceptor to include token in headers
      const requestInterceptor = apiClient.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Add response interceptor to handle unauthorized errors
      const responseInterceptor = apiClient.interceptors.response.use(
        (response) => response, // If response is successful, return it
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 500 && refreshToken) {
            try {
              // Call /refresh_token endpoint with refresh token
              const refreshResponse = await axios.get(
                `api/refresh_token/${refreshToken}`
              );

              // Get the new tokens
              const { newToken, newRefreshToken } = refreshResponse.data;

              // Update the tokens in your auth context/state
              setToken(newToken, newRefreshToken);

              // Retry the original request with the new token
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return axios(originalRequest); // Retry original request
            } catch (refreshError) {
              // Handle refresh token failure
              console.error("Token refresh failed", refreshError);
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error); // If not unauthorized, reject the error
        }
      );

      // Cleanup interceptors when the token changes
      return () => {
        apiClient.interceptors.request.eject(requestInterceptor);
        apiClient.interceptors.response.eject(responseInterceptor);
      };
    } else {
      console.log("No token found"); // Log if token is not found
    }
  }, [token, refreshToken, setToken]); // Runs when token or refreshToken changes

  return apiClient;
};
