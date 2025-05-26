import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:5001/api',
=======
  baseURL: 'http://localhost:5000/api',
>>>>>>> origin/main
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
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

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    console.log('Network error or server not running');
    return Promise.reject(error);
  }
);

export default api; 