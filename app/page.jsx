// app/page.jsx
'use client';

import { useState } from 'react';
import { RegistrationForm } from '../components/registration-form';
import { LoginForm } from '../components/login-form';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  
  const handleSwitchToSignUp = () => {
    setShowLogin(false);
  };
  
  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            {showLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          
          {showLogin ? (
            <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
          ) : (
            <RegistrationForm onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}