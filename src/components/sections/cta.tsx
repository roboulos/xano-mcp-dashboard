import Link from 'next/link';

import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="bg-card flex flex-col items-center justify-center gap-6 rounded-lg border p-14 text-center shadow-sm">
          <h2 className="text-3xl font-semibold lg:text-4xl">
            Ready to Get Your AI Xano Developer?
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Transform how you build in Xano. Natural language to working APIs in
            minutes. Your workspace, your AI assistant, instant results.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 shadow-xl transition-all duration-300"
              >
                Connect Your Xano
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
                Book AI Developer Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };
