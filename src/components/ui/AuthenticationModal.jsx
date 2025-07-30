import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import { Checkbox } from './Checkbox';

const AuthenticationModal = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    agreeToTerms: false,
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, authError, clearError } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (mode === 'register' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (mode === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      if (mode === 'login') {
        result = await signIn(formData.email, formData.password);
      } else {
        const userData = {
          full_name: formData.fullName.trim(),
          role: formData.role
        };
        result = await signUp(formData.email, formData.password, userData);
      }

      if (result.success) {
        onClose();
        if (mode === 'register') {
          alert('Registration successful! Please check your email to verify your account.');
        } else {
          navigate('/personal-session-dashboard');
        }
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ 
        submit: mode === 'login' ? 'Login failed. Please try again.' : 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData(prev => ({
      ...prev,
      email: 'user@wellnesshub.com',
      password: 'wellness123'
    }));
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'member',
      agreeToTerms: false,
      rememberMe: false
    });
    setErrors({});
    clearError?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg border border-border shadow-wellness w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ?'Sign in to access your wellness sessions' :'Join our wellness community today'
              }
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-wellness"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => onModeChange('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-wellness ${
                  mode === 'login' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onModeChange('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-wellness ${
                  mode === 'register' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Demo Credentials Helper for Login */}
            {mode === 'login' && (
              <div className="bg-muted/50 p-3 rounded-md border border-muted mb-4">
                <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
                <p className="text-xs font-mono">user@wellnesshub.com / wellness123</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  className="mt-2 text-xs"
                >
                  Use Demo Credentials
                </Button>
              </div>
            )}

            {/* Full Name - Register Only */}
            {mode === 'register' && (
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors.fullName}
                required
              />
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              error={errors.email}
              required
            />

            {/* Role Selection - Register Only */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'member' }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-wellness ${
                      formData.role === 'member' ?'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon name="User" size={16} className="mx-auto mb-1" />
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'practitioner' }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-wellness ${
                      formData.role === 'practitioner' ?'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon name="Heart" size={16} className="mx-auto mb-1" />
                    Practitioner
                  </button>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
                error={errors.password}
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-wellness"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            {/* Confirm Password - Register Only */}
            {mode === 'register' && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-wellness"
                >
                  <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3">
              {mode === 'login' ? (
                <Checkbox
                  label="Remember me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  size="sm"
                />
              ) : (
                <Checkbox
                  label="I agree to the Terms of Service and Privacy Policy"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  size="sm"
                  error={errors.agreeToTerms}
                  required
                />
              )}
            </div>

            {/* Error Message */}
            {(authError || errors.submit) && (
              <div className="flex items-start space-x-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md border border-destructive/20">
                <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
                <span>{authError || errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              className="transition-wellness"
            >
              {isLoading 
                ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* Forgot Password Link - Login Only */}
          {mode === 'login' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => alert('Password reset functionality would be implemented here')}
                className="text-sm text-primary hover:text-primary/80 transition-wellness"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;