import { NextRequest, NextResponse } from 'next/server';

import { loggedFetch } from '@/lib/api-debug-logger';
import { createRequestLogger } from '@/lib/api-logger';

// Xano Workspace Management API endpoint
const XANO_WORKSPACE_API_BASE =
  'https://xnwv-v1z6-dvnr.n7c.xano.io/api:4ir_LaU4';

// GET - Get workspace members
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const params = await context.params;
  const logger = createRequestLogger(
    request,
    `/api/workspace/${params.workspaceId}/members`
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

    const response = await loggedFetch(
      `${XANO_WORKSPACE_API_BASE}/workspaces/${params.workspaceId}/members`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to fetch workspace members',
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
