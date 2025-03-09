// app/api/user/route.js
import { Client } from 'pg';
import { getCurrentUser } from '../../../lib/jwt';

export async function GET() {
  try {
    // Get and verify the current user from token
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    // Create a client connection to CockroachDB
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    
    try {
      // Get user's complete profile
      const query = `
        SELECT id, username, first_name, last_name, favorite_color, nickname, birthday
        FROM users
        WHERE id = $1
      `;
      
      const result = await client.query(query, [currentUser.id]);
      
      if (result.rows.length === 0) {
        return Response.json({ message: 'User not found' }, { status: 404 });
      }
      
      const user = result.rows[0];
      
      // Format the data for the frontend
      return Response.json({
        user: {
          id: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          favoriteColor: user.favorite_color,
          nickname: user.nickname,
          birthday: user.birthday
        }
      });
      
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return Response.json({ message: 'An error occurred' }, { status: 500 });
  }
}