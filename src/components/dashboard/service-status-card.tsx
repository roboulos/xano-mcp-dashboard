'use client';

import { useState } from 'react';

import {
  IconAlertTriangle,
  IconBolt,
  IconClock,
  IconRefresh,
  IconServer,
  IconServerOff,
} from '@tabler/icons-react';

import StatsCard from './stats-card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ServiceStatusCardProps {
  className?: string;
}

export default function ServiceStatusCard({
  className,
}: ServiceStatusCardProps) {
  const [isActive, setIsActive] = useState(true);
  const [isRestarting, setIsRestarting] = useState(false);

  // Mock data
  const uptimeHours = 127;
  const uptimeDays = Math.floor(uptimeHours / 24);
  const lastRestart = new Date(
    Date.now() - uptimeHours * 60 * 60 * 1000
  ).toLocaleString();
  const status = isActive ? 'Operational' : 'Offline';
  const apiCalls = 1247;
  const avgResponseTime = 127;

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    // Simulate restart
    setTimeout(() => {
      setIsRestarting(false);
      setIsActive(true);
    }, 2000);
  };

  const handleEmergencyStop = () => {
    setIsActive(false);
  };

  return (
    <Card className={cn('bg-muted', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {isActive ? (
                <IconServer size={20} className="text-emerald-500" />
              ) : (
                <IconServerOff size={20} className="text-red-500" />
              )}
              Service Infrastructure
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Primary MCP cluster status and controls
            </p>
          </div>
          <Badge variant={isActive ? 'default' : 'destructive'}>{status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    isActive ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                />
                <div>
                  <p className="font-semibold">Service Controller</p>
                  <p className="text-muted-foreground text-sm">
                    Master switch for all MCP operations
                  </p>
                </div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                aria-label="Toggle MCP service"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid using StatsCard */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Uptime"
            description="Service uptime in days"
            stats={`${uptimeDays}d`}
            type="asc"
            showTrend={true}
            profitPercentage={99.9}
            profitNumber="SLA"
          />
          <StatsCard
            title="API Calls"
            description="Total API calls today"
            stats={apiCalls}
            type="asc"
            showTrend={true}
            profitPercentage={12.5}
            profitNumber={147}
          />
          <StatsCard
            title="Response Time"
            description="Average response time"
            stats={`${avgResponseTime}ms`}
            type="des"
            showTrend={true}
            profitPercentage={-5.2}
            profitNumber="-7ms"
          />
          <StatsCard
            title="SLA"
            description="Service level agreement"
            stats="99.9"
            sign="percent"
            type="neutral"
          />
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleRestart}
            disabled={!isActive || isRestarting}
          >
            {isRestarting ? (
              <>
                <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
                Restarting...
              </>
            ) : (
              <>
                <IconBolt className="mr-2 h-4 w-4" />
                Quick Restart
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isActive}>
                <IconAlertTriangle className="mr-2 h-4 w-4" />
                Emergency Stop
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency Stop</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately terminate all MCP services and
                  disconnect all active connections. Use only in critical
                  situations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEmergencyStop}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Stop
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Last Activity */}
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <IconClock size={14} />
          <span>Last restart: {formatLastRestart(lastRestart)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function formatLastRestart(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays} days ago`;
  }
}
