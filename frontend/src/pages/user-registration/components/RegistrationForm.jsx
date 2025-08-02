import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import { register as registerUser } from '../../../services/authService';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // ✅ Clear any old login state
      localStorage.removeItem('wellnesshubUser');
      localStorage.removeItem('wellnesshubToken');

      alert('✅ Registration successful! Please log in.');
      navigate('/user-login');
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.error || 'Registration failed. Try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleInputChange}
        error={errors.full_name}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      <div className="flex space-x-4">
        {['member', 'practitioner'].map((roleOption) => (
          <button
            key={roleOption}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: roleOption }))}
            className={`border p-2 rounded ${
              formData.role === roleOption ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            {roleOption}
          </button>
        ))}
      </div>

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9"
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} />
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9"
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} />
        </button>
      </div>

      <Checkbox
        label="I agree to the Terms of Service"
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleInputChange}
        error={errors.agreeToTerms}
        required
      />

      {errors.submit && (
        <div className="text-sm text-red-500">{errors.submit}</div>
      )}

      <Button type="submit" fullWidth loading={isLoading}>
        {isLoading ? 'Creating Account...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
