import { Database, Zap, Activity, CheckCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Features = () => {
  return (
    <section className="bg-muted/30 py-16 lg:py-24 dark:bg-slate-900/30">
      <div className="container">
        <div className="mb-16 flex flex-col items-center gap-8">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            TypeScript SDK + Middleware
          </Badge>
          <h2 className="max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-5xl">
            Why This AI Doesn't Break Like The Others
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center text-balance lg:text-xl">
            Weekly Xano training. Real builds. Real results. Join developers who
            are shipping production APIs in minutes, not months.
          </p>
        </div>

        <Tabs defaultValue="secure" className="mx-auto w-full max-w-6xl">
          <TabsList className="mb-12 grid h-12 w-full grid-cols-3">
            <TabsTrigger value="secure" className="text-base font-semibold">
              ❌ Why AI Fails in Xano
            </TabsTrigger>
            <TabsTrigger value="velocity" className="text-base font-semibold">
              ✅ How We Fixed It
            </TabsTrigger>
            <TabsTrigger value="production" className="text-base font-semibold">
              📈 Real Developer Stories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="secure" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                The Problem With AI + Xano
              </h3>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                    <span className="text-xl">🚫</span>
                  </div>
                  <h4 className="font-semibold">No Feedback Loop</h4>
                </div>
                <p className="text-muted-foreground">
                  XanoScript gives zero error details. AI just sees "failed."
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    What AI sees:
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-red-600">Error: Expression failed</div>
                    <div className="text-slate-600">Line: ???</div>
                    <div className="text-slate-600">Reason: ???</div>
                    <div className="text-slate-600">Fix: ???</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Result: You spend hours debugging, or give up entirely.
                </p>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <h4 className="font-semibold">No Guardrails</h4>
                </div>
                <p className="text-muted-foreground">
                  AI generates invalid syntax, green expressions everywhere,
                  doesn't use filters.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    AI generates:
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-red-600">
                      $user.name + " logged in"
                    </div>
                    <div className="text-red-600">
                      if ($count &gt; 10) {'{ ... }'}
                    </div>
                    <div className="text-red-600">
                      created_at.format('MM/DD')
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-2 text-xs">
                    None of this works in Xano.
                  </div>
                </div>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                    <span className="text-xl">❓</span>
                  </div>
                  <h4 className="font-semibold">No Context</h4>
                </div>
                <p className="text-muted-foreground">
                  AI doesn't know Xano's 200+ filters or when to use them.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    Xano has:
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>• 200+ filter operations</div>
                    <div>• Specific pipeline syntax</div>
                    <div>• Table vs API operations</div>
                    <div>• Complex auth patterns</div>
                  </div>
                  <div className="text-muted-foreground mt-2 text-xs">
                    AI knows: Almost none of this.
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="velocity" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                The Solution: SDK + Middleware
              </h3>
              <p className="text-muted-foreground text-lg">
                We built an SDK with guardrails that achieves 80-90% first-try
                success rate.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">TypeScript SDK</h4>
                </div>
                <p className="text-muted-foreground">
                  Enforces valid XanoScript, auto-converts to filter syntax,
                  provides linting.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    SDK converts:
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-green-600">
                      dbQuery('users', {'{ filter: { ... } }'})
                    </div>
                    <div className="text-green-600">↓</div>
                    <div className="text-green-600">
                      Valid XanoScript with filters
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-2 text-xs">
                    Type-safe, validated, production-ready
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  See SDK docs →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Middleware Layer</h4>
                </div>
                <p className="text-muted-foreground">
                  Catches errors, provides feedback, retries with corrections.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    Feedback loop:
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>1. Catch error before deploy</div>
                    <div>2. Return actionable feedback</div>
                    <div>3. Auto-retry with fix</div>
                    <div>4. Test endpoint automatically</div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-green-600">
                    Result: It just works.
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Learn more →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">100+ MCP Tools</h4>
                </div>
                <p className="text-muted-foreground">
                  Every Xano API endpoint mapped and optimized for AI use.
                </p>
                <div className="bg-muted space-y-2 rounded-lg p-3">
                  <div className="text-xs font-medium">Coverage includes:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Database operations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>API management</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Auth systems</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Background tasks</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View all tools →
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                Real Developer Stories
              </h3>
              <p className="text-muted-foreground text-lg">
                From our weekly MCP Wednesday calls and community.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-1">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <span className="text-xl">🇬🇧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Luke (UK) - From Skeptic to Evangelist
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Platform Builder
                    </p>
                  </div>
                </div>
                <p className="text-lg">
                  Built a complete client platform from Greece - by the pool, on
                  his phone. Now prefers the AI to manual development.
                </p>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <span className="text-xl">🇬🇧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Shane (UK) - 4 Hours → 2 Minutes
                    </h4>
                    <p className="text-muted-foreground text-sm">Developer</p>
                  </div>
                </div>
                <p className="text-lg">
                  Reduced a 4-hour complex function build to just 2 minutes.
                  Created a 1,500-line cookbook to train the AI on patterns.
                </p>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <span className="text-xl">🇦🇺</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Nick (Australia) - Trust Through Proof
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Automation Developer
                    </p>
                  </div>
                </div>
                <blockquote className="text-lg italic">
                  "This seemed too good to be true... I booked a call before
                  entering my API key."
                </blockquote>
                <blockquote className="text-lg font-semibold text-green-600 italic">
                  "We're at the front of something big."
                </blockquote>
                <p className="text-muted-foreground text-sm">
                  Now building automation systems.
                </p>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <span className="text-xl">🏥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      West & John (Healthcare) - Enterprise Adoption
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Healthcare Tech
                    </p>
                  </div>
                </div>
                <blockquote className="text-lg italic">
                  "We started with read-only credentials for our healthcare
                  client."
                </blockquote>
                <p className="text-muted-foreground text-sm">
                  Now using for production healthcare systems. Gradual adoption
                  for sensitive systems.
                </p>
              </Card>

              <Card className="space-y-4 border-2 border-purple-500 p-6 dark:border-purple-400">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Robert Boulos - Creator</h4>
                    <p className="text-muted-foreground text-sm">Snappy MCP</p>
                  </div>
                </div>
                <blockquote className="text-lg font-semibold text-purple-600 italic">
                  "80-90% of the time, I click Run and it just works."
                </blockquote>
                <blockquote className="text-lg italic">
                  "This wasn't possible before the SDK and middleware."
                </blockquote>
                <p className="text-muted-foreground text-sm">
                  Built while solving his own Xano problems. Built 50 endpoints
                  during a barbecue.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export { Features };
