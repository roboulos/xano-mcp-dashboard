'use client';

import { useState } from 'react';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: '$99',
    yearlyPrice: '$79',
    description: 'Perfect for solo developers and small teams',
    features: [
      '100+ MCP tools',
      'TypeScript SDK access',
      'Community Discord',
      'Monthly office hours',
      'Basic error handling',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$499',
    yearlyPrice: '$399',
    description: 'Most popular - includes weekly training calls',
    features: [
      'Everything in Starter',
      'Weekly MCP Wednesday calls',
      'Advanced middleware',
      'Custom SDK patterns',
      'Priority support',
      'Cookbook templates',
      'Direct Q&A with Robert',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: '$2k+',
    yearlyPrice: 'Custom',
    description: 'Healthcare-grade security and dedicated support',
    features: [
      'Everything in Pro',
      'Read-only credential setup',
      'Private onboarding',
      'Custom security review',
      'Dedicated Slack channel',
      'SLA guarantees',
      'White-glove migration',
    ],
  },
];

export const Pricing = ({ className }: { className?: string }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className={cn('py-28 lg:py-32', className)}>
      <div className="container max-w-5xl">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Less Than One Hour of Debugging
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug font-medium text-balance">
            Save hours of debugging time every week. Get live training, proven
            tools, and a framework that actually works.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`${
                plan.name === 'Pro'
                  ? 'outline-primary origin-top outline-4'
                  : ''
              }`}
            >
              <CardContent className="flex flex-col gap-7 px-6 py-5">
                <div className="space-y-2">
                  <h3 className="text-primary font-semibold">{plan.name}</h3>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-lg font-medium">
                      {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}{' '}
                      {plan.name !== 'Enterprise' &&
                        !plan.monthlyPrice.includes('Custom') &&
                        !plan.monthlyPrice.includes('+') && (
                          <span className="text-muted-foreground">
                            per month
                            {isAnnual ? ' (billed annually)' : ''}
                          </span>
                        )}
                      {(plan.monthlyPrice === 'Custom' ||
                        plan.monthlyPrice.includes('+')) && (
                        <span className="text-muted-foreground">pricing</span>
                      )}
                    </div>
                  </div>
                </div>

                {plan.name !== 'Enterprise' &&
                !plan.monthlyPrice.includes('+') ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={() => setIsAnnual(!isAnnual)}
                    />
                    <span className="text-sm font-medium">
                      Annual billing (save 17%)
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {plan.description}
                  </span>
                )}

                <div className="space-y-3">
                  {plan.features.map(feature => (
                    <div
                      key={feature}
                      className="text-muted-foreground flex items-center gap-1.5"
                    >
                      <Check className="size-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-fit"
                  variant={plan.name === 'Pro' ? 'default' : 'outline'}
                >
                  {plan.name === 'Starter'
                    ? 'Start Building'
                    : plan.name === 'Enterprise'
                      ? 'Contact Sales'
                      : 'Get Pro Access'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
