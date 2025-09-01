'use client';

import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

import {
  Star,
  Bot,
  MoreHorizontal,
  ChevronDown,
  Database,
  Send,
} from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeroProps {
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero = ({
  reviews = {
    count: 150,
    rating: 4.8,
    avatars: [
      {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        alt: 'User 1',
      },
      {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        alt: 'User 2',
      },
      {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        alt: 'User 3',
      },
      {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        alt: 'User 4',
      },
      {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        alt: 'User 5',
      },
    ],
  },
}: HeroProps) => {
  const [toolExpanded, setToolExpanded] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const viewport = root.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement | null;
    if (!viewport) return;

    const update = () => {
      setAtTop(viewport.scrollTop <= 0);
      const bottom =
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 1;
      setAtBottom(bottom);
    };

    update();
    viewport.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const onSend = () => {
    setSending(true);
    setTimeout(() => setSending(false), 550);
  };

  return (
    <>
      {/* Hero Section - Premium Layout with Generous Spacing */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-background pt-[180px] pb-[160px] lg:pt-[200px]">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-4 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container max-w-screen-xl px-6 lg:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-24">
            {/* Left Column - Content (spans 6 columns) */}
            <div className="space-y-10 lg:col-span-6">
              {/* Content Block - All aligned to same left edge */}
              <div className="max-w-[680px]">
                <div className="relative">

                  <h1
                    className="hero-headline mb-8 text-4xl leading-[1.1] font-bold tracking-[-0.02em] text-foreground lg:text-[4rem]"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      fontWeight: '700',
                    }}
                  >
                    Build{' '}
                    <span className="text-primary font-bold">
                      10x Faster
                    </span>{' '}
                    in Xano with{' '}
                    <span className="text-primary font-bold">
                      AI That Actually Works
                    </span>
                  </h1>
                </div>

                <p
                  className="hero-subtitle mb-8 max-w-[600px] text-xl leading-[1.6] text-muted-foreground"
                  style={{
                    fontSize: '1.25rem',
                  }}
                >
                  Stop debugging green expression soup. Build in 2 minutes what
                  used to take 4 hours. TypeScript SDK + middleware = AI that
                  speaks fluent XanoScript.
                </p>

                {/* Trust Indicators */}
                <div className="mb-8 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <span className="text-lg">⚡</span>
                    <span>100+ MCP tools ready</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <span className="text-lg">🎯</span>
                    <span>80-90% first-try success</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <span className="text-lg">📅</span>
                    <span>Weekly MCP Wednesday calls</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mb-8 flex flex-wrap gap-5">
                  <Link href="/dashboard">
                    <Button size="lg" className="h-[58px] rounded-xl px-9 text-base font-semibold">
                      Get Instant Access →
                    </Button>
                  </Link>
                  <Link
                    href="https://calendly.com/robertboulos/30-min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-[58px] rounded-xl px-9 text-base font-semibold"
                    >
                      See It Work in 2 Minutes
                    </Button>
                  </Link>
                </div>

                {/* Urgency */}
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Join 40+ developers</span>{' '}
                  shipping faster with AI they can trust.
                </p>
              </div>
            </div>

            {/* Right Column - Claude Chat Interface (spans 6 columns) */}
            <div className="mt-8 lg:col-span-6 lg:mt-0">
              <div className="mx-auto w-full max-w-[580px] rounded-2xl border bg-card shadow-lg transition-all duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-xl lg:mx-0">
                <div className="overflow-hidden">
                  {/* Header */}
                  <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            Claude 3.5 Sonnet
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Xano AI Developer
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="status-dot" aria-label="Online" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="dm-trigger h-6 w-6 p-0"
                          >
                            <ChevronDown className="chev h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Claude 3.5 Sonnet</DropdownMenuItem>
                          <DropdownMenuItem>Claude 3.5 Haiku</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Conversation */}
                  <ScrollArea
                    ref={scrollRef as React.RefObject<HTMLDivElement>}
                    className="scroll-fade h-96 p-4"
                    data-at-top={atTop}
                    data-at-bottom={atBottom}
                  >
                    <div className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="msg-out max-w-md rounded-xl border bg-card px-5 py-4 text-sm">
                          Create an API endpoint that returns users who signed
                          up this week with their subscription status
                        </div>
                      </div>

                      {/* Assistant Message with Tool Call */}
                      <div className="flex justify-start">
                        <div className="msg-in max-w-lg space-y-3 rounded-xl bg-muted px-5 py-4 text-sm">
                          <p className="text-foreground">
                            I'll create a new API endpoint in your Xano backend
                            that returns users who signed up this week with
                            their subscription details.
                          </p>

                          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-[11px]">
                            <div className="typing text-muted-foreground">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="text-xs">
                              Claude is thinking...
                            </span>
                          </div>

                          <Collapsible
                            open={toolExpanded}
                            onOpenChange={setToolExpanded}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-normal"
                              >
                                <Badge
                                  variant="outline"
                                  className="badge-sheen mr-2 text-xs"
                                >
                                  Xano Function
                                </Badge>
                                <span className="shimmer-once">142ms</span>
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <Tabs defaultValue="summary" className="w-full">
                                <TabsList className="grid h-8 w-full grid-cols-4">
                                  <TabsTrigger
                                    value="summary"
                                    className="text-xs"
                                  >
                                    Summary
                                  </TabsTrigger>
                                  <TabsTrigger value="sql" className="text-xs">
                                    SQL
                                  </TabsTrigger>
                                  <TabsTrigger value="json" className="text-xs">
                                    JSON
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="trace"
                                    className="text-xs"
                                  >
                                    Trace
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="summary" className="mt-2">
                                  <div className="text-muted-foreground space-y-1 text-xs">
                                    <p>
                                      • API endpoint created:
                                      /users/recent-signups
                                    </p>
                                    <p>
                                      • Database query added with 7-day filter
                                    </p>
                                    <p>
                                      • Response includes user + subscription
                                      data
                                    </p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="sql" className="mt-2">
                                  <CodeBlock
                                    code={`// Xano Function Stack
1. Database Request: Query all records
   Table: users
   Filter: created_at >= timestamp_sub(now, 7, "day")
   
2. Addon: users_subscription (one-to-one)
   
3. Sort: created_at DESC

4. Return: {id, email, created_at, subscription}`}
                                    language="javascript"
                                    showCopy={false}
                                    className="text-xs"
                                  />
                                </TabsContent>
                                <TabsContent value="json" className="mt-2">
                                  <CodeBlock
                                    code={`{
  "endpoint": "/users/recent-signups",
  "method": "GET",
  "auth": "api_key",
  "response_count": 47
}`}
                                    language="json"
                                    showCopy={false}
                                    className="text-xs"
                                  />
                                </TabsContent>
                                <TabsContent value="trace" className="mt-2">
                                  <div className="text-muted-foreground space-y-1 text-xs">
                                    <p>• Function created: 12ms</p>
                                    <p>• API test run: 89ms</p>
                                    <p>• Deployment: ready</p>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </CollapsibleContent>
                          </Collapsible>

                          <div className="text-foreground">
                            <p className="mb-2">
                              Created API endpoint that found{' '}
                              <strong>47 new users</strong> this week. The
                              endpoint is now live at{' '}
                              <strong>/api:v1/users/recent-signups</strong>:
                            </p>

                            <div className="bg-background mt-2 rounded border">
                              <table className="table-hover w-full text-xs">
                                <thead className="border-b">
                                  <tr className="text-left">
                                    <th className="p-2 font-medium">Email</th>
                                    <th className="p-2 font-medium">Joined</th>
                                    <th className="p-2 font-medium">Plan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b">
                                    <td className="p-2">alice@company.com</td>
                                    <td className="p-2">Today</td>
                                    <td className="p-2">Pro</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="p-2">bob@startup.io</td>
                                    <td className="p-2">Yesterday</td>
                                    <td className="p-2">Business</td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">carol@dev.co</td>
                                    <td className="p-2">2 days ago</td>
                                    <td className="p-2">Free</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Composer */}
                  <Separator />
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tell me what to build in Xano..."
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={onSend}
                        className={`send-btn ${sending ? 'sending' : ''}`}
                      >
                        <Send className="plane h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section - Moved below hero */}
      <section className="bg-muted/20 border-t py-12">
        <div className="container max-w-screen-xl">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Database Support */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Xano • No-code Backend • API-first</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 lg:block"></div>
              <span>MCP Compatible</span>
              <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 lg:block"></div>
              <span>SOC 2 Ready</span>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center -space-x-3">
                {reviews.avatars.slice(0, 4).map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="border-background size-10 border-2"
                  >
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                ))}
              </span>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`size-4 ${
                        index < Math.floor(reviews.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold">
                    {reviews.rating?.toFixed(1)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  from {reviews.count}+ developers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
