'use client';

import React, { useState } from 'react';

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
import { TypewriterText } from '@/components/ui/typewriter-text';

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
  description = 'Like having your own AI Xano developer. Build APIs, manage databases, create workflows, and deploy instantly — all through natural conversation with any AI.',
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

  return (
    <>
      {/* Hero Section - Premium Layout with Generous Spacing */}
      <section className="flex min-h-[90vh] items-center bg-gradient-to-br from-slate-50/50 via-white to-purple-50/30 pt-[180px] pb-[160px] lg:pt-[200px] dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
        <div className="container max-w-screen-xl px-6 lg:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-24">
            {/* Left Column - Content (spans 6 columns) */}
            <div className="space-y-10 lg:col-span-6">
              {/* Content Block - All aligned to same left edge */}
              <div className="max-w-[680px]">
                <div className="relative">
                  {/* More dynamic background gradient behind headline */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 via-blue-500/8 via-orange-500/6 to-amber-500/8 blur-3xl dark:from-purple-500/5 dark:via-blue-500/4 dark:via-orange-500/3 dark:to-amber-500/4"></div>

                  <h1
                    className="hero-headline mb-8 text-4xl leading-[1.1] font-bold tracking-[-0.01em] text-slate-900 lg:text-[4rem] dark:text-slate-100"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    Supercharge your{' '}
                    <span className="gradient-text-database bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                      Xano backend
                    </span>{' '}
                    with{' '}
                    <span className="gradient-text-ai bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
                      <TypewriterText
                        words={['any AI', 'Claude.ai', 'Copilot', 'ChatGPT']}
                        typeSpeed={80}
                        deleteSpeed={40}
                        delayBetweenWords={2000}
                        cursor={true}
                        cursorChar="|"
                        className="inline"
                      />
                    </span>
                  </h1>
                </div>

                <p
                  className="hero-subtitle mb-12 max-w-[600px] text-xl leading-[1.6] text-slate-700 dark:text-slate-300"
                  style={{
                    fontSize: '1.25rem',
                    opacity: '0.8',
                  }}
                >
                  {description}
                </p>

                {/* CTA Buttons */}
                <div className="mb-8 flex flex-wrap gap-5">
                  <Link href="/dashboard/settings/universe-credentials">
                    <Button className="h-[58px] rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-9 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 dark:from-purple-500 dark:to-indigo-500">
                      Connect Your Xano
                    </Button>
                  </Link>
                  <Link
                    href="https://calendly.com/robertboulos/30-min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="h-[58px] rounded-xl border-slate-900/10 px-9 text-base font-semibold text-slate-900 transition-all duration-200 hover:border-slate-900/20 hover:bg-slate-900/5 dark:border-slate-100/10 dark:text-slate-100 dark:hover:border-slate-100/20 dark:hover:bg-slate-100/5"
                    >
                      See AI Build in Xano
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Claude Chat Interface (spans 6 columns) */}
            <div className="mt-8 lg:col-span-6 lg:mt-0">
              <div className="mx-auto w-full max-w-[580px] overflow-hidden rounded-2xl border border-slate-900/8 bg-white shadow-[0_12px_32px_rgba(2,6,23,0.12),0_4px_16px_rgba(2,6,23,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,6,23,0.16),0_6px_20px_rgba(2,6,23,0.10)] lg:mx-0 dark:border-slate-100/8 dark:bg-slate-900 dark:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="bg-muted/30 dark:bg-muted/20 flex items-center justify-between border-b px-4 py-3 dark:border-slate-800">
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
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown className="h-3 w-3" />
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
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-md rounded-xl border border-slate-900/5 bg-white px-5 py-4 text-sm dark:border-slate-700 dark:bg-slate-800">
                        Create an API endpoint that returns users who signed up this week with their subscription status
                      </div>
                    </div>

                    {/* Assistant Message with Tool Call */}
                    <div className="flex justify-start">
                      <div className="max-w-lg space-y-3 rounded-xl bg-slate-50 px-5 py-4 text-sm dark:bg-slate-800/50">
                        <p className="text-foreground">
                          I'll create a new API endpoint in your Xano backend
                          that returns users who signed up this week with their
                          subscription details.
                        </p>

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
                              <Badge variant="outline" className="mr-2 text-xs">
                                Xano Function
                              </Badge>
                              <span>142ms</span>
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
                                <TabsTrigger value="trace" className="text-xs">
                                  Trace
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="summary" className="mt-2">
                                <div className="text-muted-foreground space-y-1 text-xs">
                                  <p>• API endpoint created: /users/recent-signups</p>
                                  <p>
                                    • Database query added with 7-day filter
                                  </p>
                                  <p>• Response includes user + subscription data</p>
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
                            Created API endpoint that found <strong>47 new users</strong> this week.
                            The endpoint is now live at{' '}
                            <strong>/api:v1/users/recent-signups</strong>:
                          </p>

                          <div className="bg-background mt-2 rounded border dark:border-slate-700 dark:bg-slate-900">
                            <table className="w-full text-xs">
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
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section - Moved below hero */}
      <section className="bg-muted/20 border-t py-12 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="container max-w-screen-xl">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Database Support */}
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Xano • No-code Backend • API-first</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-slate-400 lg:block dark:bg-slate-600"></div>
              <span>MCP Compatible</span>
              <div className="hidden h-1 w-1 rounded-full bg-slate-400 lg:block dark:bg-slate-600"></div>
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
