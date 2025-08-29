import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

// Xano API endpoint
const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/mcp/save-config');

  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const authToken = authHeader.split(' ')[1];
    const body = await request.json();

    if (!body.api_key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Call Xano save_api_key endpoint
    const response = await fetch(`${XANO_API_BASE}/save_api_key`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: body.api_key,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.error || 'Failed to save API key',
        status: response.status,
      };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const successResponse = {
      success: data.success,
      message: data.message,
      validation_result: data.validation_result,
    };

    await logger.logRequest(body, successResponse);
    return NextResponse.json(successResponse);
  } catch (error) {
    const errorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
