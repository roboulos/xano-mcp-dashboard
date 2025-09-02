import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/cancel');

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cancel subscription via Xano
    const response = await fetch(
      `${XANO_API_BASE}/billing/cancel-subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to cancel subscription',
      };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({}, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Cancel subscription error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
