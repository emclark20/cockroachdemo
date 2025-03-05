// app/api/register/route.js
import { Client } from 'pg';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { firstName, lastName, username, password, favoriteColor, nickname, birthday } = await request.json();
    
    // Validate required fields
    if (!firstName || !lastName || !username || !password || !favoriteColor || !nickname || !birthday) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
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
      // Check if username already exists
      const checkUser = await client.query('SELECT username FROM users WHERE username = $1', [username]);
      
      if (checkUser.rows.length > 0) {
        return Response.json({ message: 'Username already exists' }, { status: 409 });
      }
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert the new user (including explicit timestamp values)
      const query = `
        INSERT INTO users (username, password_hash, first_name, last_name, favorite_color, nickname, birthday, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp(), current_timestamp())
        RETURNING id
      `;
      
      const values = [
        username,
        hashedPassword,
        firstName,
        lastName,
        favoriteColor,
        nickname,
        birthday
      ];
      
      const result = await client.query(query, values);
      
      return Response.json({ 
        success: true, 
        message: 'User registered successfully',
        userId: result.rows[0].id
      }, { status: 201 });
    } finally {
      // Always close the connection
      await client.end();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ 
      message: 'An error occurred during registration' 
    }, { status: 500 });
  }
}