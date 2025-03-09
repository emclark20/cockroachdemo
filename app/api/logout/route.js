// app/api/logout/route.js
import { deleteTokenCookie } from '../../../lib/jwt';

export async function POST() {
  deleteTokenCookie();
  
  return Response.json({
    success: true,
    message: 'Logged out successfully'
  });
}