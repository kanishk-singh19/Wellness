import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SessionHero = ({ session, onTagClick, isOwner }) => {
  if (!session) return null;

  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 lg:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <span>Sessions</span>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium truncate">{session.title}</span>
        </nav>

        {/* Session Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
          {/* Session Image */}
          <div className="w-full lg:w-48 h-48 lg:h-32 rounded-lg overflow-hidden bg-muted mb-4 lg:mb-0 flex-shrink-0">
            <Image
              src={session.image}
              alt={session.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Session Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {session.title}
              </h1>
              {isOwner && (
                <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'published' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    {session.status === 'published' ? 'Published' : 'Draft'}
                  </div>
                </div>
              )}
            </div>

            {/* Practitioner Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={session.practitioner.avatar}
                  alt={session.practitioner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{session.practitioner.name}</p>
                <p className="text-sm text-muted-foreground">{session.practitioner.title}</p>
              </div>
            </div>

            {/* Session Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={16} />
                <span>Published {session.publishedDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={16} />
                <span>{session.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={16} />
                <span>{session.participants} participants</span>
              </div>
              {session.difficulty && (
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" size={16} />
                  <span className="capitalize">{session.difficulty}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => onTagClick(tag)}
                  className="px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/30 transition-wellness"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHero;