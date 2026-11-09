import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      } else if (status === 503) {
        toast.error('Service temporarily unavailable.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again.');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } else {
      toast.error('Network error. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
