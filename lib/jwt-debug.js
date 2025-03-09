// lib/jwt-debug.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// This should match exactly what's in your .env.local
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Debug function to print token details
export function debugToken(token) {
  console.log('JWT_SECRET (first 5 chars):', JWT_SECRET.substring(0, 5) + '...');
  
  try {
    // Try to decode without verification first
    const decoded = jwt.decode(token, { complete: true });
    console.log('Token header:', decoded?.header);
    console.log('Token payload:', decoded?.payload);
    console.log('Token issued at:', new Date(decoded?.payload?.iat * 1000).toISOString());
    console.log('Token expires at:', new Date(decoded?.payload?.exp * 1000).toISOString());
    
    // Now try verification
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      console.log('Token verification: SUCCESS');
      return true;
    } catch (verifyError) {
      console.log('Token verification: FAILED', verifyError.message);
      return false;
    }
  } catch (error) {
    console.log('Token parsing error:', error.message);
    return false;
  }
}

// Create a JWT token - use this exact same approach everywhere
export function createToken(payload) {
  console.log('Creating token with secret (first 5 chars):', JWT_SECRET.substring(0, 5) + '...');
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '1d',
    algorithm: 'HS256' // Explicitly set algorithm
  });
}

// Verify a JWT token - use this exact same approach everywhere
export function verifyToken(token) {
  try {
    console.log('Verifying token with secret (first 5 chars):', JWT_SECRET.substring(0, 5) + '...');
    const verified = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    console.log('Verification result:', !!verified);
    return verified;
  } catch (error) {
    console.log('Verification error:', error.message);
    return null;
  }
}