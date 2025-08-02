// src/utils/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

class AuthService {
  async register(full_name, email, password, role = 'member') {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        full_name,
        email,
        password,
        role,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }

  async login(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
