import AccessLogsPanel from '@/components/dashboard/access-logs-panel';
import QuickActionsBar from '@/components/dashboard/quick-actions-bar';
import ServiceStatusCard from '@/components/dashboard/service-status-card';
import UserManagementGrid from '@/components/dashboard/user-management-grid';
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
            MCP Control Center
          </h2>
          <p className="text-muted-foreground mt-2">
            Monitor and control your Model Context Protocol services and team
            access
          </p>
        </div>

        <div className="space-y-6">
          {/* Top Section - Service Control and Quick Actions */}
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceStatusCard className="lg:col-span-2" />
            <QuickActionsBar className="lg:col-span-1" />
          </div>

          {/* Middle Section - User Management */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Team Management</h3>
            <UserManagementGrid />
          </div>

          {/* Bottom Section - Access Logs */}
          <div>
            <AccessLogsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
