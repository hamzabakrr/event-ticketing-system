import axios from 'axios';
export default api;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
import axios from 'axios';
// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle err
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('token');
    window.location = '/login';
  }
  return Promise.reject(error);
});



const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your actual backend base URL
  withCredentials: true, // For cookies/session-based auth
});

// Automatically attach token (if needed)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

