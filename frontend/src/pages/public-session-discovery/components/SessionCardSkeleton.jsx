import React from 'react';

const SessionCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-wellness animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-video bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        {/* Practitioner */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-muted rounded-full" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>

        {/* Tags */}
        <div className="flex space-x-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-6 bg-muted rounded w-12" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-4 bg-muted rounded w-12" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="h-4 bg-muted rounded w-8" />
        </div>
      </div>
    </div>
  );
};

export default SessionCardSkeleton;