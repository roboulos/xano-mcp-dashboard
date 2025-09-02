'use client';

import { useState } from 'react';

import {
  LayoutDashboard,
  Users,
  Key,
  ShieldIcon,
  Activity,
} from 'lucide-react';

import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Force dynamic rendering to avoid Next.js 15.0.4 prerendering issues
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

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
              <ShieldIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
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
