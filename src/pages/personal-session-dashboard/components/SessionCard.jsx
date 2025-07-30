import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onEdit, onPublish, onUnpublish, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'text-success bg-success/10';
      case 'draft':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-wellness transition-wellness group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 
            className="font-medium text-foreground text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-primary transition-wellness"
            onClick={() => navigate('/session-detail-view', { state: { session } })}
          >
            {session.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              <Icon 
                name={session.status === 'published' ? 'CheckCircle' : 'Clock'} 
                size={12} 
                className="mr-1" 
              />
              {session.status === 'published' ? 'Published' : 'Draft'}
            </span>
            {session.tags && session.tags.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {session.tags.slice(0, 2).join(', ')}
                {session.tags.length > 2 && ` +${session.tags.length - 2}`}
              </span>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-wellness ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/session-detail-view', { state: { session } })}
            className="h-8 w-8"
          >
            <Icon name="Eye" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(session)}
            className="h-8 w-8"
          >
            <Icon name="Edit" size={14} />
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} />
            <span>Created {formatDate(session.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Modified {formatDate(session.updatedAt)}</span>
          </div>
        </div>
        {session.views && (
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={12} />
            <span>{session.views} views</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {session.status === 'draft' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(session)}
                loading={isLoading}
                className="text-xs"
              >
                <Icon name="Edit" size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAction(() => onPublish(session))}
                loading={isLoading}
                className="text-xs"
              >
                <Icon name="Send" size={14} className="mr-1" />
                Publish
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(session)}
                loading={isLoading}
                className="text-xs"
              >
                <Icon name="Edit" size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction(() => onUnpublish(session))}
                loading={isLoading}
                className="text-xs"
              >
                <Icon name="EyeOff" size={14} className="mr-1" />
                Unpublish
              </Button>
            </>
          )}
        </div>

        {/* More Actions */}
        <div className="relative group/menu">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Icon name="MoreVertical" size={14} />
          </Button>
          
          <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-wellness-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-wellness z-10">
            <div className="py-1">
              <button
                onClick={() => navigate('/session-detail-view', { state: { session } })}
                className="w-full px-3 py-2 text-left text-xs hover:bg-muted transition-wellness flex items-center space-x-2"
              >
                <Icon name="Eye" size={12} />
                <span>View Details</span>
              </button>
              <button
                onClick={() => {/* Handle duplicate */}}
                className="w-full px-3 py-2 text-left text-xs hover:bg-muted transition-wellness flex items-center space-x-2"
              >
                <Icon name="Copy" size={12} />
                <span>Duplicate</span>
              </button>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={() => handleAction(() => onDelete(session))}
                className="w-full px-3 py-2 text-left text-xs hover:bg-muted transition-wellness flex items-center space-x-2 text-destructive"
              >
                <Icon name="Trash2" size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;