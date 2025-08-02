import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sessionService from '../../utils/sessionService';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import SessionCard from './components/SessionCard';
import StatsCard from './components/StatsCard';
import EmptyState from './components/EmptyState';
import FilterBar from './components/FilterBar';
import CreateSessionFAB from './components/CreateSessionFAB';
import AutoSaveToast from './components/AutoSaveToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PersonalSessionDashboard = () => {
  const [activeTab, setActiveTab] = useState('drafts');
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', sort: 'recent' });
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      if (authLoading || !user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await sessionService.getUserSessions(user.id);

        if (result.success && isMounted) {
          setSessions(result.data || []);
        } else if (isMounted) {
          setError(result.error || 'Failed to load sessions');
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load sessions');
          console.log('Session loading error:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSessions();
    return () => { isMounted = false; };
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = sessionService.subscribeToUserSessions(user.id, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setSessions(prev => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...prev];
          case 'UPDATE':
            return prev.map(session => 
              session._id === newRecord._id ? newRecord : session
            );
          case 'DELETE':
            return prev.filter(session => session._id !== oldRecord._id);
          default:
            return prev;
        }
      });
    });

    return unsubscribe;
  }, [user?.id]);

  useEffect(() => {
    let filtered = sessions.filter(session => {
      const matchesSearch = session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            session.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTab = activeTab === 'drafts' ? session.status === 'draft' :
                         activeTab === 'published' ? session.status === 'published' : true;
      const matchesStatus = filters.status === 'all' || session.status === filters.status;
      return matchesSearch && matchesTab && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'recent':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, activeTab, filters]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleSort = (sortBy) => setFilters(prev => ({ ...prev, sort: sortBy }));
  const handleEditSession = (session) => navigate('/session-editor', { state: { session } });

  const handlePublishSession = async (session) => {
    try {
      const result = await sessionService.publishSession(session._id);
      if (result.success) {
        setSessions(prev => prev.map(s => s._id === session._id ? result.data : s));
        setShowAutoSaveToast(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to publish session');
      console.log('Publish error:', error);
    }
  };

  const handleUnpublishSession = async (session) => {
    try {
      const result = await sessionService.updateSession(session._id, { ...session, status: 'draft' });
      if (result.success) {
        setSessions(prev => prev.map(s => s._id === session._id ? result.data : s));
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to unpublish session');
      console.log('Unpublish error:', error);
    }
  };

  const handleDeleteSession = async (session) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const result = await sessionService.deleteSession(session._id);
        if (result.success) {
          setSessions(prev => prev.filter(s => s._id !== session._id));
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to delete session');
        console.log('Delete error:', error);
      }
    }
  };

  const getStats = () => {
    const totalSessions = sessions.length;
    const draftCount = sessions.filter(s => s.status === 'draft').length;
    const publishedCount = sessions.filter(s => s.status === 'published').length;
    const totalViews = sessions.reduce((sum, s) => sum + (s.views || 0), 0);
    return { totalSessions, draftCount, publishedCount, totalViews };
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/user-login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading your sessions...</span>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        {error && (
          <div className="mb-6 flex items-start space-x-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md border border-destructive/20">
            <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-destructive hover:text-destructive/80"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Header & Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Welcome back, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-muted-foreground mt-1">Manage your wellness sessions</p>
            </div>
            <Button
              variant="default"
              onClick={() => navigate('/session-editor')}
              className="hidden sm:flex"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Create Session
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Sessions" value={stats.totalSessions} icon="FileText" color="primary" />
            <StatsCard title="Drafts" value={stats.draftCount} icon="Clock" color="warning" />
            <StatsCard title="Published" value={stats.publishedCount} icon="Send" color="success" />
            <StatsCard title="Total Views" value={stats.totalViews} icon="Eye" color="accent" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {['drafts', 'published'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-wellness ${
                  activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'drafts' ? 'My Drafts' : 'Published Sessions'}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <FilterBar onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} activeFilters={filters} />

        {/* Session Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onEdit={handleEditSession}
                onPublish={handlePublishSession}
                onUnpublish={handleUnpublishSession}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={searchQuery ? 'search' : activeTab} />
        )}
      </main>

      <CreateSessionFAB />
      <AutoSaveToast show={showAutoSaveToast} message="Session published!" onHide={() => setShowAutoSaveToast(false)} />
      <TabNavigation />
    </div>
  );
};

export default PersonalSessionDashboard;
