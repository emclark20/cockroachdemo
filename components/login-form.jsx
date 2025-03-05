// components/login-form.jsx
'use client';

import { useState } from 'react';
import { Card } from './card';
import { SubmitButton } from './submit-button';
import { Alert } from './alert';

export function LoginForm({ onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const result = await response.json();
      setFormStatus({ loading: false, success: true, error: null });
      
      // You could redirect the user or update app state here
      // For example: router.push('/dashboard');
      
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        
        {formStatus.success && (
          <Alert type="success" className="mb-4">
            Login successful! Welcome back.
          </Alert>
        )}
        
        {formStatus.error && (
          <Alert type="error" className="mb-4">
            {formStatus.error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="pt-4">
            <SubmitButton loading={formStatus.loading}>
              Sign In
            </SubmitButton>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-indigo-600 hover:text-indigo-900 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
}