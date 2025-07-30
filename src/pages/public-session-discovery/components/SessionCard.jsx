import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(session.isBookmarked || false);
  const navigate = useNavigate();

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark(session.id, !isBookmarked);
  };

  const handleCardClick = () => {
    navigate('/session-detail-view', { state: { sessionId: session.id } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden shadow-wellness hover:shadow-wellness-lg transition-wellness cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Session Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={session.thumbnail}
          alt={session.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-wellness-slow"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-wellness flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-wellness"
          >
            <Icon name="Play" size={16} className="mr-2" />
            View Session
          </Button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-wellness hover:bg-background"
        >
          <Icon 
            name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
            size={16} 
            className={isBookmarked ? "text-primary" : "text-muted-foreground"} 
          />
        </button>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {formatDuration(session.duration)}
        </div>
      </div>

      {/* Session Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-primary transition-wellness">
          {session.title}
        </h3>

        {/* Practitioner */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} color="var(--color-secondary-foreground)" />
          </div>
          <span className="text-sm text-muted-foreground">{session.practitioner}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {session.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md"
            >
              {tag}
            </span>
          ))}
          {session.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
              +{session.tags.length - 3}
            </span>
          )}
        </div>

        {/* Session Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-sm font-medium text-foreground">{session.rating}</span>
            </div>

            {/* Difficulty */}
            <span className={`text-xs px-2 py-1 rounded-md ${getDifficultyColor(session.difficulty)}`}>
              {session.difficulty}
            </span>
          </div>

          {/* Participants Count */}
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span className="text-xs">{session.participants}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;