'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Power,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  PlayCircle,
  Star,
  Database,
  Activity,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type MCPConfiguration } from '@/types/mcp-config';

interface MCPConfigurationCardProps {
  config: MCPConfiguration;
  onSetActive?: (id: string) => void;
  onEdit?: (config: MCPConfiguration) => void;
  onDelete?: (id: string) => void;
  onTestConnection?: (id: string) => void;
}

const getStatusConfig = (status: MCPConfiguration['status']) => {
  switch (status) {
    case 'connected':
      return {
        icon: CheckCircle,
        text: 'Connected',
        variant: 'default' as const,
        color: 'text-green-600 dark:text-green-400',
      };
    case 'error':
      return {
        icon: XCircle,
        text: 'Connection Error',
        variant: 'destructive' as const,
        color: 'text-red-600 dark:text-red-400',
      };
    case 'testing':
      return {
        icon: Clock,
        text: 'Testing...',
        variant: 'secondary' as const,
        color: 'text-yellow-600 dark:text-yellow-400',
      };
    case 'inactive':
      return {
        icon: Power,
        text: 'Inactive',
        variant: 'outline' as const,
        color: 'text-gray-600 dark:text-gray-400',
      };
  }
};

export function MCPConfigurationCard({
  config,
  onSetActive,
  onEdit,
  onDelete,
  onTestConnection,
}: MCPConfigurationCardProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const statusConfig = getStatusConfig(config.status);
  const StatusIcon = statusConfig.icon;

  const maskedApiKey = config.apiKey
    ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`
    : '';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card
      className={`relative transition-all duration-200 ${
        config.isActive
          ? 'ring-2 ring-primary/20 border-primary/30 bg-primary/5'
          : 'hover:border-primary/20'
      }`}
    >
      {config.isActive && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-primary/90 text-primary-foreground">
            <Star className="mr-1 h-3 w-3 fill-current" />
            Active
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{config.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
              {statusConfig.text}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!config.isActive && (
                <>
                  <DropdownMenuItem onClick={() => onSetActive?.(config.id)}>
                    <Star className="mr-2 h-4 w-4" />
                    Set as Active
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onTestConnection?.(config.id)}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Test Connection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(config)}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Configuration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(config.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Configuration Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Workspace</span>
            <span className="text-sm text-muted-foreground">{config.workspace}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Key</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">
                {showApiKey ? config.apiKey : maskedApiKey}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="h-6 w-6 p-0"
              >
                {showApiKey ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API URL</span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {config.apiUrl}
            </span>
          </div>
        </div>

        {/* Connection Preview */}
        {config.status === 'connected' && config.preview && (
          <div className="border-t pt-3 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Connection Preview</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {config.preview.totalEndpoints && (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">{config.preview.totalEndpoints}</span>
                  <span className="text-muted-foreground">endpoints</span>
                </div>
              )}
              {config.preview.totalTables && (
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="font-medium">{config.preview.totalTables}</span>
                  <span className="text-muted-foreground">tables</span>
                </div>
              )}
            </div>
            {config.lastConnected && (
              <div className="text-xs text-muted-foreground">
                Last connected: {formatDate(config.lastConnected)}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={config.isActive ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onTestConnection?.(config.id)}
            disabled={config.status === 'testing'}
            className="flex-1"
          >
            {config.status === 'testing' ? (
              <Clock className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Test Connection
          </Button>
          {!config.isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetActive?.(config.id)}
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}