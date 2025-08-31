'use client';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp',
    content:
      'Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis.',
  },
  {
    name: 'Jane Doe',
    role: 'CTO',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp',
    content:
      'Lorem ipsum dolor adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis.',
  },
  {
    name: 'John Smith',
    role: 'COO',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem.',
  },
  {
    name: 'Jane Smith',
    role: 'Tech Lead',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur blanditiis asperiores voluptatem Ipsam ipsa cumque.',
  },
  {
    name: 'Richard Doe',
    role: 'Designer',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Gordon Doe',
    role: 'Developer',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Richard Smith',
    role: 'Developer',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat consequatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
  {
    name: 'Gordon Smith',
    role: 'Developer',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. repellat consequatur odio, maxime corporis, ducimus dolorem possimus aspernatur blanditiis asperiores voluptatem Ipsam ipsa cumque deleniti.',
  },
];

const Testimonial8 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            What our clients say
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            Discover how our customers are using our products to build their
            businesses
          </p>
        </div>
        <div className="after:from-background relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
          >
            <Masonry gutter="20px" columnsCount={3}>
              {testimonials.map((testimonial, idx) => {
                return (
                  <Card
                    key={idx}
                    className={cn(
                      'p-5',
                      idx > 3 && idx <= 5 && 'hidden md:block',
                      idx > 5 && 'hidden lg:block'
                    )}
                  >
                    <div className="flex gap-4 leading-5">
                      <Avatar className="ring-input size-9 rounded-full ring-1">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="text-foreground/70 mt-8 leading-7">
                      <q>{testimonial.content}</q>
                    </div>
                  </Card>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </section>
  );
};

export { Testimonial8 };
