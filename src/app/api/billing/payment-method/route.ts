import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Ogyn777x';

export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/payment-method');

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payment methods from Xano
    const response = await fetch(`${XANO_API_BASE}/billing/payment-methods`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to fetch payment methods',
      };
      await logger.logRequest({}, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({}, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Payment methods error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/payment-method');
  let body: { payment_method_id?: string } = {};

  try {
    const authToken = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
    const { payment_method_id } = body;

    if (!payment_method_id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Add payment method via Xano
    const response = await fetch(
      `${XANO_API_BASE}/billing/add-payment-method`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          payment_method_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to add payment method',
      };
      await logger.logRequest(body, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest(body, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Add payment method error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest(body, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
