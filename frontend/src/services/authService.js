// src/services/authService.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// LOGIN FUNCTION
export const login = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const response = await axios.post(`${API_URL}/login`, { email, password });

    const { token, user } = response.data;

    // ✅ Store token and user locally
    localStorage.setItem('wellnesshubToken', token);
    localStorage.setItem('wellnesshubUser', JSON.stringify(user));

    return {
      success: true,
      user,
      token,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};

// REGISTER FUNCTION
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);

    const { token, user } = response.data;

    // ✅ Store token and user on registration
    localStorage.setItem('wellnesshubToken', token);
    localStorage.setItem('wellnesshubUser', JSON.stringify(user));

    return {
      success: true,
      user,
      token,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || 'Registration failed. Please try again.',
    };
  }
};

// LOGOUT FUNCTION (optional)
export const logout = () => {
  localStorage.removeItem('wellnesshubToken');
  localStorage.removeItem('wellnesshubUser');
};
