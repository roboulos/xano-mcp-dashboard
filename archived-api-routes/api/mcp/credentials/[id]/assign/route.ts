import { NextRequest, NextResponse } from 'next/server';

import { loggedFetch } from '@/lib/api-debug-logger';
import { createRequestLogger } from '@/lib/api-logger';

// Xano API endpoint
const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r';

// PUT - Assign credential to user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const logger = createRequestLogger(
    request,
    `/api/mcp/credentials/${params.id}/assign`
  );

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
    if (!body.assigned_to) {
      return NextResponse.json(
        { error: 'assigned_to is required' },
        { status: 400 }
      );
    }

    // For now, just update the credential's metadata
    // In a real implementation, we would create/update the credential_assignments table
    const response = await loggedFetch(
      `${XANO_API_BASE}/xano-credentials/update`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(params.id),
          // We're storing assignment info as part of credential name for now
          // In a real implementation, this would be a proper relationship
          credential_name: body.credential_name,
          xano_instance_name: body.assigned_to_name || body.assigned_to,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to update assignment',
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
