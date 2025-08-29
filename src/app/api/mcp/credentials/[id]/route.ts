import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

// Xano API endpoint
const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r';

// DELETE - Delete credential
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logger = createRequestLogger(request, `/api/mcp/credentials/${id}`);

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const authToken = authHeader.split(' ')[1];

    // Call Xano delete endpoint
    const response = await fetch(`${XANO_API_BASE}/xano-credentials/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: parseInt(id, 10),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to delete credential',
        status: response.status,
      };
      await logger.logRequest({ id }, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({ id }, data);
    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    await logger.logRequest({ id }, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PATCH - Update credential
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logger = createRequestLogger(request, `/api/mcp/credentials/${id}`);

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

    // Call Xano update endpoint
    const response = await fetch(`${XANO_API_BASE}/xano-credentials/update`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: parseInt(id, 10),
        credential_name: body.credential_name,
        xano_instance_name: body.xano_instance_name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to update credential',
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
