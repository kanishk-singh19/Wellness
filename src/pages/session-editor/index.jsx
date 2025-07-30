import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sessionService from '../../utils/sessionService';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import EditorToolbar from './components/EditorToolbar';
import SessionForm from './components/SessionForm';
import PreviewPanel from './components/PreviewPanel';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import Icon from '../../components/AppIcon';

const SessionEditor = () => {
  const [sessionData, setSessionData] = useState({
    id: null,
    title: '',
    tags: [],
    json_file_url: '',
    status: 'draft'
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  // Load session data if editing existing session
  useEffect(() => {
    const existingSession = location.state?.session;
    if (existingSession) {
      setSessionData({
        id: existingSession.id,
        title: existingSession.title || '',
        tags: existingSession.tags || [],
        json_file_url: existingSession.json_file_url || '',
        status: existingSession.status || 'draft'
      });
      setLastSaved(new Date(existingSession.updated_at));
    }
  }, [location.state]);

  // Auto-save debounced function
  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      if (!user?.id || !isDirty) return;

      try {
        setIsSaving(true);
        setError(null);

        const result = await sessionService.saveDraft(data, user.id);

        if (result.success) {
          setSessionData(prev => ({ ...prev, id: result.data.id }));
          setLastSaved(new Date());
          setIsDirty(false);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Auto-save failed');
        console.log('Auto-save error:', error);
      } finally {
        setIsSaving(false);
      }
    }, 5000),
    [user?.id, isDirty]
  );

  // Auto-save when data changes
  useEffect(() => {
    if (isDirty && (sessionData.title || sessionData.tags.length > 0 || sessionData.json_file_url)) {
      debouncedAutoSave(sessionData);
    }
  }, [sessionData, isDirty, debouncedAutoSave]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const handleSessionChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSaveDraft = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      setError(null);

      const result = await sessionService.saveDraft(sessionData, user.id);

      if (result.success) {
        setSessionData(prev => ({ ...prev, id: result.data.id, status: 'draft' }));
        setLastSaved(new Date());
        setIsDirty(false);
        // Show success message
        alert('Draft saved successfully!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to save draft');
      console.log('Save draft error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user?.id) return;

    // Validate required fields
    if (!sessionData.title.trim()) {
      setError('Title is required to publish');
      return;
    }
    
    if (!sessionData.json_file_url.trim()) {
      setError('JSON file URL is required to publish');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const result = await sessionService.publishSession(sessionData, user.id);

      if (result.success) {
        setSessionData(prev => ({ ...prev, id: result.data.id, status: 'published' }));
        setLastSaved(new Date());
        setIsDirty(false);
        // Show success message and redirect
        alert('Session published successfully!');
        navigate('/personal-session-dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to publish session');
      console.log('Publish error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionData.id || !user?.id) return;

    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        const result = await sessionService.deleteSession(sessionData.id, user.id);

        if (result.success) {
          navigate('/personal-session-dashboard');
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to delete session');
        console.log('Delete error:', error);
      }
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/user-login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        {/* Error Message */}
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

        {/* Editor Toolbar */}
        <EditorToolbar
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onDelete={sessionData.id ? handleDelete : null}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showPreview={showPreview}
          isPublished={sessionData.status === 'published'}
          isSaving={isSaving}
          isDirty={isDirty}
        />

        {/* Auto-save Indicator */}
        <AutoSaveIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          isDirty={isDirty}
        />

        {/* Editor Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Session Form */}
          <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
            <SessionForm
              sessionData={sessionData}
              onChange={handleSessionChange}
              disabled={isSaving}
            />
          </div>

          {/* Preview Panel */}
          <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
            <PreviewPanel
              sessionData={sessionData}
              isPublished={sessionData.status === 'published'}
            />
          </div>
        </div>
      </main>

      <TabNavigation />
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export default SessionEditor;