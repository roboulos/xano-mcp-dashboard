import { Suspense } from 'react';

import { PaymentStatus } from '@/components/payment/payment-status';

function PaymentStatusWrapper() {
  return <PaymentStatus />;
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30 py-16 dark:from-slate-950 dark:via-green-950/10 dark:to-emerald-950/20">
      <div className="container max-w-6xl">
        <div className="flex justify-center">
          <Suspense
            fallback={
              <div className="w-full max-w-2xl animate-pulse">
                <div className="bg-muted h-96 rounded-lg"></div>
              </div>
            }
          >
            <PaymentStatusWrapper />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
