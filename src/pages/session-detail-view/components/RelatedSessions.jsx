import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedSessions = ({ sessions, currentSessionId }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const filteredSessions = sessions.filter(session => session.id !== currentSessionId);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleSessionClick = (sessionId) => {
    // In a real app, this would update the URL and fetch new session data
    window.location.href = `/session-detail-view?id=${sessionId}`;
  };

  if (filteredSessions.length === 0) {
    return null;
  }

  return (
    <div className="px-4 lg:px-6 py-6 bg-card border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Related Sessions</h2>
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="transition-wellness"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="transition-wellness"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="flex-shrink-0 w-72 bg-background border border-border rounded-lg overflow-hidden shadow-wellness hover:shadow-wellness-lg transition-wellness cursor-pointer"
            onClick={() => handleSessionClick(session.id)}
          >
            {/* Session Image */}
            <div className="w-full h-40 bg-muted overflow-hidden">
              <Image
                src={session.image}
                alt={session.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Session Info */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                {session.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={session.practitioner.avatar}
                    alt={session.practitioner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-muted-foreground truncate">
                  {session.practitioner.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{session.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={14} />
                  <span>{session.participants}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span>{session.rating}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {session.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {session.tags.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                    +{session.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile scroll indicators */}
      <div className="md:hidden flex justify-center mt-4 space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: Math.ceil(filteredSessions.length / 2) }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedSessions;