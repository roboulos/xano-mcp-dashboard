import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { DashedLine } from '../dashed-line';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const items = [
  {
    quote:
      'I was in Greece last week by the pool... got everything working on my phone. I actually now prefer the AI version to one of my developers.',
    author: 'Luke',
    role: 'Platform Builder',
    company: 'UK',
    image: '/testimonials/amy-chase.webp',
    context: 'Remote development success',
  },
  {
    quote:
      'It created this function which probably would have taken me about four hours in two minutes.',
    author: 'Shane',
    role: 'Developer',
    company: 'UK',
    image: '/testimonials/jonas-kotara.webp',
    context: '120x speed improvement',
  },
  {
    quote:
      "This seemed too good to be true... I booked a call before entering my API key. We're at the front of something big here.",
    author: 'Nick',
    role: 'Automation Developer',
    company: 'Australia',
    image: '/testimonials/kevin-yam.webp',
    context: 'From skeptic to believer',
  },
  {
    quote:
      "We started with read-only credentials for our healthcare client. Now it's part of our production workflow.",
    author: 'West',
    role: 'Healthcare Tech Lead',
    company: 'Enterprise',
    image: '/testimonials/kundo-marta.webp',
    context: 'Enterprise-grade security',
  },
  {
    quote:
      "80-90% of the time, I click Run and it just works. This wasn't possible before the SDK and middleware.",
    author: 'Robert Boulos',
    role: 'Creator',
    company: 'Snappy MCP',
    image: '/testimonials/amy-chase.webp',
    context: 'Built from experience',
    featured: true,
  },
];

export const Testimonials = ({
  className,
  dashedLineClassName,
}: {
  className?: string;
  dashedLineClassName?: string;
}) => {
  return (
    <>
      <section className={cn('py-28 lg:py-32', className)}>
        <div className="container">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Real Developers, Real Results
            </h2>
            <p className="text-muted-foreground max-w-md leading-snug font-medium">
              From our weekly MCP Wednesday calls and active community.
            </p>
            <Button variant="outline" className="shadow-md">
              Join MCP Wednesday <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="">
                {items.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="relative h-[288px] lg:h-[328px]">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-10 p-6">
                          <blockquote className="text-primary font-sans text-lg leading-none! font-medium md:text-xl lg:text-2xl">
                            {testimonial.quote}
                          </blockquote>
                          <div className="space-y-2">
                            <div className="space-y-0.5">
                              <div className="font-semibold">
                                {testimonial.author}, {testimonial.role}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {testimonial.company}
                              </div>
                            </div>
                            {testimonial.context && (
                              <div className="text-muted-foreground text-xs italic">
                                {testimonial.context}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn('mx-auto max-w-[80%]', dashedLineClassName)}
      />
    </>
  );
};
