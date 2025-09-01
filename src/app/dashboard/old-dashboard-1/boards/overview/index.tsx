import AccessLogsPanel from '@/components/dashboard/access-logs-panel';
import QuickActionsBar from '@/components/dashboard/quick-actions-bar';
import ServiceStatusCard from '@/components/dashboard/service-status-card';
import UserManagementGrid from '@/components/dashboard/user-management-grid';

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Top Section - Service Control and Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <ServiceStatusCard className="lg:col-span-2" />
        <QuickActionsBar className="lg:col-span-1" />
      </div>

      {/* Middle Section - User Management */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Team Management</h2>
        <UserManagementGrid />
      </div>

      {/* Bottom Section - Access Logs */}
      <div>
        <AccessLogsPanel />
      </div>
    </div>
  );
}
