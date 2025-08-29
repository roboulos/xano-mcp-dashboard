import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/auth/me');

  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Call Xano me endpoint
    const response = await fetch(`${XANO_API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = { error: data.message || 'Invalid token' };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    // Check if Xano returned an error in the response body (even with 200 status)
    if (data.error) {
      const errorResponse = { error: data.error };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Return user data
    const responseData = {
      user: data,
    };

    await logger.logRequest({}, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Me endpoint error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}