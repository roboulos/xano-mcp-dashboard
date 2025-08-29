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
            Real Results, Not Theory
          </Badge>
          <h2 className="max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-5xl">
            The Shortcut to AI Development That Actually Works
          </h2>
          <p className="text-muted-foreground max-w-3xl text-center text-balance lg:text-xl">
            Weekly Xano training. Real builds. Real results. Join developers who are shipping 
            production APIs in minutes, not months.
          </p>
        </div>

        <Tabs defaultValue="secure" className="mx-auto w-full max-w-6xl">
          <TabsList className="mb-12 grid h-12 w-full grid-cols-3">
            <TabsTrigger value="secure" className="text-base font-semibold">
              🔥 What You'll Build
            </TabsTrigger>
            <TabsTrigger value="velocity" className="text-base font-semibold">
              🎓 How You'll Learn
            </TabsTrigger>
            <TabsTrigger value="production" className="text-base font-semibold">
              💰 Your Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="secure" className="space-y-8">
            <div className="mb-8 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                Watch: Build These in Your First Week
              </h3>
              <p className="text-muted-foreground text-lg">
                Stop wondering if AI can really help. These are actual features built by members 
                in their first weekly training calls.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold">Complete User Auth System</h4>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">8 minutes</span> to build login, 
                  signup, password reset, JWT tokens. What used to take days.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    Thursday's Live Build:
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>• User table with proper fields</span>
                      <span className="text-green-600">2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Signup/login endpoints</span>
                      <span className="text-green-600">3 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• JWT authentication</span>
                      <span className="text-green-600">2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Password reset flow</span>
                      <span className="text-green-600">1 min</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  See it built live →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Stripe Payment Integration</h4>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">22 minutes</span> for checkout, 
                  webhooks, subscription management. Normally a week of work.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    Member result from last week:
                  </div>
                  <div className="text-sm">
                    <p className="mb-2">"<em>I've been trying to add Stripe for 2 months. 
                    We did it together in one call.</em>"</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">- Marcus, SaaS founder</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Learn more →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/20">
                    <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h4 className="font-semibold">Real-time Dashboard API</h4>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">15 minutes</span> to aggregate data, 
                  calculate metrics, return formatted JSON. Skip the SQL headaches.
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
                Every Thursday 2pm EST: Live Xano Builds, Your Questions Answered
              </h3>
              <p className="text-muted-foreground text-lg">
                This isn't another course with pre-recorded videos. It's live training where we build 
                together, debug your actual code, and solve real problems.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                    <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold">Live coding, not videos</h4>
                </div>
                <p className="text-muted-foreground">
                  Watch me build real features with AI. See every prompt, every debug step, 
                  every deployment. No editing, no hiding mistakes.
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
                  <h4 className="font-semibold">Your code, debugged live</h4>
                </div>
                <p className="text-muted-foreground">
                  Share your screen. Show your errors. Get help in real-time. 
                  No more Stack Overflow guessing.
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
                Compare Your Options
              </h3>
              <p className="text-muted-foreground text-lg">
                One client project pays for a full year. Most members recoup their investment 
                in Week 1 through time saved.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="space-y-4 p-6 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                    <span className="text-xl">❌</span>
                  </div>
                  <h4 className="font-semibold">Without Training</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Enterprise Consultant</span>
                    <span className="font-semibold text-red-600">$10,000/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Senior Developer</span>
                    <span className="font-semibold text-red-600">$12,000/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trial & Error</span>
                    <span className="font-semibold text-red-600">6 months wasted</span>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded p-2 text-xs text-red-700 dark:text-red-400">
                  Plus: Broken code, missed deadlines, no support
                </div>
              </Card>

              <Card className="space-y-4 p-6 border-2 border-green-500 dark:border-green-400 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  BEST VALUE
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                    <span className="text-xl">✅</span>
                  </div>
                  <h4 className="font-semibold">Xano AI Accelerator</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Weekly live training calls</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MCP tools (worth $2,000)</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Q&A support</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community access</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">$997/month</div>
                  <div className="text-xs opacity-90">Cancel anytime</div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Start Today →
                </Button>
              </Card>

              <Card className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <span className="text-xl">💡</span>
                  </div>
                  <h4 className="font-semibold">Tools-Only Option</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MCP tools access</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly training calls</span>
                    <span className="text-slate-400 line-through">Not included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Q&A support</span>
                    <span className="text-slate-400 line-through">Not included</span>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">$497/month</div>
                  <div className="text-xs">Upgrade anytime</div>
                </div>
                <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                  Start here if you want to try the tools first
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Tools only →
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
