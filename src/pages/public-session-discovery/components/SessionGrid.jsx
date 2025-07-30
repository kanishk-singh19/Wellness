import React from 'react';
import SessionCard from './SessionCard';
import SessionCardSkeleton from './SessionCardSkeleton';

const SessionGrid = ({ 
  sessions, 
  loading, 
  onBookmark, 
  onLoadMore, 
  hasMore,
  loadingMore 
}) => {
  return (
    <div className="space-y-6">
      {/* Sessions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onBookmark={onBookmark}
          />
        ))}
        
        {/* Loading Skeletons */}
        {loading && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <SessionCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Load More Section */}
      {!loading && sessions.length > 0 && (
        <div className="flex flex-col items-center space-y-4 py-8">
          {hasMore ? (
            <>
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-wellness hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Sessions</span>
                  </>
                )}
              </button>
              
              {loadingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SessionCardSkeleton key={`loading-skeleton-${index}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-2">You've reached the end!</p>
              <p className="text-sm text-muted-foreground">
                Showing all {sessions.length} sessions
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms to find more sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionGrid;