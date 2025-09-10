import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_';

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/dashboard/activity-feed');

  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';

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

    // Call Xano activity-feed endpoint
    const response = await fetch(
      `${XANO_API_BASE}/activity-feed?limit=${encodeURIComponent(limit)}`,
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
      await logger.logRequest(
        null,
        { error: data },
        `Failed to fetch activity feed: ${response.status}`
      );
      return NextResponse.json(
        { error: 'Failed to fetch activity feed' },
        { status: response.status }
      );
    }

    // Ensure we always return the expected structure
    const responseData = {
      events: Array.isArray(data.events) ? data.events : [],
      pagination: data.pagination || { has_more: false, total: 0, returned: 0 },
    };

    await logger.logRequest(null, responseData);
    return NextResponse.json(responseData);
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
