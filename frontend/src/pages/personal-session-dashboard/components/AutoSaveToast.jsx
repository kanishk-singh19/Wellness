import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveToast = ({ show, message = "Draft saved automatically", onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onHide, 300); // Wait for fade out animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show && !isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="bg-success text-success-foreground px-4 py-3 rounded-lg shadow-wellness-lg flex items-center space-x-3 min-w-64">
        <div className="flex-shrink-0">
          <Icon name="CheckCircle" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs opacity-90">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 hover:bg-success-foreground/10 rounded p-1 transition-wellness"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default AutoSaveToast;