import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with industry-standard encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'JWT-based authentication with token management'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'We never share your personal information'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {securityFeatures.map((feature, index) => (
          <div 
            key={index}
            className="flex flex-col items-center text-center space-y-2 p-3 rounded-lg bg-card/50 hover:bg-card transition-wellness"
          >
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name={feature.icon} size={16} className="text-success" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">
                {feature.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;