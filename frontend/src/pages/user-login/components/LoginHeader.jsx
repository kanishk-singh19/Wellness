import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <Link 
        to="/public-session-discovery" 
        className="inline-flex items-center space-x-3 transition-wellness hover:opacity-80"
      >
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-wellness">
          <Icon name="Heart" size={24} color="white" />
        </div>
        <span className="text-2xl font-semibold text-foreground">
          WellnessHub
        </span>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-lg">
          Sign in to access your wellness session dashboard
        </p>
      </div>

      {/* Registration Link */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-muted-foreground">Need an account?</span>
        <Link to="/user-registration">
          <Button variant="link" size="sm" className="p-0 h-auto font-medium">
            Register here
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginHeader;