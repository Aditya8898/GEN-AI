import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// Create axios instance with credentials support for cookies
const api = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  withCredentials: true // IMPORTANT: Allows cookies to be sent/received
});

// Interceptor to include token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get current logged-in user
export const getMe = async () => {
  const response = await api.get('/get-me');
  return response.data;
};

// Logout user and clear session
export const logout = async () => {
  try {
    const response = await api.get('/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (err) {
    localStorage.removeItem('token');
    throw err;
  }
};

// Email/password login
export const login = async ({ email, password }) => {
  const response = await api.post('/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Email/password registration
export const register = async ({ username, email, password }) => {
  const response = await api.post('/register', { username, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export default api;

