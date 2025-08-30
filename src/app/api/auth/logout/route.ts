import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the auth cookie
  const response = NextResponse.json({ message: 'Logout successful' });

  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0), // Expire immediately
    path: '/',
  });

  return response;
}
