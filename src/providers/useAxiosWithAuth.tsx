import { useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./authProvider";

const baseURL = "http://localhost:3000";

export default function useAxiosWithAuth() {
  const { token, setToken } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${token}` },
    });

    instance.interceptors.response.use(
      (response) => response, // Pass through if response is successful
      async (error) => {
        const { response } = error;

        // Check if the response is a 401
        if (response && response.status === 401) {
          console.log("here");
          try {
            // Attempt to refresh the token
            const refreshResponse = await axios.get("/api/refresh_token");
            setToken(refreshResponse.data.access_token);

            // Retry the original request with the new token
            const newRequestConfig = {
              ...error.config,
              headers: {
                ...error.config.headers,
                Authorization: `Bearer ${refreshResponse.data.access_token}`,
              },
            };

            return instance(newRequestConfig);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        }

        return Promise.reject(error); // Reject the promise if not a 401
      }
    );

    return instance;
  }, [token, setToken]);

  useEffect(() => {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }, [token, axiosInstance]);

  return axiosInstance;
}
