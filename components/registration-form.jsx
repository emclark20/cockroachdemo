// components/registration-form.jsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from './card';
import { SubmitButton } from './submit-button';
import { Alert } from './alert';

export function RegistrationForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    favoriteColor: '#',
    nickname: '',
    birthday: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  
  const [colorError, setColorError] = useState('');

  // Check if a string is a valid hex color
  const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for favorite color field
    if (name === 'favoriteColor') {
      // Ensure it starts with #
      let newValue = value;
      if (!newValue.startsWith('#')) {
        newValue = '#' + newValue;
      }
      
      // Limit to 7 characters (#RRGGBB)
      newValue = newValue.slice(0, 7);
      
      // Only allow hex characters
      newValue = newValue.replace(/[^#A-Fa-f0-9]/g, '');
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
      
      // Validate the color format
      if (newValue.length > 1 && !isValidHexColor(newValue)) {
        setColorError('Please enter a valid hex color (e.g., #FF0000 for red)');
      } else {
        setColorError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate hex color format before submission
    if (!isValidHexColor(formData.favoriteColor)) {
      setColorError('Please enter a valid hex color (e.g., #FF0000 for red)');
      return;
    }
    
    setFormStatus({ loading: true, success: false, error: null });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      setFormStatus({ loading: false, success: true, error: null });
      // Reset the form
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        favoriteColor: '#',
        nickname: '',
        birthday: ''
      });
      
      // After a short delay, switch to login
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
        
        {formStatus.success && (
          <Alert type="success" className="mb-4">
            Registration successful! Your account has been created.
          </Alert>
        )}
        
        {formStatus.error && (
          <Alert type="error" className="mb-4">
            {formStatus.error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Additional Questions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            
            <div>
              <label htmlFor="favoriteColor" className="block text-sm font-medium text-gray-700">
                What's your favorite color? (Hex format, e.g., #FF0000)
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="favoriteColor"
                  name="favoriteColor"
                  type="text"
                  required
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  value={formData.favoriteColor}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${colorError ? 'border-red-500' : ''}`}
                  placeholder="#RRGGBB"
                />
                {formData.favoriteColor.length > 1 && (
                  <div 
                    className="ml-2 w-8 h-8 border border-gray-300 rounded"
                    style={{ backgroundColor: isValidHexColor(formData.favoriteColor) ? formData.favoriteColor : 'transparent' }}
                  ></div>
                )}
              </div>
              {colorError && (
                <p className="mt-1 text-sm text-red-600">{colorError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Use the color selector in the header to find a color you like, then copy the HEXCODE here.
              </p>
            </div>
            
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                What's your nickname?
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={formData.nickname}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                What's your birthday?
              </label>
              <input
                id="birthday"
                name="birthday"
                type="date"
                required
                value={formData.birthday}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <SubmitButton loading={formStatus.loading}>
              Create Account
            </SubmitButton>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-900 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
}