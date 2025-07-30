import { supabase } from './supabase';

class SessionService {
  // Get all published sessions (public access)
  async getPublicSessions() {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          user_profiles!sessions_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load sessions' };
    }
  }

  // Get user's own sessions (both draft and published)
  async getUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load user sessions' };
    }
  }

  // Get single session by ID
  async getSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          user_profiles!sessions_user_id_fkey(
            full_name,
            email,
            role
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load session' };
    }
  }

  // Create or update draft session
  async saveDraft(sessionData, userId) {
    try {
      const sessionPayload = {
        ...sessionData,
        user_id: userId,
        status: 'draft',
        updated_at: new Date().toISOString()
      };

      let result;
      if (sessionData.id) {
        // Update existing draft
        result = await supabase
          .from('sessions')
          .update(sessionPayload)
          .eq('id', sessionData.id)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Create new draft
        result = await supabase
          .from('sessions')
          .insert([sessionPayload])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to save draft' };
    }
  }

  // Publish session
  async publishSession(sessionData, userId) {
    try {
      const sessionPayload = {
        ...sessionData,
        user_id: userId,
        status: 'published',
        updated_at: new Date().toISOString()
      };

      let result;
      if (sessionData.id) {
        // Update existing session to published
        result = await supabase
          .from('sessions')
          .update(sessionPayload)
          .eq('id', sessionData.id)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Create new published session
        result = await supabase
          .from('sessions')
          .insert([sessionPayload])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to publish session' };
    }
  }

  // Delete session
  async deleteSession(sessionId, userId) {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to delete session' };
    }
  }

  // Increment session views
  async incrementViews(sessionId) {
    try {
      const { error } = await supabase.rpc('increment_session_views', {
        session_id: sessionId
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update views' };
    }
  }

  // Search sessions
  async searchSessions(query, filters = {}) {
    try {
      let queryBuilder = supabase
        .from('sessions')
        .select(`
          *,
          user_profiles!sessions_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('status', 'published');

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,tags.cs.{${query}}`);
      }

      // Apply filters
      if (filters.tags && filters.tags.length > 0) {
        queryBuilder = queryBuilder.overlaps('tags', filters.tags);
      }

      // Apply sorting
      const sortBy = filters.sort || 'created_at';
      const ascending = filters.ascending || false;
      queryBuilder = queryBuilder.order(sortBy, { ascending });

      const { data, error } = await queryBuilder;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to search sessions' };
    }
  }

  // Real-time subscription for user sessions
  subscribeToUserSessions(userId, callback) {
    const channel = supabase
      .channel('user-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  // Real-time subscription for published sessions
  subscribeToPublicSessions(callback) {
    const channel = supabase
      .channel('public-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: 'status=eq.published'
        },
        callback
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }
}

export default new SessionService();