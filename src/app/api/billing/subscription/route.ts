import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/subscription');

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription status from Xano
    const response = await fetch(`${XANO_API_BASE}/billing/subscription`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to fetch subscription',
      };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({}, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Subscription error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/subscription');
  let body: { plan_id?: string; price_id?: string } = {};

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
    const { plan_id, price_id } = body;

    if (!plan_id || !price_id) {
      return NextResponse.json(
        { error: 'Plan ID and Price ID are required' },
        { status: 400 }
      );
    }

    // Update subscription via Xano
    const response = await fetch(
      `${XANO_API_BASE}/billing/update-subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          plan_id,
          price_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to update subscription',
      };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest(body, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Update subscription error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest(body, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
