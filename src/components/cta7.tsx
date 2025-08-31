import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Cta7 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="border-border bg-accent relative rounded-xl border px-6 py-8 2xl:grid 2xl:grid-cols-2 2xl:px-14 2xl:py-10">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <svg
              fill="none"
              width={404}
              height={384}
              viewBox="0 0 404 384"
              aria-hidden="true"
              className="absolute top-full left-full -translate-x-2/3 -translate-y-1/2 rotate-[60deg]"
            >
              <defs>
                <pattern
                  x={0}
                  y={0}
                  id="dots"
                  width={16}
                  height={16}
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx={2}
                    cy={2}
                    r={2}
                    fill="currentColor"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect fill="url(#dots)" width={400} height={400} />
            </svg>
          </div>
          <div className="relative mb-12 2xl:mb-0">
            <h3 className="mb-6 text-2xl font-semibold md:mb-8 md:text-4xl lg:mb-12">
              Call to Action
            </h3>
            <p className="text-muted-foreground mb-6 text-xs tracking-widest uppercase">
              Experience the Difference
            </p>
            <ul className="text-muted-foreground grid gap-x-8 gap-y-4 md:grid-cols-2">
              <li className="flex items-center gap-2">
                <Check className="text-foreground size-5" />
                Easy Integration
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-foreground size-5" />
                24/7 Support
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-foreground size-5" />
                Customizable Design
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-foreground size-5" />
                Regular Updates
              </li>
            </ul>
          </div>
          <div className="relative flex items-end 2xl:justify-end">
            <Button size="lg">Get Started</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta7 };
