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
            The Complete System
          </Badge>
          <h2 className="max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-5xl">
            Master AI-Accelerated Development in Xano
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center text-balance lg:text-xl">
            Get the MCP tools, weekly training calls, and expert guidance you need to build 
            10x faster. Learn from developers who've deployed 100+ production APIs with AI.
          </p>
        </div>

        <Tabs defaultValue="secure" className="mx-auto w-full max-w-6xl">
          <TabsList className="mb-12 grid h-12 w-full grid-cols-3">
            <TabsTrigger value="secure" className="text-base font-semibold">
              🛠️ Proven MCP Tools
            </TabsTrigger>
            <TabsTrigger value="velocity" className="text-base font-semibold">
              🎓 Weekly Training Calls
            </TabsTrigger>
            <TabsTrigger value="production" className="text-base font-semibold">
              🚀 Expert Guidance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="secure" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                Battle-tested MCP tools that work with your AI
              </h3>
              <p className="text-muted-foreground text-lg">
                101+ Xano operations via MCP. Connect to Claude.ai, ChatGPT, or any AI assistant.
                Build complete APIs, manage databases, and deploy instantly — all through natural language.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Direct Xano integration</h4>
                </div>
                <p className="text-muted-foreground">
                  MCP tools connect directly to your Xano workspace. Create tables,
                  build APIs, manage auth — all through conversation with AI.
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
                  View MCP tools →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
                  <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/20">
                    <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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
                Join weekly calls with experienced Xano developers
              </h3>
              <p className="text-muted-foreground text-lg">
                Every week, get live training on AI-accelerated development. Watch real builds,
                ask questions, share challenges. Learn patterns that actually work in production.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                    <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold">Live training every week</h4>
                </div>
                <p className="text-muted-foreground">
                  Watch experienced developers build with AI in real-time. See exactly
                  how to prompt, debug, and deploy production APIs.
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/10">
                    <div className="mb-1 text-xs font-medium text-purple-600 dark:text-purple-400">
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
                  Join next call →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-semibold">Ask questions, get answers</h4>
                </div>
                <p className="text-muted-foreground">
                  Stuck on authentication? Need help with webhooks? Get immediate
                  help from developers who've solved these problems before.
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
                  See schedule →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/20">
                    <Database className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h4 className="font-semibold">
                    Community of builders
                  </h4>
                </div>
                <p className="text-muted-foreground">
                  Connect with other developers using AI to build faster.
                  Share patterns, get feedback, solve problems together.
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
                  Join community →
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                Expert guidance from production experience
              </h3>
              <p className="text-muted-foreground text-lg">
                Learn from developers who've built real SaaS products with Xano and AI.
                Get patterns that work, avoid costly mistakes, ship faster.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Production patterns</h4>
                </div>
                <p className="text-muted-foreground">
                  Learn authentication flows, webhook handling, Stripe integration,
                  and more. Get templates and examples from real applications.
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
                  View patterns →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/20">
                    <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h4 className="font-semibold">Debugging & optimization</h4>
                </div>
                <p className="text-muted-foreground">
                  Learn how to debug AI-generated code, optimize queries, and
                  handle edge cases. Real troubleshooting from real projects.
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
                  <h4 className="font-semibold">Ongoing support</h4>
                </div>
                <p className="text-muted-foreground">
                  Not just tools, but ongoing help. Weekly calls, community access,
                  and direct guidance when you need it most.
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
