'use client';

import { useState } from 'react';

import { LayoutDashboard, Users, Key, BarChart3, Activity } from 'lucide-react';

import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDashboardMetrics,
  useXanoCredentials,
} from '@/hooks/use-dashboard-data';

// Force dynamic rendering to avoid Next.js 15.0.4 prerendering issues
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: dashboardMetrics, loading: metricsLoading } =
    useDashboardMetrics('week');
  const { data: credentials, loading: credentialsLoading } =
    useXanoCredentials();

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card/80 supports-[backdrop-filter]:bg-card/60 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              MCP Control Center
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your Model Context Protocol infrastructure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              Last sync: 2 minutes ago
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/40 supports-[backdrop-filter]:bg-background/50 h-10 w-full justify-start rounded-lg border p-1 backdrop-blur">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            <MCPConnectionHub />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card ring-border rounded-lg p-4 shadow-sm ring-1">
                    <p className="text-muted-foreground text-sm">
                      Active Connections
                    </p>
                    {credentialsLoading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {credentials?.filter(c => c.is_active)?.length || 0}
                      </p>
                    )}
                  </div>
                  <div className="bg-card ring-border rounded-lg p-4 shadow-sm ring-1">
                    <p className="text-muted-foreground text-sm">
                      API Calls This Week
                    </p>
                    {metricsLoading ? (
                      <Skeleton className="mt-2 h-8 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {dashboardMetrics?.total_calls?.toLocaleString() || 0}
                      </p>
                    )}
                  </div>
                  <div className="bg-card ring-border rounded-lg p-4 shadow-sm ring-1">
                    <p className="text-muted-foreground text-sm">
                      Active Tools
                    </p>
                    {metricsLoading ? (
                      <Skeleton className="mt-2 h-8 w-12" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {Object.keys(dashboardMetrics?.tool_stats || {}).length}
                      </p>
                    )}
                  </div>
                  <div className="bg-card ring-border rounded-lg p-4 shadow-sm ring-1">
                    <p className="text-muted-foreground text-sm">
                      Success Rate
                    </p>
                    {metricsLoading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {dashboardMetrics?.success_rate?.toFixed(1) || 0}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-card ring-border rounded-lg p-6 shadow-sm ring-1">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                {metricsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {dashboardMetrics?.tool_stats &&
                    Object.keys(dashboardMetrics.tool_stats).length > 0 ? (
                      Object.entries(dashboardMetrics.tool_stats)
                        .sort((a, b) => b[1].calls - a[1].calls)
                        .slice(0, 3)
                        .map(([toolName, stats], index) => (
                          <div
                            key={toolName}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                index === 0
                                  ? 'bg-green-500'
                                  : index === 1
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                              }`}
                            />
                            <span className="text-muted-foreground">
                              {toolName}: {stats.calls} calls ({stats.success}{' '}
                              successful)
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="text-muted-foreground py-4 text-center">
                        No recent activity data available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="team"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            <EnhancedTeamManagement />
          </TabsContent>

          <TabsContent
            value="api-keys"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            <APIKeyManager />
          </TabsContent>

          <TabsContent
            value="analytics"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            <UsageAnalytics />
          </TabsContent>

          <TabsContent
            value="activity"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            <ContextualActivityFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
