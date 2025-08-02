import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import sessionService from '../../utils/sessionService';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import SessionHero from './components/SessionHero';
import SessionContent from './components/SessionContent';
import SessionActions from './components/SessionActions';
import PractitionerSidebar from './components/PractitionerSidebar';
import RelatedSessions from './components/RelatedSessions';
import SessionComments from './components/SessionComments';
import Icon from '../../components/AppIcon';

const SessionDetailView = () => {
  const [session, setSession] = useState(null);
  const [relatedSessions, setRelatedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Load session data
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get session from navigation state or load from ID
        const sessionFromState = location.state?.session;
        
        if (sessionFromState) {
          setSession(sessionFromState);
          
          // Load related sessions
          const result = await sessionService.getPublicSessions();
          if (result.success && isMounted) {
            // Filter out current session and find related by tags
            const related = result.data
              ?.filter(s => s.id !== sessionFromState.id)
              ?.filter(s => 
                s.tags?.some(tag => 
                  sessionFromState.tags?.includes(tag)
                )
              )
              ?.slice(0, 4) || [];
            
            setRelatedSessions(related);
          }
        } else {
          // If no session in state, redirect to discovery page
          navigate('/public-session-discovery');
          return;
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load session details');
          console.log('Session detail loading error:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [location.state, navigate]);

  const handleStartSession = () => {
    if (session?.json_file_url) {
      // In a real app, this would open the session player or navigate to session
      window.open(session.json_file_url, '_blank');
    }
  };

  const handleBookmark = () => {
    // Bookmark functionality would be implemented here
    alert('Bookmark functionality would be implemented here');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: session?.title,
        text: `Check out this wellness session: ${session?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRelatedSessionClick = (relatedSession) => {
    // Increment view count
    sessionService.incrementViews(relatedSession.id);
    
    // Update current session
    setSession(relatedSession);
    
    // Update URL without navigation to keep component mounted
    window.history.pushState(
      { session: relatedSession }, 
      '', 
      '/session-detail-view'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading session...</span>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="container mx-auto px-4 lg:px-6 py-12 max-w-4xl text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {error || 'Session Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The session you are looking for could not be found.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/public-session-discovery')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-wellness"
            >
              Browse Sessions
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-muted text-muted-foreground px-6 py-2 rounded-md hover:bg-muted/80 transition-wellness"
            >
              Go Back
            </button>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }

  const isOwner = user?.id === session?.user_id;

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        {/* Session Hero */}
        <SessionHero session={session} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Session Content */}
          <div className="lg:col-span-2 space-y-8">
            <SessionContent session={session} />
            
            {/* Session Actions */}
            <SessionActions
              session={session}
              onStartSession={handleStartSession}
              onBookmark={handleBookmark}
              onShare={handleShare}
              isOwner={isOwner}
            />

            {/* Comments Section */}
            <SessionComments 
              sessionId={session.id}
              isAuthenticated={!!user}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Practitioner Info */}
            <PractitionerSidebar 
              practitioner={session.user_profiles}
              sessionCount={1} // This would be fetched from the practitioner's profile
            />

            {/* Related Sessions */}
            {relatedSessions.length > 0 && (
              <RelatedSessions
                sessions={relatedSessions}
                onSessionClick={handleRelatedSessionClick}
              />
            )}
          </div>
        </div>
      </main>

      <TabNavigation />
    </div>
  );
};

export default SessionDetailView;