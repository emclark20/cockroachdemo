// app/api/login/route.js
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { createToken, setTokenCookie } from '../../../lib/jwt';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Validate required fields
    if (!username || !password) {
      return Response.json({ message: 'Username and password are required' }, { status: 400 });
    }
    
    // Create a client connection to CockroachDB
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Only for development, use proper SSL in production
      }
    });
    
    await client.connect();
    
    try {
      // Check if user exists and get password hash
      const query = 'SELECT id, username, password_hash, first_name, last_name FROM users WHERE username = $1';
      const result = await client.query(query, [username]);
      
      if (result.rows.length === 0) {
        return Response.json({ message: 'Invalid username or password' }, { status: 401 });
      }
      
      const user = result.rows[0];
      
      // Compare password with stored hash
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return Response.json({ message: 'Invalid username or password' }, { status: 401 });
      }
      
      // Create payload for JWT
      const tokenPayload = {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      };
      
      console.log('Creating token with payload:', tokenPayload);
      
      // Generate JWT token using jose
      const token = await createToken(tokenPayload);
      
      console.log('Token created, setting cookie...');
      
      // Set the cookie
      setTokenCookie(token);
      
      console.log('Cookie set, returning response...');
      
      return Response.json({ 
        success: true, 
        message: 'Login successful',
        user: tokenPayload
      });
      
    } finally {
      // Always close the connection
      await client.end();
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ 
      message: 'An error occurred during login' 
    }, { status: 500 });
  }
}