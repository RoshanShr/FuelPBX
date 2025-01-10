import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/";

// Create axios instance
export const clientApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
clientApi.interceptors.request.use(
  (config) => {
    // Get the user details from localStorage on each request to ensure it's up-to-date
    const userDetails = JSON.parse(localStorage.getItem("hostedpbx"));

    if (userDetails && userDetails.accessToken) {
      config.headers.Authorization = `Bearer ${userDetails.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response ?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Retrieve refresh token from localStorage
        const userDetails = JSON.parse(localStorage.getItem("hostedpbx"));
        const refreshToken = userDetails ?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        // Make the call to refresh the token
        const response = await axios.post(`${BASE_URL}refresh`, null, {
          headers: {
            "x-refresh-token": refreshToken
          },
        });

    //    const response = await axios.post(`${BASE_URL}/refresh`, { refreshToken });

        // Get the new access and refresh token from the response
        const {
          accessToken,
          refreshToken: newRefreshToken
        } = response.data;

        // Update the localStorage with new tokens
        userDetails.refreshToken= newRefreshToken;
        userDetails.accessToken= accessToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        console.log(accessToken);

        // Update the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return clientApi(originalRequest);

      } catch (refreshError) {
        // If refreshing the token fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default clientApi;