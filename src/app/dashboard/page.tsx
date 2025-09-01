'use client';

import { useState } from 'react';

import { LayoutDashboard, Users, Key, BarChart3, Activity } from 'lucide-react';

import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Force dynamic rendering to avoid Next.js 15.5.0 build issue
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card border-b">
        <div className="container flex h-16 items-center">
          <h1 className="text-3xl font-semibold">MCP Control Center</h1>
          <p className="text-muted-foreground ml-4">
            Manage your Model Context Protocol infrastructure
          </p>
        </div>
      </header>

      <main className="container py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/30 h-12 w-full justify-start p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-background gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className="data-[state=active]:bg-background gap-2"
            >
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-background gap-2"
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
                  <div className="bg-card rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      Active Connections
                    </p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      API Calls Today
                    </p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      Team Members
                    </p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div className="bg-card rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">Error Rate</p>
                    <p className="text-2xl font-bold">0.2%</p>
                  </div>
                </div>
              </div>
              <div className="bg-card/50 rounded-lg border p-6">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      API key created by Sarah Chen
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">
                      New MCP service deployed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">
                      Rate limit adjusted for production
                    </span>
                  </div>
                </div>
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
