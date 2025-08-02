import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import WellnessImageSection from './components/WellnessImageSection';
import LoginHeader from './components/LoginHeader';
import SecurityBadges from './components/SecurityBadges';

const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/personal-session-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:w-1/2">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header Section */}
            <LoginHeader />

            {/* Login Form */}
            <div className="bg-card rounded-lg border border-border p-8 shadow-wellness">
              <LoginForm />
            </div>

            {/* Security Badges */}
            <SecurityBadges />

            {/* Footer Links */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary hover:text-primary/80 transition-wellness">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary/80 transition-wellness">
                  Privacy Policy
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} WellnessHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Wellness Image Section (Desktop Only) */}
        <WellnessImageSection />
      </div>
    </div>
  );
};

export default UserLogin;