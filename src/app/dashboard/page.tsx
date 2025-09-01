import APIKeyManager from '@/components/dashboard/api-key-manager';
import ContextualActivityFeed from '@/components/dashboard/contextual-activity-feed';
import EnhancedTeamManagement from '@/components/dashboard/enhanced-team-management';
import MCPConnectionHub from '@/components/dashboard/mcp-connection-hub';
import UsageAnalytics from '@/components/dashboard/usage-analytics';

// Force dynamic rendering to avoid Next.js 15.5.0 build issue
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
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

      <main className="container space-y-6 py-6">
        {/* Improved grid weights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <MCPConnectionHub className="lg:col-span-2" />
          <EnhancedTeamManagement className="lg:col-span-1" />
        </div>

        <APIKeyManager />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <UsageAnalytics />
          </div>
          <div className="xl:col-span-1">
            <ContextualActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
