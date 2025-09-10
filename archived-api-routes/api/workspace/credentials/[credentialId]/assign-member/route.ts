import { NextRequest, NextResponse } from 'next/server';

import { loggedFetch } from '@/lib/api-debug-logger';
import { createRequestLogger } from '@/lib/api-logger';

// Xano Workspace Management API endpoint
const XANO_WORKSPACE_API_BASE =
  'https://xnwv-v1z6-dvnr.n7c.xano.io/api:4ir_LaU4';

// POST - Assign member to credential
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ credentialId: string }> }
) {
  const params = await context.params;
  const logger = createRequestLogger(
    request,
    `/api/workspace/credentials/${params.credentialId}/assign-member`
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
    if (!body.member_id) {
      return NextResponse.json(
        { error: 'member_id is required' },
        { status: 400 }
      );
    }

    const response = await loggedFetch(
      `${XANO_WORKSPACE_API_BASE}/credentials/${params.credentialId}/assign-member`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: parseInt(body.member_id),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to assign member to credential',
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
