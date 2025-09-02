import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Ogyn777x';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/subscribe');
  let body: { price_id?: string; success_url?: string; cancel_url?: string } =
    {};

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
    const { price_id, success_url, cancel_url } = body;

    if (!price_id) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Call Xano billing/subscribe endpoint
    const response = await fetch(`${XANO_API_BASE}/billing/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        price_id,
        success_url:
          success_url || `${request.headers.get('origin')}/dashboard`,
        cancel_url: cancel_url || `${request.headers.get('origin')}/pricing`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to create subscription',
      };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest(body, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Subscribe error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest(body, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
