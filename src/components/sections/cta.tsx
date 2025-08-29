import Link from 'next/link';

import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="bg-card flex flex-col items-center justify-center gap-6 rounded-lg border p-14 text-center shadow-sm">
          <h2 className="text-3xl font-semibold lg:text-4xl">
            Ready to Build 10x Faster with AI?
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Join developers who are mastering AI-accelerated development in Xano. 
            Get the MCP tools, weekly training calls, and expert guidance you need to succeed.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 shadow-xl transition-all duration-300"
              >
                Start Your Training
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
                Join Weekly Call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };
