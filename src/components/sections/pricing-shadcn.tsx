'use client';

import { useState } from 'react';

import { CheckCircle2, HelpCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PricingShadcn = () => {
  const [isYearly, setIsYearly] = useState(false);

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out our dashboard',
      features: [
        {
          name: 'Dashboard Access',
          included: true,
          tooltip: 'Read-only access to dashboard',
        },
        { name: '1 MCP Configuration', included: true },
        { name: 'Documentation', included: true },
        { name: 'Community Support', included: true },
        { name: 'Weekly Strategy Calls', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Team Management', included: false },
        { name: 'Custom Onboarding', included: false },
      ],
      cta: 'Get Started',
      variant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: isYearly ? '$1,990' : '$199',
      period: isYearly ? '/year' : '/month',
      description: 'For professionals ready to scale',
      features: [
        {
          name: 'Dashboard Access',
          included: true,
          tooltip: 'Full read/write access',
        },
        { name: 'Unlimited MCP Configurations', included: true },
        { name: 'Documentation', included: true },
        { name: 'Community Support', included: true },
        {
          name: 'Weekly Strategy Calls',
          included: true,
          tooltip: '30-min weekly calls with our team',
        },
        {
          name: 'Priority Support',
          included: true,
          tooltip: '24-hour response time',
        },
        { name: 'Team Management', included: false },
        { name: 'Custom Onboarding', included: false },
      ],
      cta: 'Start Free Trial',
      variant: 'default' as const,
      popular: true,
    },
    {
      name: 'Team',
      price: 'Custom',
      description: 'For teams with advanced needs',
      features: [
        {
          name: 'Dashboard Access',
          included: true,
          tooltip: 'Full access for entire team',
        },
        { name: 'Unlimited MCP Configurations', included: true },
        { name: 'Documentation', included: true },
        { name: 'Community Support', included: true },
        { name: 'Weekly Strategy Calls', included: true },
        {
          name: 'Priority Support',
          included: true,
          tooltip: '1-hour response time',
        },
        {
          name: 'Team Management',
          included: true,
          tooltip: 'Add unlimited team members',
        },
        {
          name: 'Custom Onboarding',
          included: true,
          tooltip: 'Dedicated onboarding specialist',
        },
      ],
      cta: 'Contact Sales',
      variant: 'outline' as const,
    },
  ];

  return (
    <section className="py-20 pt-32 lg:pt-40">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
            Choose the perfect plan for your needs. Start free and upgrade as
            you grow.
          </p>

          <div className="mb-12 flex items-center gap-3">
            <span
              className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={isYearly ? 'font-semibold' : 'text-muted-foreground'}
            >
              Yearly
              {isYearly && (
                <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-1 text-xs font-semibold">
                  Save 17%
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          <TooltipProvider>
            {tiers.map(tier => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.popular
                    ? 'border-primary scale-105 shadow-lg lg:scale-110'
                    : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pt-6 pb-8 text-center">
                  <CardTitle className="text-2xl font-bold">
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {tier.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-8">
                  <ul className="space-y-4">
                    {tier.features.map(feature => (
                      <li
                        key={feature.name}
                        className="flex items-center gap-3"
                      >
                        {feature.included ? (
                          <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                        ) : (
                          <X className="text-muted-foreground/50 h-5 w-5 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? ''
                              : 'text-muted-foreground line-through'
                          }
                        >
                          {feature.name}
                        </span>
                        {feature.tooltip && feature.included && (
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="text-muted-foreground h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" variant={tier.variant} size="lg">
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TooltipProvider>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            All plans include a 14-day money-back guarantee. No credit card
            required for Free tier.
          </p>
        </div>
      </div>
    </section>
  );
};

export { PricingShadcn };
