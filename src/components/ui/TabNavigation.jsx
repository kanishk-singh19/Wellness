import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, [location]);

  const publicTabs = [
    {
      label: 'Discover',
      path: '/public-session-discovery',
      icon: 'Compass',
      tooltip: 'Explore wellness sessions'
    }
  ];

  const authenticatedTabs = [
    {
      label: 'Discover',
      path: '/public-session-discovery',
      icon: 'Compass',
      tooltip: 'Explore wellness sessions'
    },
    {
      label: 'My Sessions',
      path: '/personal-session-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Manage your sessions'
    }
  ];

  const tabs = isAuthenticated ? authenticatedTabs : publicTabs;

  const isActiveTab = (path) => {
    if (path === '/public-session-discovery') {
      return location.pathname === path;
    }
    if (path === '/personal-session-dashboard') {
      return location.pathname === path || 
             location.pathname === '/session-editor' || 
             location.pathname === '/session-detail-view';
    }
    return location.pathname === path;
  };

  // Don't show tab navigation on auth pages
  if (location.pathname === '/user-login' || location.pathname === '/user-registration') {
    return null;
  }

  return (
    <>
      {/* Desktop Tab Navigation - Integrated in Header */}
      <div className="hidden lg:block">
        {/* This component is integrated into GlobalHeader on desktop */}
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-wellness">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-wellness ${
                  isActive
                    ? 'text-primary bg-secondary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                title={tab.tooltip}
              >
                <Icon 
                  name={tab.icon} 
                  size={20} 
                  className={`mb-1 transition-wellness ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span className={`text-xs font-medium transition-wellness ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-b-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom navigation */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default TabNavigation;