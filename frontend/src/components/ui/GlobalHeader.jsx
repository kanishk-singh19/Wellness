import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import AuthenticationModal from './AuthenticationModal';

const GlobalHeader = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, loading } = useAuth();

  const handleAuthClick = (mode) => {
    if (user) {
      // User is authenticated, show menu instead
      setShowUserMenu(!showUserMenu);
    } else {
      // User is not authenticated, show auth modal
      setAuthMode(mode);
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/public-session-discovery');
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowUserMenu(false);
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-wellness"
              >
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Icon name="Heart" size={20} />
                </div>
                <span className="text-xl font-semibold text-foreground hidden sm:block">
                  WellnessHub
                </span>
              </button>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/public-session-discovery')}
                className={`text-sm font-medium transition-wellness ${
                  isActivePath('/public-session-discovery')
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Discover
              </button>
              
              {user && (
                <button
                  onClick={() => navigate('/personal-session-dashboard')}
                  className={`text-sm font-medium transition-wellness ${
                    isActivePath('/personal-session-dashboard')
                      ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  My Sessions
                </button>
              )}

              {user && (
                <button
                  onClick={() => navigate('/session-editor')}
                  className={`text-sm font-medium transition-wellness ${
                    isActivePath('/session-editor')
                      ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create
                </button>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              ) : user ? (
                /* Authenticated User Menu */
                <div className="relative">
                  <button
                    onClick={() => handleAuthClick('user')}
                    className="flex items-center space-x-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-wellness"
                  >
                    <div className="bg-primary text-primary-foreground p-1 rounded-full">
                      <Icon name="User" size={16} />
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {getUserDisplayName()}
                    </span>
                    <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-wellness py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        {userProfile?.role && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {userProfile.role}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleNavigate('/personal-session-dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-wellness flex items-center space-x-2"
                      >
                        <Icon name="LayoutDashboard" size={16} />
                        <span>Dashboard</span>
                      </button>
                      
                      <button
                        onClick={() => handleNavigate('/session-editor')}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-wellness flex items-center space-x-2"
                      >
                        <Icon name="Plus" size={16} />
                        <span>Create Session</span>
                      </button>
                      
                      <button
                        onClick={() => handleNavigate('/public-session-discovery')}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-wellness flex items-center space-x-2"
                      >
                        <Icon name="Search" size={16} />
                        <span>Discover Sessions</span>
                      </button>
                      
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-wellness flex items-center space-x-2"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated User Actions */
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAuthClick('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close user menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Authentication Modal */}
      <AuthenticationModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default GlobalHeader;