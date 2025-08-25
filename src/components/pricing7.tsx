'use client';

import { useState } from 'react';

import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Pricing7 = () => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">Pricing</h2>
          <p className="text-muted-foreground lg:text-lg">
            Choose the plan that fits your development workflow. Start with our
            free tier or unlock advanced features with secure, scalable database
            access.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground">Billing cycle</span>
          <div className="bg-muted flex h-12 items-center rounded-md p-1 text-lg">
            <RadioGroup
              defaultValue="monthly"
              className="h-full grid-cols-2"
              onValueChange={value => {
                setIsAnnually(value === 'annually');
              }}
            >
              <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="monthly"
                  className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center px-7 font-semibold"
                >
                  Monthly
                </Label>
              </div>
              <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                <RadioGroupItem
                  value="annually"
                  id="annually"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="annually"
                  className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold"
                >
                  Yearly
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-100 px-1.5 text-green-600"
                  >
                    -20%
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Starter</h3>
                  <span className="text-5xl font-semibold">Free</span>
                  <span className="mb-4 block font-semibold">forever</span>
                  <p className="text-muted-foreground">
                    Perfect for individual developers and small projects getting
                    started with AI-powered database access.
                  </p>
                  <p className="mt-6 mb-3 font-semibold">Includes</p>
                  <ul className="flex flex-col gap-3">
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />1 database
                      connection
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      100 queries per month
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Basic security features
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Community support
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Standard query logging
                    </li>
                  </ul>
                </div>
                <Button className="bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300">
                  Get Started - It's Free
                </Button>
              </div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Professional</h3>
                  <span className="text-5xl font-semibold">
                    {isAnnually ? '$19' : '$24'}
                  </span>
                  <span className="mb-4 block font-semibold">per month</span>
                  <p className="text-muted-foreground">
                    Built for teams and growing businesses that need advanced
                    security, performance, and collaboration features.
                  </p>
                  <p className="mt-6 mb-3 font-semibold">
                    Everything in Starter, plus
                  </p>
                  <ul className="flex flex-col gap-3">
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Unlimited database connections
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Unlimited queries
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Advanced permissions dashboard
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Priority support & SLA
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0" />
                      Advanced audit logging
                    </li>
                  </ul>
                </div>
                <Button className="bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300">
                  Get Started - It's Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing7 };
