import axios from 'axios';
<<<<<<< HEAD
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);
=======

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});
>>>>>>> origin/main

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
<<<<<<< HEAD
    console.error('API Response Error:', error);
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error or server not running');
      return Promise.reject(error);
    }

    // Handle specific error codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear auth state
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        toast.error('Validation error');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(error.response?.data?.message || 'Something went wrong');
    }

=======
    // Log the error for debugging
    console.error('API Response Error:', error);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors or server not running
    if (!error.response) {
      console.error('Network error or server not running');
      return Promise.reject({
        response: {
          data: {
            message: 'Unable to connect to server. Please try again later.'
          }
        }
      });
    }
    
>>>>>>> origin/main
    return Promise.reject(error);
  }
);

// API endpoints
const apiWithEndpoints = {
  ...api,
  endpoints: {
    auth: {
      login: (data) => api.post('/auth/login', data),
      register: (data) => api.post('/auth/register', data),
      me: () => api.get('/auth/me'),
      forgotPassword: (data) => api.post('/auth/forgot-password', data),
    },
    users: {
      getAll: () => api.get('/users'),
      getOne: (id) => api.get(`/users/${id}`),
      update: (id, data) => api.put(`/users/${id}`, data),
      delete: (id) => api.delete(`/users/${id}`),
    },
    events: {
      getAll: () => api.get('/events'),
      getOne: (id) => api.get(`/events/${id}`),
      create: (data) => api.post('/events', data),
      update: (id, data) => api.put(`/events/${id}`, data),
      delete: (id) => api.delete(`/events/${id}`),
    },
    bookings: {
      getAll: () => api.get('/bookings'),
      getOne: (id) => api.get(`/bookings/${id}`),
      create: (data) => api.post('/bookings', data),
      cancel: (id) => api.delete(`/bookings/${id}`),
    },
  }
};

export default apiWithEndpoints; 