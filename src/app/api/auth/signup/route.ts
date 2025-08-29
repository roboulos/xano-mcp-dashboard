import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/auth/signup');
  let body: { name?: string; email?: string; password?: string } = {};

  try {
    body = await request.json();

    // Validate required fields
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Call Xano signup endpoint
    const response = await fetch(`${XANO_API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = { error: data.message || 'Signup failed' };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    // Check if Xano returned an error in the response body (even with 200 status)
    if (data.error) {
      const errorResponse = { error: data.error };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Return the auth token
    const responseData = {
      authToken: data.authToken,
      message: 'Signup successful',
    };

    await logger.logRequest(body, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Signup error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest(body, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}