import {
  Database,
  Zap,
  Lock,
  Activity,
  Users,
  CheckCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Features = () => {
  return (
    <section className="bg-muted/30 py-16 lg:py-24 dark:bg-slate-900/30">
      <div className="container">
        <div className="mb-16 flex flex-col items-center gap-8">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            Value Proposition
          </Badge>
          <h2 className="max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-5xl">
            Why Xano AI Developer Transforms Your Backend
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center text-balance lg:text-xl">
            Have your own AI Xano developer that builds within your existing
            workspace. Works with Claude.ai, ChatGPT, Copilot, and any AI you
            prefer.
          </p>
        </div>

        <Tabs defaultValue="secure" className="mx-auto w-full max-w-6xl">
          <TabsList className="mb-12 grid h-12 w-full grid-cols-3">
            <TabsTrigger value="secure" className="text-base font-semibold">
              🔒 Your Xano, Supercharged
            </TabsTrigger>
            <TabsTrigger value="velocity" className="text-base font-semibold">
              ⚡ Build 10x Faster
            </TabsTrigger>
            <TabsTrigger value="production" className="text-base font-semibold">
              🚀 Production-Ready Instantly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="secure" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                AI builds within your existing Xano workspace
              </h3>
              <p className="text-muted-foreground text-lg">
                Your AI developer works directly in your Xano instance. No
                migration, no new platform to learn — just supercharged
                development in the Xano you already know.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Works in your workspace</h4>
                </div>
                <p className="text-muted-foreground">
                  AI understands your existing tables, APIs, and functions.
                  Creates new endpoints following your patterns, using your
                  authentication and security rules.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    Generic AI Coding ❌
                  </div>
                  <div className="rounded border border-red-200 bg-red-50 p-2 font-mono text-xs dark:border-red-800 dark:bg-red-900/10">
                    Copy-paste code, manual setup, breaks patterns
                  </div>
                  <div className="text-muted-foreground mt-2 mb-2 text-sm">
                    Xano AI Developer ✅
                  </div>
                  <div className="rounded border border-green-200 bg-green-50 p-2 font-mono text-xs dark:border-green-800 dark:bg-green-900/10">
                    Direct Xano integration - perfect every time
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Learn more →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold">Xano-native development</h4>
                </div>
                <p className="text-muted-foreground">
                  AI builds using Xano's function stack, addons, and utilities.
                  No raw SQL — just clean Xano patterns that scale.
                </p>
                <CodeBlock
                  code={`// AI creates this automatically:
Function Stack:
1. Query Records: users (status = "active")
2. Addon: user_orders (aggregate: sum)
3. Sort: total_revenue DESC
4. Return: Transformed response`}
                  language="javascript"
                  showCopy={false}
                  className="text-xs"
                />
                <Button variant="outline" size="sm" className="w-full">
                  Learn more →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Best practices built-in</h4>
                </div>
                <p className="text-muted-foreground">
                  AI follows Xano best practices: proper error handling,
                  efficient queries, secure authentication. Your APIs are
                  production-ready from the start.
                </p>
                <div className="space-y-2">
                  <div className="bg-muted flex items-center gap-2 rounded p-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Input validation</span>
                    <span className="text-green-600">Auto-added</span>
                  </div>
                  <div className="bg-muted flex items-center gap-2 rounded p-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Error responses</span>
                    <span className="text-green-600">Configured</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Learn more →
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="velocity" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                Natural language to working APIs
              </h3>
              <p className="text-muted-foreground text-lg">
                Skip documentation, avoid tutorials. Just describe what you want
                to build and AI handles the complex Xano logic. From idea to
                deployed API in minutes.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Skip the learning curve</h4>
                </div>
                <p className="text-muted-foreground">
                  Whether you're new to Xano or an expert, AI accelerates your
                  development. Describe your goal, get working code instantly.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/10">
                    <div className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                      You describe
                    </div>
                    <div className="text-sm">
                      "I need an API that returns inactive users with their last
                      activity date"
                    </div>
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/10">
                    <div className="mb-1 text-xs font-medium text-green-600 dark:text-green-400">
                      AI builds
                    </div>
                    <div className="font-mono text-sm">
                      GET /api/users/inactive → Full Xano function
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Watch demo →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-semibold">Complex logic made simple</h4>
                </div>
                <p className="text-muted-foreground">
                  Multi-table joins, conditional logic, external API calls — AI
                  handles the complexity while you focus on the business logic.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/10">
                    <div className="mb-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      Complex requirement
                    </div>
                    <div className="text-sm">
                      "Aggregate user stats, join with payments, filter by
                      subscription tier"
                    </div>
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/10">
                    <div className="mb-1 text-xs font-medium text-green-600 dark:text-green-400">
                      AI delivers
                    </div>
                    <div className="font-mono text-sm">
                      Complete function stack with joins, filters & transforms
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  See examples →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/20">
                    <Database className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h4 className="font-semibold">
                    Understands your Xano workspace
                  </h4>
                </div>
                <p className="text-muted-foreground">
                  AI knows your tables, relationships, and existing APIs.
                  Suggests the right approach based on your current setup.
                </p>
                <div className="bg-muted space-y-2 rounded-lg p-3">
                  <div className="text-xs font-medium">Your Xano Resources</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-mono">Database Tables</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-mono">API Groups</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-mono">Functions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-mono">Addons</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Connect Xano →
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                AI-generated code follows Xano best practices
              </h3>
              <p className="text-muted-foreground text-lg">
                Built-in error handling • Optimized queries • Proper
                authentication • Ready for production traffic from the moment
                you deploy
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                    <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold">Instant deployment</h4>
                </div>
                <p className="text-muted-foreground">
                  AI creates, tests, and deploys your APIs in one flow. See
                  changes live in your Xano dashboard immediately.
                </p>
                <CodeBlock
                  code={`1. Connect your Xano workspace
2. Describe what you need  
3. AI builds & tests ✓
4. Deploy with confidence`}
                  language="text"
                  showCopy={false}
                  className="text-xs"
                />
                <Button variant="outline" size="sm" className="w-full">
                  Get started →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/20">
                    <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h4 className="font-semibold">Quality you can trust</h4>
                </div>
                <p className="text-muted-foreground">
                  Every API includes validation, error handling, and performance
                  optimization. Ship with confidence.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted rounded p-2">
                    <div className="text-muted-foreground">Dev Speed</div>
                    <div className="font-semibold text-green-600">
                      10x faster
                    </div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="text-muted-foreground">Error Rate</div>
                    <div className="font-semibold text-green-600">0%</div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="text-muted-foreground">APIs Built</div>
                    <div className="font-semibold">127+ live</div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-semibold text-green-600">99.97%</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View metrics →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
                    <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold">Works with any AI</h4>
                </div>
                <p className="text-muted-foreground">
                  Use Claude.ai, ChatGPT, GitHub Copilot, or any AI you prefer.
                  Your Xano workspace, your choice of AI assistant.
                </p>
                <div className="space-y-2">
                  <div className="bg-muted flex items-center justify-between rounded p-2 text-xs">
                    <span>SaaS Platform</span>
                    <Badge variant="secondary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                  <div className="bg-muted flex items-center justify-between rounded p-2 text-xs">
                    <span>Marketplace App</span>
                    <Badge variant="secondary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                  <div className="bg-muted flex items-center justify-between rounded p-2 text-xs">
                    <span>Mobile Backend</span>
                    <Badge variant="secondary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Start free →
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export { Features };
