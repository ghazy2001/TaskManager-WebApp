import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor (e.g., to add auth token if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (e.g., to handle global errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Redirecting or clearing session...');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
