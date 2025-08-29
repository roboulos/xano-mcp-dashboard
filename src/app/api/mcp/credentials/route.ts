import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

// Xano API endpoint
const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r';

// GET - List all credentials
export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/mcp/credentials');

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const authToken = authHeader.split(' ')[1];

    // Call Xano list endpoint
    const response = await fetch(`${XANO_API_BASE}/xano-credentials/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to fetch credentials',
        status: response.status,
      };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({}, data);
    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST - Create new credential
export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/mcp/credentials');

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const authToken = authHeader.split(' ')[1];
    const body = await request.json();

    // Validate required fields
    if (
      !body.credential_name ||
      !body.xano_api_key ||
      !body.xano_instance_name
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Xano create endpoint
    const response = await fetch(`${XANO_API_BASE}/xano-credentials/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential_name: body.credential_name,
        xano_api_key: body.xano_api_key,
        xano_instance_name: body.xano_instance_name,
        xano_instance_email: body.xano_instance_email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to create credential',
        status: response.status,
      };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest(body, data);
    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
