import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Car as CarIcon } from 'lucide-react';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { Car } from '../types';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    carBrand: '',
    carModel: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.carBrand) newErrors.carBrand = 'Car brand is required';
    if (!formData.carModel) newErrors.carModel = 'Car model is required';
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const car: Car = {
        id: `car-${Date.now()}`,
        brand: formData.carBrand,
        model: formData.carModel
      };
      
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        cars: [car]
      });
      
      navigate('/');
    } catch (error) {
      setErrors({ form: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-blue-900 text-white p-8 flex flex-col justify-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center mb-6">
              <CarIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">E6 Car Spa</h2>
            <p className="text-blue-200 mb-6 text-center">
              Join us to experience premium car care services with top-notch mechanics and state-of-the-art equipment.
            </p>
            <div className="hidden md:block mt-8">
              <p className="text-sm text-blue-200 text-center">
                Already have an account?
              </p>
              <div className="mt-3 text-center">
                <Link 
                  to="/login"
                  className="inline-block px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h3>
            
            {errors.form && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Full Name"
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  className="pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="relative">
                <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  className="pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Address"
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  className="pl-10"
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="md:w-1/2">
                  <Input
                    label="Car Brand"
                    id="carBrand"
                    name="carBrand"
                    type="text"
                    value={formData.carBrand}
                    onChange={handleChange}
                    error={errors.carBrand}
                    placeholder="e.g., Honda"
                  />
                </div>
                <div className="md:w-1/2">
                  <Input
                    label="Car Model"
                    id="carModel"
                    name="carModel"
                    type="text"
                    value={formData.carModel}
                    onChange={handleChange}
                    error={errors.carModel}
                    placeholder="e.g., City"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="pl-10"
                  placeholder="Create a password"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  className="pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center md:hidden">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;