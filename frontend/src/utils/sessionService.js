import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/sessions';

const sessionService = {
  async getPublishedSessions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/published`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching published sessions:', error);
      return { success: false, error: 'Failed to fetch published sessions' };
    }
  },

  async getUserSessions(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching user sessions:', error);
      return { success: false, error: 'Failed to fetch user sessions' };
    }
  },

  async createOrUpdateSession(sessionData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, sessionData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error saving session:', error);
      return { success: false, error: 'Failed to save session' };
    }
  },

  async publishSession(session, userId) {
    try {
      const data = {
        ...session,
        status: 'published',
        userId: userId,
      };
      const response = await axios.post(`${API_BASE_URL}/create`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error publishing session:', error);
      return { success: false, error: 'Failed to publish session' };
    }
  },

  async saveDraft(session, userId) {
    try {
      const data = {
        ...session,
        status: 'draft',
        userId: userId,
      };
      const response = await axios.post(`${API_BASE_URL}/create`, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      return { success: false, error: 'Failed to save draft session' };
    }
  },

  async deleteSession(sessionId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${sessionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      return { success: false, error: 'Failed to delete session' };
    }
  },

  subscribeToUserSessions(userId, callback) {
    console.warn('📡 subscribeToUserSessions is a mock function.');
    return () => {
      console.warn('📴 Unsubscribed.');
    };
  }
};

export default sessionService;
