'use client';

import { useState } from 'react';

import {
  UserIcon,
  KeyIcon,
  ClockIcon,
  CopyIcon,
  RefreshCwIcon,
  TrashIcon,
  PlusIcon,
  GridIcon,
  ListIcon,
  UsersIcon,
  ShieldIcon,
} from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'suspended';
  isOnline: boolean;
  apiKey: string;
  lastSeen: Date;
  role: 'admin' | 'developer' | 'viewer';
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
    isOnline: true,
    apiKey: 'sk_live_abc123def456...',
    lastSeen: new Date(),
    role: 'admin',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'active',
    isOnline: true,
    apiKey: 'sk_live_ghi789jkl012...',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    role: 'developer',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'suspended',
    isOnline: false,
    apiKey: 'sk_live_mno345pqr678...',
    lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    role: 'developer',
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'active',
    isOnline: false,
    apiKey: 'sk_live_stu901vwx234...',
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
    role: 'viewer',
  },
];

interface UserManagementGridProps {
  className?: string;
}

type ViewMode = 'cards' | 'table';

export default function UserManagementGrid({
  className,
}: UserManagementGridProps) {
  const [members, setMembers] = useState(mockTeamMembers);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const handleStatusToggle = (memberId: string, checked: boolean) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, status: checked ? 'active' : 'suspended' }
          : member
      )
    );
  };

  const handleCopyApiKey = (apiKey: string, memberId: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedId(memberId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateKey = (memberId: string) => {
    // Simulate key regeneration
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? {
              ...member,
              apiKey: `sk_live_new${Math.random().toString(36).substr(2, 9)}...`,
            }
          : member
      )
    );
  };

  const handleRevokeKey = (memberId: string) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, apiKey: 'Revoked', status: 'suspended' }
          : member
      )
    );
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const onlineMembers = members.filter(m => m.isOnline).length;
  const adminMembers = members.filter(m => m.role === 'admin').length;

  const stats = [
    { label: 'Total Members', value: totalMembers, trend: 'neutral' as const },
    { label: 'Active', value: activeMembers, trend: 'asc' as const },
    { label: 'Online Now', value: onlineMembers, trend: 'asc' as const },
    { label: 'Admins', value: adminMembers, trend: 'neutral' as const },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <UsersIcon className="h-5 w-5" />
              Team Management
            </CardTitle>
            <CardDescription>
              Manage team members, roles, and API access with real-time status
              monitoring
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={value => value && setViewMode(value as ViewMode)}
            >
              <ToggleGroupItem value="cards">
                <GridIcon className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table">
                <ListIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={`${stat.label}-${index}`}
              title={stat.label}
              description={`Current ${stat.label.toLowerCase()} count`}
              stats={stat.value}
              type={stat.trend}
              showTrend={false}
            />
          ))}
        </div>

        {/* Members Grid/Table View */}
        {viewMode === 'cards' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map(member => (
              <Card key={member.id} className="bg-muted">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            <UserIcon size={16} />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2',
                            member.isOnline
                              ? 'bg-emerald-500'
                              : 'bg-muted-foreground'
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold">{member.name}</h3>
                        <p className="text-muted-foreground truncate text-xs">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.role === 'admin'
                          ? 'default'
                          : member.role === 'developer'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {member.role}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
                          member.status === 'active'
                            ? 'bg-emerald-500'
                            : 'bg-red-500'
                        )}
                      />
                      <span className="text-sm">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {member.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                      <Switch
                        checked={member.status === 'active'}
                        onCheckedChange={checked =>
                          handleStatusToggle(member.id, checked)
                        }
                        aria-label={`Toggle ${member.name} status`}
                      />
                    </div>
                  </div>

                  {/* API Key Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm">
                        <KeyIcon size={14} />
                        API Key
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleCopyApiKey(member.apiKey, member.id)
                              }
                            >
                              <CopyIcon size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {copiedId === member.id
                                ? 'Copied!'
                                : 'Copy API Key'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <code className="bg-background block truncate rounded border p-2 font-mono text-xs">
                      {member.apiKey}
                    </code>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRegenerateKey(member.id)}
                        disabled={member.apiKey === 'Revoked'}
                      >
                        <RefreshCwIcon size={14} className="mr-1" />
                        Regenerate
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            disabled={member.apiKey === 'Revoked'}
                          >
                            <TrashIcon size={14} className="mr-1" />
                            Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently revoke the API key for{' '}
                              {member.name}. They will immediately lose access
                              to all MCP services.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevokeKey(member.id)}
                            >
                              Confirm Revoke
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Last Seen */}
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <ClockIcon size={12} />
                      Last seen
                    </span>
                    <span>{formatLastSeen(member.lastSeen)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <ShieldIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="mb-2 text-lg font-medium">Table View Coming Soon</p>
            <p className="text-muted-foreground mb-4 text-sm">
              Professional data table with advanced filtering and bulk
              operations
            </p>
            <Button variant="outline" onClick={() => setViewMode('cards')}>
              <GridIcon className="mr-2 h-4 w-4" />
              Switch to Cards View
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
