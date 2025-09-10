'use client';

import { useState, useEffect } from 'react';

import {
  LayoutDashboard,
  Users,
  Key,
  ShieldIcon,
  Activity,
  Sparkles,
} from 'lucide-react';

import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceProvider, useWorkspace } from '@/contexts/workspace-context';

// Force dynamic rendering to avoid Next.js 15.0.4 prerendering issues
export const dynamic = 'force-dynamic';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  useWorkspace();

  // Handle tab changes with loading state
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;

    setIsLoading(true);
    setActiveTab(value);

    // Minimal delay to prevent flashing
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
  };

  // Force scrollbar to always be visible to prevent layout shift
  useEffect(() => {
    // Save original style
    const originalStyle = document.documentElement.style.overflowY;

    // Force scrollbar to always show
    document.documentElement.style.overflowY = 'scroll';

    // Cleanup on unmount
    return () => {
      document.documentElement.style.overflowY = originalStyle;
    };
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card/80 supports-[backdrop-filter]:bg-card/60 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                MCP Control Center
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage your Model Context Protocol infrastructure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Workshop Button */}
            <Button
              variant="secondary"
              size="sm"
              className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 hover:shadow-sm transition-all duration-200 dark:from-blue-950/50 dark:to-purple-950/50 dark:text-blue-300 dark:border-blue-800 dark:hover:from-blue-950/70 dark:hover:to-purple-950/70"
              onClick={() => window.open('https://www.snappy.ai/events', '_blank')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Join MCP Workshop
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Last sync: 2 minutes ago
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
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
              style={{ display: 'none' }}
            >
              <ShieldIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-background gap-2 transition-colors data-[state=active]:shadow-sm"
              style={{ display: 'none' }}
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" forceMount>
            <div
              className={`transition-opacity duration-300 ${activeTab !== 'overview' ? 'hidden' : ''}`}
            >
              <MCPConnectionHub />
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6" forceMount>
            <div
              className={`transition-opacity duration-300 ${activeTab !== 'team' ? 'hidden' : ''}`}
            >
              <div
                className={`relative ${isLoading ? 'pointer-events-none' : ''}`}
              >
                <EnhancedTeamManagement />
                {isLoading && (
                  <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-muted-foreground animate-pulse">
                      Loading team...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6" forceMount>
            <div
              className={`transition-opacity duration-300 ${activeTab !== 'api-keys' ? 'hidden' : ''}`}
            >
              <div
                className={`relative ${isLoading ? 'pointer-events-none' : ''}`}
              >
                <APIKeyManager />
                {isLoading && (
                  <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-muted-foreground animate-pulse">
                      Loading API keys...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="analytics"
            className="space-y-6"
            forceMount
            style={{ display: 'none' }}
          >
            <UsageAnalytics />
          </TabsContent>

          <TabsContent
            value="activity"
            className="space-y-6"
            forceMount
            style={{ display: 'none' }}
          >
            <ContextualActivityFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <WorkspaceProvider>
      <DashboardContent />
    </WorkspaceProvider>
  );
}
