'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialShadcn = () => {
  const testimonials = [
    {
      content:
        'The Xano MCP Dashboard completely transformed how we integrate AI into our applications. What used to take weeks now takes hours.',
      author: 'Sarah Chen',
      role: 'CTO at TechFlow',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
    {
      content:
        'Finally, a solution that makes Claude AI and Xano work together seamlessly. The real-time monitoring is a game-changer.',
      author: 'Michael Rodriguez',
      role: 'Lead Developer at StartupXYZ',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
    {
      content:
        "The weekly strategy calls alone are worth the Pro subscription. It's like having an AI integration expert on the team.",
      author: 'Emily Watson',
      role: 'Founder at DataDrive',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
    {
      content:
        "We've reduced our API response times by 60% using the optimization insights from the dashboard. Incredible tool!",
      author: 'James Park',
      role: 'Engineering Manager at ScaleUp',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
    {
      content:
        'The pre-built templates saved us months of development time. We had our first AI feature live in just 2 days.',
      author: 'Lisa Thompson',
      role: 'Product Manager at InnovateCo',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
    {
      content:
        "Best investment we've made this year. The dashboard pays for itself in time saved within the first week.",
      author: 'David Kim',
      role: 'CEO at FutureTech',
      avatar: '/api/placeholder/40/40',
      rating: 5,
    },
  ];

  // Split testimonials into columns for masonry effect
  const column1 = testimonials.slice(0, 2);
  const column2 = testimonials.slice(2, 4);
  const column3 = testimonials.slice(4, 6);

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge className="mb-4" variant="outline">
            Testimonials
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Loved by developers worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our users are saying about their experience with Xano MCP
            Dashboard
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Column 1 */}
            <div className="space-y-6">
              {column1.map((testimonial, index) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-6 sm:mt-6 lg:mt-12">
              {column2.map((testimonial, index) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-6 lg:mt-0">
              {column3.map((testimonial, index) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { TestimonialShadcn };
