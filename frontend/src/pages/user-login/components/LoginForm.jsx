import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { login } from '../../../services/authService'; // ✅ correct path

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      // Expect result to have user and token, matching backend
      if (result.user && result.token) {
        localStorage.setItem('wellnesshubUser', JSON.stringify(result.user));
        localStorage.setItem('wellnesshubToken', result.token);
        navigate('/personal-session-dashboard');
      } else {
        setErrors({ submit: result.error || 'Login failed. Try again.' });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({
        submit:
          err?.response?.data?.error ||
          err.message ||
          'Something went wrong. Try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'user@wellnesshub.com',
      password: 'wellness123',
      rememberMe: false,
    });
  };

  const handleForgotPassword = () => {
    alert('Password reset not implemented in this demo.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          error={errors.email}
          required
          className="w-full"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors.password}
            required
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-wellness"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            size="sm"
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-wellness"
          >
            Forgot password?
          </button>
        </div>

        {errors.submit && (
          <div className="flex items-start space-x-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md border border-destructive/20">
            <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          className="transition-wellness"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
