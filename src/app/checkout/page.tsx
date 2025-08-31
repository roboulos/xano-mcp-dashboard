import { CheckoutForm } from '@/components/payment/checkout-form';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 py-16 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/20">
      <div className="container max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="hero-headline mb-4 text-4xl font-bold">
            Complete Your Purchase
          </h1>
          <p className="hero-subtitle text-muted-foreground text-xl">
            Join developers shipping 10x faster with AI that actually works
          </p>
        </div>

        <div className="flex justify-center">
          <CheckoutForm />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-8 text-sm">
            <div className="trust-indicator flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="trust-indicator flex items-center gap-2">
              <span className="text-lg">💳</span>
              <span>Powered by Stripe</span>
            </div>
            <div className="trust-indicator flex items-center gap-2">
              <span className="text-lg">↩️</span>
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
