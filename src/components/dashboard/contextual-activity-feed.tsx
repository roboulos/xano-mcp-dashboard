'use client';

import { useState, useMemo } from 'react';

import {
  SearchIcon,
  UserIcon,
  DatabaseIcon,
  FunctionSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  ClockIcon,
  RefreshCwIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityFeed, ActivityEvent } from '@/hooks/use-activity-feed';
import { cn } from '@/lib/utils';

interface ContextualActivityFeedProps {
  className?: string;
}

export default function ContextualActivityFeed({
  className,
}: ContextualActivityFeedProps) {
  const { data: activities, loading, error, refetch } = useActivityFeed(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('7d');
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getActivityIcon = (
    type: ActivityEvent['type'],
    status: ActivityEvent['status']
  ) => {
    const iconClass = cn(
      'h-4 w-4',
      status === 'success' && 'text-emerald-600',
      status === 'error' && 'text-red-600',
      status === 'warning' && 'text-orange-600',
      status === 'info' && 'text-blue-600'
    );

    switch (type) {
      case 'database':
        return <DatabaseIcon className={iconClass} />;
      case 'function':
        return <FunctionSquareIcon className={iconClass} />;
      case 'api':
        return <ExternalLinkIcon className={iconClass} />;
      default:
        return <ClockIcon className={iconClass} />;
    }
  };

  const getStatusIcon = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-emerald-600" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircleIcon className="h-4 w-4 text-orange-600" />;
      default:
        return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    return activities.filter(activity => {
      const matchesSearch =
        activity.userFriendlyDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || activity.type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' || activity.status === statusFilter;

      // Time filter logic
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - activity.timestamp.getTime()) / (1000 * 60 * 60)
      );
      let matchesTime = true;

      switch (timeFilter) {
        case '1h':
          matchesTime = diffHours < 1;
          break;
        case '24h':
          matchesTime = diffHours < 24;
          break;
        case '7d':
          matchesTime = diffHours < 168;
          break;
        case '30d':
          matchesTime = diffHours < 720;
          break;
      }

      return matchesSearch && matchesType && matchesStatus && matchesTime;
    });
  }, [activities, searchQuery, typeFilter, statusFilter, timeFilter]);

  const errorCount = activities?.filter(a => a.status === 'error').length || 0;
  const warningCount =
    activities?.filter(a => a.status === 'warning').length || 0;
  const highImpactCount =
    activities?.filter(a => a.impact === 'high').length || 0;
  const recentCount =
    activities?.filter(a => Date.now() - a.timestamp.getTime() < 60 * 60 * 1000)
      .length || 0;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Activity Feed</CardTitle>
          <CardDescription>Loading activity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Activity Feed</CardTitle>
          <CardDescription>Error loading activity data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          <Button
            onClick={handleRefresh}
            className="mt-4"
            variant="outline"
            size="sm"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Activity Feed</CardTitle>
            <CardDescription>
              Real-time MCP tool usage and system events
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              size="sm"
            >
              <RefreshCwIcon
                className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
              />
            </Button>
            <div className="flex items-center gap-4 text-sm">
              {errorCount > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircleIcon className="h-3 w-3" />
                  {errorCount} errors
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertCircleIcon className="h-3 w-3" />
                  {warningCount} warnings
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{activities?.length || 0}</p>
            <p className="text-muted-foreground text-xs">Total Events</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{recentCount}</p>
            <p className="text-muted-foreground text-xs">Last Hour</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
            <p className="text-muted-foreground text-xs">Errors</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {highImpactCount}
            </p>
            <p className="text-muted-foreground text-xs">High Impact</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="function">Function</SelectItem>
              <SelectItem value="auth">Auth</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity List */}
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {filteredActivities.map(activity => (
            <Card
              key={activity.id}
              className="cursor-pointer transition-all hover:shadow-sm"
              onClick={() => setSelectedActivity(activity)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex items-center gap-2">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.userFriendlyDescription}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {activity.userName && (
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={activity.userAvatar} />
                                <AvatarFallback>
                                  <UserIcon className="h-2 w-2" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground text-xs">
                                {activity.userName}
                              </span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          {activity.impact === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              High Impact
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        {getStatusIcon(activity.status)}
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Technical Details (collapsed) */}
                    <div className="text-muted-foreground mt-2 text-xs">
                      {activity.metadata.tool && (
                        <code className="bg-muted rounded px-1">
                          {activity.metadata.tool}
                        </code>
                      )}
                      {activity.metadata.callCount !== undefined && (
                        <span className="ml-2">
                          {activity.metadata.callCount} calls
                        </span>
                      )}
                      {activity.metadata.avgResponseTime !== undefined && (
                        <span className="ml-2">
                          {Math.round(activity.metadata.avgResponseTime)}ms avg
                        </span>
                      )}
                      {activity.metadata.errorCount !== undefined &&
                        activity.metadata.errorCount > 0 && (
                          <span className="ml-2 text-red-600">
                            {activity.metadata.errorCount} errors
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            <ClockIcon className="mx-auto mb-2 h-8 w-8" />
            <p>No activities found</p>
            <p className="text-sm">
              {activities && activities.length === 0
                ? 'No activity data available yet'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}

        {/* Activity Detail Modal */}
        <Dialog
          open={!!selectedActivity}
          onOpenChange={() => setSelectedActivity(null)}
        >
          <DialogContent className="max-w-lg">
            {selectedActivity && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getActivityIcon(
                      selectedActivity.type,
                      selectedActivity.status
                    )}
                    Activity Details
                  </DialogTitle>
                  <DialogDescription>
                    {selectedActivity.userFriendlyDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Technical Details</h4>
                    <code className="bg-muted block rounded p-3 text-xs">
                      {selectedActivity.description}
                    </code>
                  </div>

                  {selectedActivity.metadata.errorMessage && (
                    <div>
                      <h4 className="mb-2 font-medium text-red-600">
                        Error Details
                      </h4>
                      <div className="rounded border border-red-200 bg-red-50 p-3">
                        <p className="font-mono text-sm text-red-800">
                          {selectedActivity.metadata.errorMessage}
                        </p>
                        {selectedActivity.metadata.errorCode && (
                          <p className="mt-1 text-xs text-red-600">
                            Code: {selectedActivity.metadata.errorCode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">
                        {selectedActivity.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium capitalize">
                        {selectedActivity.status}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <p className="font-medium capitalize">
                        {selectedActivity.impact}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">
                        {selectedActivity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedActivity.metadata.relatedResources && (
                    <div>
                      <h4 className="mb-2 font-medium">Related Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.metadata.relatedResources.map(
                          resource => (
                            <Badge key={resource} variant="outline">
                              {resource}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
