'use client';

import React, { useState, useEffect } from 'react';

import { CreditCard, AlertCircle, CheckCircle, Package } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // Fetch subscription status
      const subResponse = await fetch('/api/stripe/subscription-status');
      const subData = await subResponse.json();
      setSubscription(subData);

      // Fetch billing history
      const historyResponse = await fetch('/api/stripe/billing-history');
      const historyData = await historyResponse.json();
      setBillingHistory(historyData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSubscriptionData();
        setShowCancelDialog(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error canceling subscription:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-4 text-center">
            <Package className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="text-lg font-semibold">No Active Subscription</h3>
            <p className="text-muted-foreground">
              Choose a plan to start building with Xano AI Developer
            </p>
            <Button onClick={handleUpgrade}>View Plans</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === 'active';
  const willCancel = subscription.cancelAtPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </div>
            <Badge
              variant={isActive ? 'default' : 'destructive'}
              className="text-sm"
            >
              {subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{subscription.planName}</h3>
              <p className="text-muted-foreground">
                ${subscription.amount / 100}/{subscription.interval}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Next billing date</p>
              <p className="font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          </div>

          {willCancel && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be canceled at the end of the current
                billing period. You'll retain access until{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-4">
            {subscription.planName.includes('Starter') && (
              <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
            )}

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={willCancel}>
                  {willCancel ? 'Subscription Ending' : 'Cancel Subscription'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Subscription?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel your subscription? You'll
                    lose access to:
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-destructive">✗</span>
                    Weekly MCP Wednesday calls with Robert
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-destructive">✗</span>
                    Priority support and custom SDK patterns
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-destructive">✗</span>
                    Advanced middleware and error handling
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? 'Canceling...' : 'Yes, Cancel'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    ${item.amount / 100} {item.currency.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'paid'
                          ? 'default'
                          : item.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {item.status === 'paid' && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.invoiceUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={item.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-muted-foreground text-sm">Expires 12/2024</p>
              </div>
            </div>
            <Button variant="outline">Update Card</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
