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
  Copy,
  Check,
  AlertCircle,
  Loader2,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
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
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const { toast } = useToast();
  const statusConfig = getStatusConfig(config.status);
  const StatusIcon = statusConfig.icon;

  const maskedApiKey = config.apiKey
    ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`
    : '';

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(config.apiKey);
      setCopiedApiKey(true);
      toast({
        title: 'API Key Copied',
        description: 'The API key has been copied to your clipboard.',
      });
      setTimeout(() => setCopiedApiKey(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try copying the API key manually.',
        variant: 'destructive',
      });
    }
  };

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
      className={`relative transition-all duration-200 hover:shadow-lg ${
        config.isActive
          ? 'ring-primary border-primary from-primary/5 to-primary/10 bg-gradient-to-br shadow-md ring-2'
          : 'hover:border-primary/40 hover:shadow-md'
      }`}
    >
      {config.isActive && (
        <div className="animate-in fade-in zoom-in absolute -top-3 -right-3 duration-300">
          <Badge className="bg-primary text-primary-foreground py-1 pr-3 pl-2 shadow-lg">
            <div className="relative mr-1.5">
              <Star className="h-3.5 w-3.5 fill-current" />
              <div className="absolute inset-0 h-3.5 w-3.5 animate-pulse rounded-full bg-white/30" />
            </div>
            Active
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{config.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <div className="relative">
                <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                {config.status === 'connected' && (
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full bg-green-500" />
                )}
                {config.status === 'testing' && (
                  <div className="absolute inset-0">
                    <StatusIcon
                      className={`h-4 w-4 ${statusConfig.color} animate-spin`}
                    />
                  </div>
                )}
              </div>
              {statusConfig.text}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Settings className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
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
            <span className="text-muted-foreground text-sm">
              {config.workspace}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Key</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground font-mono text-sm select-none">
                {showApiKey ? config.apiKey : maskedApiKey}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="hover:bg-primary/10 h-7 w-7 p-0"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showApiKey ? 'Hide' : 'Show'} API Key</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyApiKey}
                      className="hover:bg-primary/10 h-7 w-7 p-0"
                    >
                      {copiedApiKey ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedApiKey ? 'Copied!' : 'Copy API Key'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API URL</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground max-w-[200px] cursor-help truncate text-sm">
                    {config.apiUrl}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono text-xs">{config.apiUrl}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Connection Preview */}
        {config.status === 'connected' && config.preview && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-2 border-t pt-3 duration-300">
            <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              Connection Details
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {config.preview.totalEndpoints && (
                <div className="bg-primary/5 hover:bg-primary/10 flex items-center gap-2 rounded-md p-2 transition-colors">
                  <Activity className="text-primary h-4 w-4" />
                  <span className="font-medium">
                    {config.preview.totalEndpoints}
                  </span>
                  <span className="text-muted-foreground">endpoints</span>
                </div>
              )}
              {config.preview.totalTables && (
                <div className="bg-primary/5 hover:bg-primary/10 flex items-center gap-2 rounded-md p-2 transition-colors">
                  <Database className="text-primary h-4 w-4" />
                  <span className="font-medium">
                    {config.preview.totalTables}
                  </span>
                  <span className="text-muted-foreground">tables</span>
                </div>
              )}
            </div>
            {config.lastConnected && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                Last connected: {formatDate(config.lastConnected)}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {config.status === 'error' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 border-t pt-3 duration-300">
            <div className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-md p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Connection Failed</p>
                <p className="text-xs opacity-80">
                  Check your API key and URL, then try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={config.isActive ? 'secondary' : 'default'}
                  size="sm"
                  onClick={() => onTestConnection?.(config.id)}
                  disabled={config.status === 'testing'}
                  className="flex-1 transition-all"
                >
                  {config.status === 'testing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  )}
                  Test Connection
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Verify that this configuration can connect to Xano</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!config.isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetActive?.(config.id)}
                    className="hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set as active configuration for MCP tools</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

