import { MCPConfigurations } from '@/components/dashboard/mcp-configurations';
import { Header } from '@/components/layout/header';

// Force dynamic rendering to avoid Next.js 15.5.0 build issue
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            MCP Tool Configurations
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your Model Context Protocol tool configurations and API keys
          </p>
        </div>
        <MCPConfigurations />
      </div>
    </>
  );
}
