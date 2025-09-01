'use client';

import { useState, useEffect } from 'react';

import {
  IconActivity,
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconRefresh,
  IconKey,
  IconLogin,
  IconLogout,
  IconShieldCheck,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type LogType = 'success' | 'error' | 'warning' | 'info';
type LogAction =
  | 'login'
  | 'logout'
  | 'api_call'
  | 'key_regenerated'
  | 'permission_denied'
  | 'service_restart';

interface LogEntry {
  id: string;
  user: string;
  userEmail: string;
  action: LogAction;
  type: LogType;
  message: string;
  timestamp: Date;
  details?: string;
}

// Mock data generator
const generateMockLogs = (): LogEntry[] => {
  const users = [
    { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { name: 'Michael Chen', email: 'michael.chen@company.com' },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com' },
    { name: 'David Park', email: 'david.park@company.com' },
  ];

  const actions: { action: LogAction; type: LogType; messages: string[] }[] = [
    {
      action: 'login',
      type: 'success',
      messages: ['User logged in successfully', 'Authentication successful'],
    },
    {
      action: 'logout',
      type: 'info',
      messages: ['User logged out', 'Session terminated'],
    },
    {
      action: 'api_call',
      type: 'success',
      messages: [
        'API endpoint accessed',
        'Data retrieved successfully',
        'Request processed',
      ],
    },
    {
      action: 'key_regenerated',
      type: 'warning',
      messages: ['API key regenerated', 'New API key issued'],
    },
    {
      action: 'permission_denied',
      type: 'error',
      messages: [
        'Permission denied',
        'Unauthorized access attempt',
        'Access restricted',
      ],
    },
    {
      action: 'service_restart',
      type: 'info',
      messages: ['Service restarted', 'System maintenance performed'],
    },
  ];

  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const actionData = actions[Math.floor(Math.random() * actions.length)];
    const message =
      actionData.messages[
        Math.floor(Math.random() * actionData.messages.length)
      ];

    logs.push({
      id: `log-${i}`,
      user: user.name,
      userEmail: user.email,
      action: actionData.action,
      type: actionData.type,
      message: message,
      timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
      details:
        Math.random() > 0.5
          ? `IP: 192.168.1.${Math.floor(Math.random() * 255)}`
          : undefined,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

interface AccessLogsPanelProps {
  className?: string;
}

export default function AccessLogsPanel({ className }: AccessLogsPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate adding a new log entry
      const users = [
        { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
        { name: 'Michael Chen', email: 'michael.chen@company.com' },
      ];
      const user = users[Math.floor(Math.random() * users.length)];

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        user: user.name,
        userEmail: user.email,
        action: 'api_call',
        type: 'success',
        message: 'Real-time update: API endpoint accessed',
        timestamp: new Date(),
      };

      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs(generateMockLogs());
      setIsRefreshing(false);
    }, 1000);
  };

  const getActionIcon = (action: LogAction) => {
    switch (action) {
      case 'login':
        return <IconLogin size={14} />;
      case 'logout':
        return <IconLogout size={14} />;
      case 'api_call':
        return <IconActivity size={14} />;
      case 'key_regenerated':
        return <IconKey size={14} />;
      case 'permission_denied':
        return <IconShieldCheck size={14} />;
      case 'service_restart':
        return <IconRefresh size={14} />;
      default:
        return <IconInfoCircle size={14} />;
    }
  };

  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case 'success':
        return <IconCircleCheck size={16} className="text-green-500" />;
      case 'error':
        return <IconAlertCircle size={16} className="text-red-500" />;
      case 'warning':
        return <IconAlertCircle size={16} className="text-yellow-500" />;
      case 'info':
        return <IconInfoCircle size={16} className="text-blue-500" />;
    }
  };

  const getTypeBadgeVariant = (type: LogType) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconActivity size={20} />
            Access Logs
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Auto-refresh
              </span>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-green-500"
                aria-label="Toggle auto-refresh"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8"
            >
              <IconRefresh
                size={16}
                className={cn('mr-1', isRefreshing && 'animate-spin')}
              />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {logs.map(log => (
              <div
                key={log.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  'hover:bg-muted/50',
                  log.type === 'error' && 'border-red-200 dark:border-red-900',
                  log.type === 'warning' &&
                    'border-yellow-200 dark:border-yellow-900'
                )}
              >
                <div className="mt-0.5">{getTypeIcon(log.type)}</div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{log.user}</span>
                        <Badge
                          variant={getTypeBadgeVariant(log.type)}
                          className="text-xs"
                        >
                          <span className="mr-1">
                            {getActionIcon(log.action)}
                          </span>
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {log.details}
                        </p>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
