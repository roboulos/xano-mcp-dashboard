import { Banknote, Repeat, ShoppingBag, ShoppingCart } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

const Hero125 = () => {
  return (
    <section className="relative overflow-hidden py-20 font-sans after:absolute after:bottom-0 after:left-0 after:block after:h-20 after:w-full after:bg-[linear-gradient(var(--color-transparent),var(--color-white))] after:content-[''] md:py-40">
      <div className="relative container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/circles.svg"
          alt=""
          className="absolute top-[-68.75rem] right-[-86.25rem] z-[-1] block aspect-square h-auto w-[181.25rem] max-w-none"
        />
        <div className="grid grid-cols-1 items-center justify-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="fill-primary stroke-primary h-6 w-6" />
              <p className="text-lg font-semibold">Returns</p>
            </div>
            <h1 className="text-5xl leading-tight! font-semibold xl:text-6xl">
              Go beyond managing returns, take control and perfect them.
            </h1>
            <p className="text-muted-foreground text-2xl leading-snug">
              Create tailored return policies that boost retention and keep your
              customers thrilled.
            </p>
            <Button
              asChild
              variant="default"
              className="block h-fit w-fit rounded-full px-6 py-2 text-base leading-loose font-semibold"
            >
              <a href="#">Book a demo</a>
            </Button>
          </div>
          <div className="justify-self-center lg:justify-self-end">
            <div className="bg-background flex aspect-[0.955145119/1] flex-col rounded-xl border p-3 shadow-xl sm:w-[22.625rem]">
              <AspectRatio
                ratio={1.110367893 / 1}
                className="bg-muted w-full overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                  alt=""
                  className="block h-full w-full object-cover object-center"
                />
              </AspectRatio>
              <div className="m-auto flex w-full items-center justify-between">
                <div className="flex items-center gap-1 rounded-md bg-black/5 px-2 py-1">
                  <Repeat className="h-4" />
                  <p className="text-xs font-semibold sm:text-sm">Exchange</p>
                </div>
                <div className="bg-background flex items-center gap-1 rounded-md px-2 py-1">
                  <ShoppingBag className="h-4 stroke-black/40" />
                  <p className="text-xs font-semibold text-black/40 sm:text-sm">
                    Shop Now
                  </p>
                </div>
                <div className="bg-background flex items-center gap-1 rounded-md px-2 py-1">
                  <Banknote className="h-4 stroke-black/40" />
                  <p className="text-xs font-semibold text-black/40 sm:text-sm">
                    Refund
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero125 };
