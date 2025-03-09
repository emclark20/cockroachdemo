// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/settings'];

// Verify JWT token in Edge Runtime
async function verifyAuth(token) {
  if (!token) return null;
  
  try {
    // Get the JWT secret
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);
    
    // Verify the token
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification in middleware failed:', error.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Don't run middleware for API routes and assets
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }
  
  console.log('Middleware running for path:', pathname);
  
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  console.log('Auth token present:', !!token);
  
  // Verify the token
  const payload = await verifyAuth(token);
  const isAuthenticated = !!payload;
  console.log('User authenticated:', isAuthenticated);
  
  // Check if user is trying to access a protected path without authentication
  if (protectedPaths.some(path => pathname.startsWith(path)) && !isAuthenticated) {
    console.log('Redirecting unauthenticated user to homepage');
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If authenticated user tries to access login page, redirect to dashboard
  if (pathname === '/' && isAuthenticated) {
    console.log('Redirecting authenticated user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};