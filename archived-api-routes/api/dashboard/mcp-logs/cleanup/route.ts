import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(
    request,
    '/api/dashboard/mcp-logs/cleanup'
  );

  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Parse request body
    const body = await request.json();
    const { days_to_keep = 30, dry_run = false } = body;

    // Call Xano endpoint
    const response = await fetch(`${XANO_API_BASE}/mcp-logs/cleanup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        days_to_keep,
        dry_run,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = { error: data.message || 'Failed to cleanup logs' };
      await logger.logRequest({ days_to_keep, dry_run }, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    if (data.error) {
      const errorResponse = { error: data.error };
      await logger.logRequest({ days_to_keep, dry_run }, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    await logger.logRequest({ days_to_keep, dry_run }, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error through the request logger
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
