'use client';

import { useState } from 'react';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Xano AI Developer Free',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    description: 'Perfect for exploring AI development in Xano',
    features: [
      '50 AI builds per month',
      'Basic Xano workspace connection',
      'Community support',
      'Access to example templates',
      'Standard API generation',
    ],
  },
  {
    name: 'Xano AI Developer Pro',
    monthlyPrice: '$299',
    yearlyPrice: '$249',
    features: [
      'Unlimited AI builds',
      'Complex workflow automation',
      '5 expert hours per month',
      'Custom function libraries',
      'Background task automation',
      'Priority support',
      'Team collaboration tools',
    ],
  },
  {
    name: 'Xano AI Developer Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    features: [
      'Everything in Pro plus...',
      'Dedicated Xano AI specialist',
      'Private AI deployment',
      'Custom AI training',
      'Advanced security & compliance',
      'White-label options',
      '24/7 enterprise support',
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
            Investment That Pays For Itself
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug font-medium text-balance">
            Save thousands in training costs and preserve decades of Universe
            expertise. Start free, scale with your needs, protect your
            institutional knowledge.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`${
                plan.name === 'Universe Expert Pro'
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
                      {plan.name !== 'Universe Expert Access' &&
                        plan.monthlyPrice !== 'Custom' && (
                          <span className="text-muted-foreground">
                            per month
                            {isAnnual ? ' (billed annually)' : ''}
                          </span>
                        )}
                      {plan.monthlyPrice === 'Custom' && (
                        <span className="text-muted-foreground">pricing</span>
                      )}
                    </div>
                  </div>
                </div>

                {plan.name !== 'Universe Expert Access' &&
                plan.monthlyPrice !== 'Custom' ? (
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
                  variant={
                    plan.name === 'Universe Expert Pro' ? 'default' : 'outline'
                  }
                >
                  {plan.name === 'Universe Expert Access'
                    ? 'Start Free'
                    : plan.name === 'Universe Expert Enterprise'
                      ? 'Contact Sales'
                      : 'Start Pro Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
