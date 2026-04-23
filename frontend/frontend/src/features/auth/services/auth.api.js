import axios from 'axios';

// Create axios instance with credentials support for cookies
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth`,
  withCredentials: true // IMPORTANT: Allows cookies to be sent/received
});

// Google login - sync Firebase token with backend
export const googleSync = (idToken) => 
  api.post('/google-login', { idToken });

// Get current logged-in user
export const getMe = () => 
  api.get('/get-me');

// Logout user and clear session
export const logout = () => 
  api.get('/logout');

// Email/password login
export const login = ({ email, password }) => 
  api.post('/login', { email, password });

// Email/password registration
export const register = ({ username, email, password }) => 
  api.post('/register', { username, email, password });

export default api;

