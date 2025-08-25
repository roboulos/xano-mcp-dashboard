import { RefreshCw } from 'lucide-react';

import { ConnectionsStatus } from '@/components/dashboard/connections-status';
import RecentActivity from '@/components/dashboard/recent-activity';
import XanoStats from '@/components/dashboard/xano-stats';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

// Force dynamic rendering to avoid Next.js 15.5.0 build issue
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Xano AI Developer Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" asChild>
              <a
                href="https://calendly.com/robertboulos/30-min"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book AI Demo
              </a>
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <XanoStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ConnectionsStatus />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RecentActivity />
            </div>
            <div className="col-span-3">
              <div className="space-y-4">
                {/* Quick Actions Card */}
                <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
                  <div className="space-y-2">
                    <a
                      href="/dashboard/settings/universe-credentials"
                      className="hover:bg-muted block rounded-md p-3 transition-colors"
                    >
                      <div className="font-medium">
                        Connect Your Xano Workspace
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Link your Xano backend to unlock AI development
                      </div>
                    </a>
                    <a
                      href="https://calendly.com/robertboulos/30-min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-muted block rounded-md p-3 transition-colors"
                    >
                      <div className="font-medium">Book AI Developer Demo</div>
                      <div className="text-muted-foreground text-sm">
                        See how AI can build your Xano backend
                      </div>
                    </a>
                    <a
                      href="/dashboard/activity"
                      className="hover:bg-muted block rounded-md p-3 transition-colors"
                    >
                      <div className="font-medium">View AI Activity</div>
                      <div className="text-muted-foreground text-sm">
                        Monitor AI development activity and API builds
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
