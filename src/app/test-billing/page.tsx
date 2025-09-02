'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BILLING_CONFIG } from '@/config/billing';
import { useAuth } from '@/contexts/auth-context';

export default function TestBillingPage() {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSubscribe = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Ogyn777x/billing/subscribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.authToken}`,
          },
          body: JSON.stringify({
            price_id: BILLING_CONFIG.stripe.prices.pro_monthly,
            success_url: `${window.location.origin}/dashboard?subscription=success`,
            cancel_url: `${window.location.origin}/pricing?subscription=cancelled`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      setSubscriptionData(data);

      // Redirect to Stripe checkout if URL is provided
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testGetSubscription = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/subscription', {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription');
      }

      setSubscriptionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Test Billing Integration</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <p className="text-green-600">
                Logged in as: {user.email || user.name}
              </p>
            ) : (
              <p className="text-red-600">Not logged in</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-x-4">
              <Button onClick={testGetSubscription} disabled={loading}>
                Get Current Subscription
              </Button>
              <Button onClick={testSubscribe} disabled={loading}>
                Test Subscribe (Pro Plan)
              </Button>
            </div>

            {error && (
              <div className="rounded bg-red-50 p-4 text-red-600">{error}</div>
            )}

            {subscriptionData && (
              <div className="rounded bg-gray-50 p-4">
                <pre className="text-sm">
                  {JSON.stringify(subscriptionData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Pro Monthly Price ID:</strong>{' '}
              {BILLING_CONFIG.stripe.prices.pro_monthly}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Note: Replace this with your actual Stripe price ID in
              /src/config/billing.ts
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}