import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

const CTAShadcn = () => {
  const benefits = [
    '14-day free trial',
    'No credit card required',
    'Full access to Pro features',
    'Cancel anytime',
  ];

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="relative container">
        <div className="mx-auto max-w-4xl">
          <div className="bg-card rounded-2xl border p-8 shadow-lg lg:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
                  Ready to transform your AI workflow?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join hundreds of developers who are building smarter
                  applications with Xano MCP Dashboard.
                </p>
                <ul className="mb-8 space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="text-primary h-5 w-5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <Button size="lg" className="mb-4">
                  Start Your Free Trial
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                  No credit card required • Setup in 5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="bg-primary/5 absolute top-0 -left-4 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-0 -bottom-4 h-72 w-72 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export { CTAShadcn };
