import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onBookmark, onEdit, onPublish, onUnpublish, onDelete }) => {
  const [isBookmarked, setIsBookmarked] = useState(session.isBookmarked || false);
  const navigate = useNavigate();

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(session.id, !isBookmarked);
  };

  const handleCardClick = () => {
    navigate('/session-detail-view', { state: { sessionId: session.id } });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(session);
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    onPublish?.(session);
  };

  const handleUnpublish = (e) => {
    e.stopPropagation();
    onUnpublish?.(session);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(session);
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
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={session.thumbnail}
          alt={session.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="sm">
            <Icon name="Play" size={16} className="mr-2" />
            View Session
          </Button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background"
        >
          <Icon
            name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'}
            size={16}
            className={isBookmarked ? 'text-primary' : 'text-muted-foreground'}
          />
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {formatDuration(session.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2">{session.title}</h3>

        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} />
          </div>
          <span className="text-sm text-muted-foreground">{session.practitioner}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {session.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning" />
              <span className="text-sm">{session.rating || '4.5'}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md ${getDifficultyColor(session.difficulty)}`}>
              {session.difficulty || 'Beginner'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span className="text-xs">{session.participants || 0}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="xs" onClick={handleEdit}>
            <Icon name="Edit" size={12} className="mr-1" />
            Edit
          </Button>

          {session.status === 'draft' ? (
            <Button variant="default" size="xs" onClick={handlePublish}>
              <Icon name="Upload" size={12} className="mr-1" />
              Publish
            </Button>
          ) : (
            <Button variant="outline" size="xs" onClick={handleUnpublish}>
              <Icon name="Archive" size={12} className="mr-1" />
              Unpublish
            </Button>
          )}

          <Button variant="ghost" size="xs" onClick={handleDelete}>
            <Icon name="Trash" size={12} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
