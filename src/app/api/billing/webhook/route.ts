import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(request, '/api/billing/webhook');
  const body: Record<string, unknown> = {};

  try {
    // Get the raw body for Stripe signature verification
    const rawBody = await request.text();

    // Get Stripe signature from headers
    const stripeSignature = request.headers.get('stripe-signature');

    if (!stripeSignature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Forward the webhook to Xano for processing
    const response = await fetch(`${XANO_API_BASE}/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
      },
      body: rawBody,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Webhook processing failed',
      };
      await logger.logRequest({ webhook: true }, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    await logger.logRequest({ webhook: true }, data);
    return NextResponse.json({ received: true });
  } catch (error) {
    // Log error in production environment differently
    // eslint-disable-next-line no-console
    console.error('Webhook error:', error);
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest(body, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
