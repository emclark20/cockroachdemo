// lib/jwt.js
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Helper to get the secret key as a Uint8Array
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const encoder = new TextEncoder();
  return encoder.encode(secret);
};

// Create a JWT token
export async function createToken(payload) {
  const secretKey = getSecretKey();
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
    
  return token;
}

// Verify a JWT token
export async function verifyToken(token) {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Set token in cookie
export function setTokenCookie(token) {
  cookies().set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'lax',
  });
}

// Get token from cookie
export function getTokenFromCookies() {
  return cookies().get('auth_token')?.value;
}

// Delete token cookie (for logout)
export function deleteTokenCookie() {
  cookies().delete('auth_token');
}

// Get current user from token
export async function getCurrentUser() {
  const token = getTokenFromCookies();
  if (!token) return null;
  
  return await verifyToken(token);
}