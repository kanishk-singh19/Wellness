import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'accent':
        return 'text-accent bg-accent/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getTrendColor = (trendType) => {
    switch (trendType) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-wellness transition-wellness">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-semibold text-foreground">{value}</span>
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 text-xs ${getTrendColor(trend)}`}>
                <Icon 
                  name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;