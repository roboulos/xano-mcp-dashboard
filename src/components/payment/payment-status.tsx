'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  planName: string;
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
}

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/stripe/payment-status?session_id=${sessionId}`
        );
        const data = await response.json();

        if (response.ok) {
          setPaymentDetails(data);
        } else {
          setError(data.error || 'Failed to fetch payment status');
        }
      } catch {
        setError('An error occurred while checking payment status');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchPaymentStatus();
    } else {
      setLoading(false);
      setError('No payment session found');
    }
  }, [sessionId]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <XCircle className="h-6 w-6" />
            Payment Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button onClick={() => (window.location.href = '/pricing')}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentDetails) {
    return null;
  }

  const isSuccess = paymentDetails.status === 'success';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSuccess ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-600" />
              Payment Successful!
            </>
          ) : (
            <>
              <XCircle className="text-destructive h-6 w-6" />
              Payment Failed
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isSuccess
            ? 'Your subscription is now active'
            : "We couldn't process your payment"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSuccess ? (
          <>
            {/* Success State */}
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Welcome to Xano AI Developer!</AlertTitle>
              <AlertDescription>
                You now have access to all {paymentDetails.planName} features.
                Check your email for login details and next steps.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span>{paymentDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>
                    ${paymentDetails.amount / 100}{' '}
                    {paymentDetails.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{paymentDetails.customerEmail}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Next Steps</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground flex items-start gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  Check your email for login credentials
                </p>
                <p className="text-muted-foreground flex items-start gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  Join our Discord community for support
                </p>
                <p className="text-muted-foreground flex items-start gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  Attend MCP Wednesday calls (next one this Wednesday at 2pm
                  EST)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/quickstart">View Quick Start Guide</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Error State */}
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Payment could not be processed</AlertTitle>
              <AlertDescription>
                {paymentDetails.errorMessage ||
                  'Please try again or contact support if the issue persists.'}
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                onClick={() => (window.location.href = '/pricing')}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
