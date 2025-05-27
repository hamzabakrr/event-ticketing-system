import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
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
      getMyBookings: () => api.get('/bookings/my-bookings'),
      getOne: (id) => api.get(`/bookings/${id}`),
      create: (data) => api.post('/bookings', data),
      cancel: (id) => api.patch(`/bookings/${id}/cancel`),
    },
  }
};

export default apiWithEndpoints; 