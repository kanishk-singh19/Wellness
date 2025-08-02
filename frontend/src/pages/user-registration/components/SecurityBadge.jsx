import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = () => {
  return (
    <div className="flex items-center justify-center space-x-6 py-6 border-t border-border bg-muted/30">
      {/* SSL Security */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={12} className="text-success" />
        </div>
        <span>SSL Secured</span>
      </div>

      {/* Data Protection */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Lock" size={12} className="text-primary" />
        </div>
        <span>Data Protected</span>
      </div>

      {/* Privacy Assured */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
          <Icon name="Eye" size={12} className="text-accent" />
        </div>
        <span>Privacy First</span>
      </div>
    </div>
  );
};

export default SecurityBadge;