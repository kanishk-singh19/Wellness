import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sessionService from '../../utils/sessionService';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import SessionGrid from './components/SessionGrid';
import AdvancedFilterPanel from './components/AdvancedFilterPanel';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import SessionCardSkeleton from './components/SessionCardSkeleton';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PublicSessionDiscovery = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load public sessions
  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await sessionService.getPublicSessions();

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

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up real-time subscription for published sessions
  useEffect(() => {
    const unsubscribe = sessionService.subscribeToPublicSessions((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setSessions(prev => {
        switch (eventType) {
          case 'INSERT':
            if (newRecord.status === 'published') {
              return [newRecord, ...prev];
            }
            return prev;
          case 'UPDATE':
            if (newRecord.status === 'published') {
              return prev.map(session => 
                session.id === newRecord.id ? newRecord : session
              );
            } else {
              // Session was unpublished, remove it
              return prev.filter(session => session.id !== newRecord.id);
            }
          case 'DELETE':
            return prev.filter(session => session.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    return unsubscribe;
  }, []);

  // Filter and sort sessions
  useEffect(() => {
    let filtered = [...sessions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        session.user_profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(session =>
        selectedTags.some(selectedTag =>
          session.tags?.some(tag => 
            tag.toLowerCase().includes(selectedTag.toLowerCase())
          )
        )
      );
    }

    // Sort sessions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'author':
          return a.user_profiles?.full_name?.localeCompare(b.user_profiles?.full_name) || 0;
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, selectedTags, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('recent');
  };

  const handleSessionClick = (session) => {
    // Increment view count
    sessionService.incrementViews(session.id);
    
    // Navigate to session detail
    navigate('/session-detail-view', { state: { session } });
  };

  // Get all unique tags from sessions
  const allTags = [...new Set(sessions.flatMap(session => session.tags || []))];

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'recent';

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Discover Wellness Sessions
              </h1>
              <p className="text-muted-foreground mt-1">
                Explore curated wellness sessions from practitioners around the world
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search sessions, tags, or practitioners..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center space-x-2">
              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
              />
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-muted' : ''}
              >
                <Icon name="Filter" size={16} className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {(searchQuery ? 1 : 0) + selectedTags.length + (sortBy !== 'recent' ? 1 : 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          <FilterChips
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            sortBy={sortBy}
            onClearSearch={() => setSearchQuery('')}
            onRemoveTag={handleTagToggle}
            onClearSort={() => setSortBy('recent')}
            onClearAll={handleClearFilters}
          />
        </div>

        {/* Advanced Filter Panel */}
        <AdvancedFilterPanel
          show={showFilters}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearFilters={handleClearFilters}
        />

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

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SessionCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <SessionGrid
            sessions={filteredSessions}
            onSessionClick={handleSessionClick}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {hasActiveFilters ? 'No sessions match your filters' : 'No sessions available'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search terms or filters to find more sessions.' :'Check back later for new wellness sessions from our practitioners.'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </main>

      <TabNavigation />
    </div>
  );
};

export default PublicSessionDiscovery;