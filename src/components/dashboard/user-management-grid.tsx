'use client';

import { useState } from 'react';

import {
  IconUser,
  IconKey,
  IconClock,
  IconCircleFilled,
  IconCopy,
  IconRefresh,
  IconTrash,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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

export default function UserManagementGrid({
  className,
}: UserManagementGridProps) {
  const [members, setMembers] = useState(mockTeamMembers);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'developer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div
      className={cn(
        'grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
        className
      )}
    >
      {members.map(member => (
        <Card key={member.id} className="relative overflow-hidden">
          {/* Online Status Indicator */}
          <div
            className={cn(
              'absolute inset-x-0 top-0 h-1 transition-colors duration-300',
              member.isOnline ? 'bg-green-500' : 'bg-gray-300'
            )}
          />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      <IconUser size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <IconCircleFilled
                    size={12}
                    className={cn(
                      'absolute right-0 bottom-0 rounded-full ring-2 ring-white',
                      member.isOnline ? 'text-green-500' : 'text-gray-400'
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground truncate text-xs">
                    {member.email}
                  </p>
                </div>
              </div>
              <Badge
                variant={getRoleBadgeVariant(member.role)}
                className="text-xs"
              >
                {member.role}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Status Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    member.status === 'active' ? 'default' : 'destructive'
                  }
                  className={cn(
                    'text-xs',
                    member.status === 'active' &&
                      'bg-green-500 hover:bg-green-600'
                  )}
                >
                  {member.status}
                </Badge>
                <Switch
                  checked={member.status === 'active'}
                  onCheckedChange={checked =>
                    handleStatusToggle(member.id, checked)
                  }
                  className="data-[state=checked]:bg-green-500"
                  aria-label={`Toggle ${member.name} status`}
                />
              </div>
            </div>

            {/* API Key Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <IconKey size={14} />
                  API Key
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() =>
                          handleCopyApiKey(member.apiKey, member.id)
                        }
                      >
                        <IconCopy size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {copiedId === member.id ? 'Copied!' : 'Copy API Key'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <code className="bg-muted block truncate rounded p-2 font-mono text-xs">
                {member.apiKey}
              </code>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1"
                  onClick={() => handleRegenerateKey(member.id)}
                  disabled={member.apiKey === 'Revoked'}
                >
                  <IconRefresh size={14} className="mr-1" />
                  Regenerate
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 flex-1"
                      disabled={member.apiKey === 'Revoked'}
                    >
                      <IconTrash size={14} className="mr-1" />
                      Revoke
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently revoke the API key for{' '}
                        {member.name}. They will lose access to all MCP services
                        immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleRevokeKey(member.id)}
                      >
                        Revoke Key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Last Seen */}
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <IconClock size={14} />
                Last seen
              </span>
              <span className="text-xs font-medium">
                {formatLastSeen(member.lastSeen)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
