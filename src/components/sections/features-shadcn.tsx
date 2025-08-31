'use client';

import {
  Activity,
  Shield,
  Zap,
  Database,
  Code2,
  LineChart,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeaturesShadcn = () => {
  const features = [
    {
      id: 'monitoring',
      title: 'Real-Time Monitoring',
      icon: Activity,
      description:
        'Track your MCP connections and API performance in real-time',
      image: '/api/placeholder/600/400',
      details: [
        'Live connection status dashboard',
        'API response time tracking',
        'Error rate monitoring',
        'Usage analytics and insights',
      ],
    },
    {
      id: 'integration',
      title: 'Seamless Integration',
      icon: Code2,
      description: 'Connect Xano with Claude AI in minutes, not hours',
      image: '/api/placeholder/600/400',
      details: [
        'One-click MCP setup',
        'Pre-built templates',
        'Auto-generated configurations',
        'Webhook management',
      ],
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      icon: Shield,
      description: 'Bank-grade security for your data and connections',
      image: '/api/placeholder/600/400',
      details: [
        'End-to-end encryption',
        'Role-based access control',
        'Audit logging',
        'SOC 2 compliant infrastructure',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Everything you need to connect AI with your backend
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            Powerful features that make Xano + Claude integration effortless
          </p>
        </div>

        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:mx-auto lg:w-[600px]">
            {features.map(feature => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="flex items-center gap-2"
              >
                <feature.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map(feature => (
            <TabsContent
              key={feature.id}
              value={feature.id}
              className="mt-8 space-y-8"
            >
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center">
                  <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {feature.description}
                  </p>
                  <ul className="mb-8 space-y-3">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Button size="lg">Learn More</Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-muted aspect-[4/3] overflow-hidden rounded-xl border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-primary/5 absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-xl" />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
              <Zap className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Sub-100ms response times for real-time AI interactions
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
              <Database className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Unlimited Scale</h3>
            <p className="text-muted-foreground text-sm">
              Handle millions of requests without breaking a sweat
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
              <LineChart className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Full Analytics</h3>
            <p className="text-muted-foreground text-sm">
              Deep insights into every aspect of your AI operations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FeaturesShadcn };
