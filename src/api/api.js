//frontend/src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The base URL for all our backend requests
});

// This is an "interceptor". It's a function that runs BEFORE every single request.
// It automatically adds the JWT token to the headers if it exists.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This function runs for every RESPONSE that comes from the server
api.interceptors.response.use(
  (response) => response, // If the response is successful (2xx status), just pass it through
  (error) => {
    const { config, response } = error;
    const originalRequest = config;
    // If the server responds with a 401 (Unauthorized) error AND if the URL of the request was NOT from the login or register.
    if (response && response.status === 401 && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/register') {
      console.log('Session expired or invalid. Logging out.');

      // 1. Remove the expired token from storage
      localStorage.removeItem('token');

      // 2. Redirect the user to the login page
      // We use window.location here because we are outside of a React component
      window.location.href = '/login';
    }

    // For all other errors, just let the component handle them
    return Promise.reject(error);
  }
);

export default api;