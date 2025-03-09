// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/header1';
import { Footer } from '../../components/footer';
import { Card } from '../../components/card';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          // If not authenticated, redirect to login
          if (response.status === 401) {
            console.log('Not authenticated, redirecting to login');
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        console.log('User data loaded:', data);
        setUser(data.user);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-red-600">Error Loading Dashboard</h2>
                <p className="mt-2">{error || 'User data not available'}</p>
                <button 
                  onClick={() => router.push('/')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Return to Login
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
          
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Information</h3>
                  <ul className="space-y-2">
                    <li><strong>Username:</strong> {user?.username}</li>
                    <li><strong>Name:</strong> {user?.firstName} {user?.lastName}</li>
                    <li><strong>Nickname:</strong> {user?.nickname}</li>
                    <li><strong>Favorite Color:</strong> {user?.favoriteColor}</li>
                    <li><strong>Birthday:</strong> {new Date(user?.birthday).toLocaleDateString()}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Overview</h3>
                  <p>This is your personal dashboard where you can view and manage your account information.</p>
                  <div className="mt-4">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded mr-2"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
    </div>
  );
}