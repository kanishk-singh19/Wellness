import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveIndicator = ({ status, lastSaved, hasUnsavedChanges }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === 'saved') {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Icon name="Loader2" size={14} className="animate-spin text-primary" />;
      case 'saved':
        return <Icon name="Check" size={14} className="text-success" />;
      case 'error':
        return <Icon name="AlertCircle" size={14} className="text-destructive" />;
      default:
        return hasUnsavedChanges ? 
          <Icon name="Circle" size={14} className="text-warning" /> : 
          <Icon name="CheckCircle" size={14} className="text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Auto-saving...';
      case 'saved':
        return 'Auto-saved';
      case 'error':
        return 'Save failed';
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-primary';
      case 'saved':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return hasUnsavedChanges ? 'text-warning' : 'text-muted-foreground';
    }
  };

  return (
    <>
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              {new Date(lastSaved).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
      </div>

      {/* Auto-save Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-success text-success-foreground px-4 py-2 rounded-md shadow-wellness-lg flex items-center space-x-2">
            <Icon name="Check" size={16} />
            <span className="text-sm font-medium">Auto-saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoSaveIndicator;