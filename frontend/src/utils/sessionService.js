import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/sessions`;

const sessionService = {
  async getPublishedSessions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/public`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching published sessions:', error);
      return { success: false, error: 'Failed to fetch published sessions' };
    }
  },

  async getUserSessions(userId, token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching user sessions:', error);
      return { success: false, error: 'Failed to fetch user sessions' };
    }
  },

  async createOrUpdateSession(sessionData, token) {
    try {
      const response = await axios.post(`${API_BASE_URL}`, sessionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error saving session:', error);
      return { success: false, error: 'Failed to save session' };
    }
  },

  async publishSession(sessionId, token) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${sessionId}/publish`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error publishing session:', error);
      return { success: false, error: 'Failed to publish session' };
    }
  },

  async saveDraft(sessionData, token) {
    try {
      const response = await axios.post(`${API_BASE_URL}`, sessionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      return { success: false, error: 'Failed to save draft session' };
    }
  },

  async deleteSession(sessionId, token) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      return { success: false, error: 'Failed to delete session' };
    }
  },

  async getSessionById(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${sessionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching session by ID:', error);
      return { success: false, error: 'Failed to fetch session' };
    }
  },

  subscribeToUserSessions(userId, callback) {
    // This is a mock for real-time support, can be expanded in future
    console.warn('📡 subscribeToUserSessions is a mock function.');
    return () => {
      console.warn('📴 Unsubscribed.');
    };
  },
};

export default sessionService;
