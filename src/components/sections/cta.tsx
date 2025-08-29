import Link from 'next/link';

import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="bg-card flex flex-col items-center justify-center gap-6 rounded-lg border p-14 text-center shadow-sm">
          <h2 className="text-3xl font-semibold lg:text-4xl">
            One Client Project Pays for a Full Year
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Most members recoup their investment in Week 1 through time saved. 
            Stop struggling alone. Join the next cohort starting Monday.
          </p>
          <div className="mt-6 mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <span className="text-lg">⚡</span>
            <span>Next call: Thursday 2pm EST • 12 spots remaining</span>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Join Next Week's Training → $997/mo
              </Button>
            </Link>
            <Link
              href="https://calendly.com/robertboulos/30-min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 shadow-xl transition-all duration-300"
              >
                Watch Free Preview First
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };
