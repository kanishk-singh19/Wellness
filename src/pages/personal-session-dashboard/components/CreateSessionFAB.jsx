import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateSessionFAB = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-popover border border-border rounded-md shadow-wellness-lg text-sm text-foreground whitespace-nowrap">
            Create New Session
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
          </div>
        )}

        {/* FAB Button */}
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate('/session-editor')}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-14 h-14 rounded-full shadow-wellness-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90"
        >
          <Icon name="Plus" size={24} color="white" />
        </Button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping"></div>
      </div>
    </div>
  );
};

export default CreateSessionFAB;