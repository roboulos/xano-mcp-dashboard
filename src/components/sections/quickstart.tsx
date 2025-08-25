'use client';

import { CheckCircle, Terminal, Code, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QuickStart = () => {
  const connectSteps = `Step 1: Xano Workspace
Workspace URL: your-app.xano.io
API Base: https://your-app.xano.io/api:v1

Step 2: Authentication
API Key: YOUR_API_KEY
OAuth Client ID: YOUR_CLIENT_ID
OAuth Secret: YOUR_SECRET

Step 3: Connection Verified
✓ Workspace connected
✓ Authentication confirmed
✓ Tables & APIs mapped
✓ Ready to build`;

  const askExamples = `Natural Language → Xano API

"Create an endpoint for user onboarding"
→ POST /api/users/onboard (with validation & welcome email)

"Build a dashboard stats API"  
→ GET /api/dashboard/stats (aggregated metrics)

"Add subscription management"
→ Full CRUD endpoints with Stripe integration

"Implement user search with filters"
→ GET /api/users/search with query params & pagination`;

  const automateFlow = `Example: User Activity Tracking

1. You Describe:
   "Track user engagement metrics daily"

2. AI Developer Creates:
   - Database schema for events
   - API endpoint for tracking  
   - Background task for aggregation
   - Dashboard endpoint for metrics

3. Xano Function Stack:
   - Input validation
   - Event recording
   - Real-time aggregation
   - Scheduled reports

4. Result:
   ✓ Production-ready API
   ✓ Optimized performance
   ✓ Built-in error handling`;

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
            Quick Start
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight lg:text-5xl">
            Get Your Xano AI Developer in 2 minutes
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-balance lg:text-xl">
            Simple setup - no coding required. Connect your Xano workspace and
            start building APIs with natural language using any AI immediately.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="connect" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger
                  value="connect"
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Connect
                </TabsTrigger>
                <TabsTrigger value="ask" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Ask
                </TabsTrigger>
                <TabsTrigger
                  value="automate"
                  className="flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Automate
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="connect" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Connect Your Xano Workspace
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        OAuth 2.0
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        API Key
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Secure
                      </Badge>
                    </div>
                  </div>
                  <CodeBlock
                    code={connectSteps}
                    language="text"
                    title="connection-setup.txt"
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 text-center md:grid-cols-3">
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    No Migration Needed
                  </span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    Works in Your Xano
                  </span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    Instant Connection
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ask" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Describe What to Build
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Natural Language
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Instant
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Xano Functions
                      </Badge>
                    </div>
                  </div>
                  <CodeBlock
                    code={askExamples}
                    language="text"
                    title="expert-examples.txt"
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 text-center md:grid-cols-3">
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Natural Language</span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">AI Builds Code</span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Deploy Instantly</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automate" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Review & Deploy</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Tested
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Optimized
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Production-Ready
                      </Badge>
                    </div>
                  </div>
                  <CodeBlock
                    code={automateFlow}
                    language="text"
                    title="workflow-automation.txt"
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 text-center md:grid-cols-3">
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Code Review</span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Test Coverage</span>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">One-Click Deploy</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Next Steps */}
          <div className="mt-16 text-center">
            <h3 className="mb-6 text-xl font-semibold">What's Next?</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Globe className="text-primary h-6 w-6" />
                </div>
                <h4 className="mb-2 font-semibold">Connect Your Xano</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Link your Xano workspace to unlock AI development powers
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/settings/universe-credentials">
                    Start Setup →
                  </a>
                </Button>
              </Card>

              <Card className="p-6 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Terminal className="text-primary h-6 w-6" />
                </div>
                <h4 className="mb-2 font-semibold">Book AI Demo</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  See how AI can build complex Xano backends in minutes
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://calendly.com/robertboulos/30-min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Schedule Now →
                  </a>
                </Button>
              </Card>

              <Card className="p-6 text-center">
                <div className="bg-primary/10 dark:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Code className="text-primary h-6 w-6" />
                </div>
                <h4 className="mb-2 font-semibold">Try Demo</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Watch AI build a complete backend in our demo Xano workspace
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard">Launch Demo →</a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { QuickStart };
