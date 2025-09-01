'use client';

import { useState } from 'react';

import {
  IconPower,
  IconAlertTriangle,
  IconClock,
  IconRefresh,
} from '@tabler/icons-react';

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
  const uptimeRemainingHours = uptimeHours % 24;
  const lastRestart = new Date(
    Date.now() - uptimeHours * 60 * 60 * 1000
  ).toLocaleString();
  const status = isActive ? 'Active' : 'Inactive';

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
    <Card className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 transition-colors duration-300',
          isActive ? 'bg-green-500' : 'bg-red-500'
        )}
      />

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconPower
              size={20}
              className={isActive ? 'text-green-500' : 'text-red-500'}
            />
            MCP Service Control
          </CardTitle>
          <Badge
            variant={isActive ? 'default' : 'destructive'}
            className={cn(
              'font-semibold',
              isActive && 'bg-green-500 hover:bg-green-600'
            )}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Power Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Service Status</p>
            <p className="text-muted-foreground text-sm">
              Toggle to enable or disable the entire MCP service
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-green-500"
            aria-label="Toggle MCP service"
          />
        </div>

        {/* Service Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <IconClock size={16} />
              Uptime
            </div>
            <p className="text-2xl font-bold">
              {uptimeDays}d {uptimeRemainingHours}h
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <IconRefresh size={16} />
              Last Restart
            </div>
            <p className="text-sm font-medium">{lastRestart}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
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
                <IconRefresh className="mr-2 h-4 w-4" />
                Restart Service
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!isActive}
              >
                <IconAlertTriangle className="mr-2 h-4 w-4" />
                Emergency Stop
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency Stop</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately stop the MCP service and disconnect all
                  active users. This action should only be used in emergency
                  situations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleEmergencyStop}
                >
                  Stop Service
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
