import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import SecurityBadge from './components/SecurityBadge';
import WellnessBackground from './components/WellnessBackground';

const UserRegistration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('wellnesshubToken');
    if (token) {
      navigate('/personal-session-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="relative min-h-screen">
        <WellnessBackground />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-lg">
            {/* Registration Card */}
            <div className="bg-card border border-border rounded-xl shadow-wellness-lg overflow-hidden">
              {/* Header Section */}
              <div className="px-6 pt-8 pb-6">
                <RegistrationHeader />
              </div>

              {/* Form Section */}
              <div className="px-6 pb-8">
                <RegistrationForm />
              </div>

              {/* Security Badge */}
              <SecurityBadge />
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                By creating an account, you're joining a community dedicated to wellness and mindful living. 
                Your data is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation />
    </div>
  );
};

export default UserRegistration;