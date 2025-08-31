import { SubscriptionManager } from '@/components/payment/subscription-manager';

export default function BillingPage() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, view billing history, and update payment
          methods
        </p>
      </div>

      <SubscriptionManager />
    </div>
  );
}
