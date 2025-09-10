import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_';

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(
    request,
    '/api/dashboard/mcp-metrics/daily'
  );

  try {
    // Get auth token from header
    const authToken = request.headers
      .get('authorization')
      ?.replace('Bearer ', '');

    if (!authToken) {
      await logger.logRequest(
        null,
        { error: 'No authorization token' },
        'No authorization token'
      );
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call daily metrics endpoint
    const response = await fetch(`${XANO_API_BASE}/daily-metrics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      await logger.logRequest(
        null,
        { error: data },
        `Failed to fetch daily metrics: ${response.status}`
      );
      return NextResponse.json(
        { error: 'Failed to fetch daily metrics' },
        { status: response.status }
      );
    }

    await logger.logRequest(null, data);
    return NextResponse.json(data);
  } catch (error) {
    await logger.logRequest(
      null,
      { error: 'Internal server error' },
      String(error)
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
