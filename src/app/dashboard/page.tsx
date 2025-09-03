'use client';

import { useState, useEffect } from 'react';

import {
  LayoutDashboard,
  Users,
  Key,
  ShieldIcon,
  Activity,
  Building2,
} from 'lucide-react';

import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceProvider, useWorkspace } from '@/contexts/workspace-context';

// Force dynamic rendering to avoid Next.js 15.0.4 prerendering issues
export const dynamic = 'force-dynamic';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();

  // Handle tab changes with loading state
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;

    setIsLoading(true);
    setActiveTab(value);

    // Small delay to simulate loading and ensure consistent layout
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
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
            <Building2 className="text-primary h-8 w-8" />
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
            <Select
              value={currentWorkspace?.id.toString() || ''}
              onValueChange={value => {
                const workspace = workspaces.find(
                  w => w.id.toString() === value
                );
                if (workspace) setCurrentWorkspace(workspace);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select workspace...">
                  {currentWorkspace?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workspaces.map(workspace => (
                  <SelectItem
                    key={workspace.id}
                    value={workspace.id.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{workspace.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({workspace.subscription_plan})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {isLoading ? (
              <div className="min-h-[600px] animate-pulse space-y-4">
                <div className="bg-muted/40 h-20 rounded-lg" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-muted/40 h-64 rounded-lg" />
                  <div className="bg-muted/40 h-64 rounded-lg" />
                  <div className="bg-muted/40 h-64 rounded-lg" />
                </div>
              </div>
            ) : (
              <EnhancedTeamManagement />
            )}
          </TabsContent>

          <TabsContent
            value="api-keys"
            className="animate-in fade-in-50 space-y-6 duration-500"
          >
            {isLoading ? (
              <div className="min-h-[600px] animate-pulse space-y-4">
                <div className="bg-muted/40 h-32 rounded-lg" />
                <div className="bg-muted/40 h-16 rounded-lg" />
                <div className="bg-muted/40 h-96 rounded-lg" />
              </div>
            ) : (
              <APIKeyManager />
            )}
          </TabsContent>

          <TabsContent
            value="analytics"
            className="animate-in fade-in-50 space-y-6 duration-500"
            style={{ display: 'none' }}
          >
            <UsageAnalytics />
          </TabsContent>

          <TabsContent
            value="activity"
            className="animate-in fade-in-50 space-y-6 duration-500"
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
