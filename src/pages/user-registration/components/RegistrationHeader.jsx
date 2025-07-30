import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const RegistrationHeader = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-wellness">
          <Icon name="Heart" size={24} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-foreground">WellnessHub</h1>
          <p className="text-sm text-muted-foreground">Join our wellness community</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Create Your Account
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Join thousands of wellness practitioners and enthusiasts. Share your sessions, 
          discover new practices, and build your wellness community.
        </p>
      </div>

      {/* Login Link */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link 
          to="/user-login" 
          className="text-primary hover:text-primary/80 font-medium transition-wellness"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default RegistrationHeader;