// components/registration-form.jsx
'use client';

import { useState } from 'react';
import { Card } from './card';
import { SubmitButton } from './submit-button';
import { Alert } from './alert';

export function RegistrationForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    favoriteColor: '',
    nickname: '',
    birthday: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        favoriteColor: '',
        nickname: '',
        birthday: ''
      });
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
                What's your favorite color?
              </label>
              <input
                id="favoriteColor"
                name="favoriteColor"
                type="text"
                required
                value={formData.favoriteColor}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
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