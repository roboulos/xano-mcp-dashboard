import { NextRequest, NextResponse } from 'next/server';

import { loggedFetch } from '@/lib/api-debug-logger';
import { createRequestLogger } from '@/lib/api-logger';

// Xano API endpoint
const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r';

// PUT - Set credential as default
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logger = createRequestLogger(
    request,
    `/api/mcp/credentials/${id}/set-default`
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

    // Call Xano set-default endpoint
    const response = await loggedFetch(
      `${XANO_API_BASE}/xano-credentials/set-default`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(id, 10),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to set credential as default',
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
