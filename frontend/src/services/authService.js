// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// LOGIN FUNCTION
export const login = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const response = await axios.post(`${API_URL}/login`, { email, password });

    // ✅ Store token properly for auth
    localStorage.setItem('wellnesshubToken', response.data.token);

    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || 'Login failed. Please try again.'
    };
  }
};

// REGISTER FUNCTION
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);

    // ✅ Store token on registration too
    localStorage.setItem('wellnesshubToken', response.data.token);

    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || 'Registration failed. Please try again.'
    };
  }
};
