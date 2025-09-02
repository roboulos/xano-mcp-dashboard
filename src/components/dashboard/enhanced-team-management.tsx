'use client';

import React, { useState } from 'react';

import {
  PlusIcon,
  KeyIcon,
  ClockIcon,
  CopyIcon,
  RefreshCwIcon,
  TrashIcon,
  MailIcon,
  ActivityIcon,
  TrendingUpIcon,
  CheckIcon,
} from 'lucide-react';

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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useDashboardMetrics } from '@/hooks/use-dashboard-data';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  isOnline: boolean;
  apiKey: string;
  lastSeen: Date;
  role: 'admin' | 'developer' | 'viewer';
  totalCalls: number;
  callsToday: number;
  successRate: number;
  joinedAt: Date;
}

interface EnhancedTeamManagementProps {
  className?: string;
}

export default function EnhancedTeamManagement({
  className,
}: EnhancedTeamManagementProps) {
  const { user } = useAuth();
  const { data: dashboardMetrics } = useDashboardMetrics('week');

  // Create a real team member from the current user
  const currentUserMember: TeamMember = {
    id: user?.id?.toString() || '1',
    name: user?.name || 'Current User',
    email: user?.email || 'user@example.com',
    status: 'active',
    isOnline: true,
    apiKey: 'xano_key_current_****',
    lastSeen: new Date(),
    role: 'admin',
    totalCalls: dashboardMetrics?.total_calls || 0,
    callsToday: Math.floor((dashboardMetrics?.total_calls || 0) / 7), // Approximate daily calls
    successRate: dashboardMetrics?.success_rate || 100,
    joinedAt: new Date(user?.created_at || Date.now()),
  };

  const [members, setMembers] = useState([currentUserMember]);

  // Update members when metrics change
  React.useEffect(() => {
    if (user && dashboardMetrics) {
      const updatedMember: TeamMember = {
        id: user.id?.toString() || '1',
        name: user.name || 'Current User',
        email: user.email || 'user@example.com',
        status: 'active',
        isOnline: true,
        apiKey: 'xano_key_current_****',
        lastSeen: new Date(),
        role: 'admin',
        totalCalls: dashboardMetrics.total_calls || 0,
        callsToday: Math.floor((dashboardMetrics.total_calls || 0) / 7),
        successRate: dashboardMetrics.success_rate || 100,
        joinedAt: new Date(user.created_at || Date.now()),
      };
      setMembers([updatedMember]);
    }
  }, [user, dashboardMetrics]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memberFilter, setMemberFilter] = useState<
    'all' | 'active' | 'suspended' | 'pending'
  >('all');

  const filteredMembers = members.filter(member => {
    if (memberFilter === 'all') return true;
    return member.status === memberFilter;
  });
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer' as 'admin' | 'developer' | 'viewer',
    message:
      "You've been invited to join our MCP server team. Click the link below to get started.",
  });

  const handleInvite = () => {
    // Simulate sending invitation
    // Sending invitation to: inviteForm

    // Add pending member
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteForm.email.split('@')[0],
      email: inviteForm.email,
      status: 'pending',
      isOnline: false,
      apiKey: 'Pending activation...',
      lastSeen: new Date(),
      role: inviteForm.role,
      totalCalls: 0,
      callsToday: 0,
      successRate: 0,
      joinedAt: new Date(),
    };

    setMembers(prev => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteForm({
      email: '',
      role: 'developer',
      message:
        "You've been invited to join our MCP server team. Click the link below to get started.",
    });
  };

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
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? {
              ...member,
              apiKey: `xano_key_new${Math.random().toString(36).substr(2, 9)}...`,
            }
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

  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalCalls = members.reduce((sum, m) => sum + m.callsToday, 0);

  return (
    <div className={className}>
      {/* Header with Metrics */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Team Management</h2>
          <p className="text-muted-foreground text-sm">
            Invite, manage, and monitor your team members
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-muted-foreground text-sm">
                {activeMembers} active
              </span>
            </div>
            <p className="text-lg font-semibold">{totalCalls} calls today</p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your MCP server team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={e =>
                      setInviteForm(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={value =>
                      setInviteForm(prev => ({
                        ...prev,
                        role: value as 'admin' | 'developer' | 'viewer',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">
                        Viewer - Read-only access
                      </SelectItem>
                      <SelectItem value="developer">
                        Developer - Full API access
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin - Full management access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={inviteForm.message}
                    onChange={e =>
                      setInviteForm(prev => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Add a personal note..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={!inviteForm.email}>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2">
        {['all', 'active', 'suspended', 'pending'].map(filter => (
          <Button
            key={filter}
            size="sm"
            variant={memberFilter === filter ? 'default' : 'outline'}
            onClick={() =>
              setMemberFilter(
                filter as 'all' | 'active' | 'suspended' | 'pending'
              )
            }
            className="capitalize"
          >
            {filter}{' '}
            {filter !== 'all' &&
              `(${members.filter(m => m.status === filter).length})`}
          </Button>
        ))}
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length > 0 ? (
        <div
          className={cn(
            'grid gap-3',
            filteredMembers.length === 1
              ? 'max-w-sm'
              : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          {filteredMembers.map(member => (
            <Card
              key={member.id}
              className="hover:shadow-medium relative overflow-hidden transition-all"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-medium">
                      {member.name}
                    </h4>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </p>
                  </div>
                  <Badge
                    variant={member.role === 'admin' ? 'default' : 'outline'}
                    className={cn(
                      'text-xs',
                      member.role !== 'admin' ? 'text-muted-foreground' : ''
                    )}
                  >
                    {member.role}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Activity Metrics */}
                <div className="bg-muted/50 grid grid-cols-2 gap-2 rounded-lg px-4 py-2.5">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5">
                      <ActivityIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold">
                        {member.callsToday}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">Today</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5">
                      <TrendingUpIcon className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-bold">
                        {member.successRate}%
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">Success</p>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        member.status === 'active'
                          ? 'bg-emerald-500'
                          : member.status === 'pending'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                      )}
                    />
                    <span className="text-xs capitalize">{member.status}</span>
                  </div>
                  {member.status !== 'pending' && (
                    <Switch
                      checked={member.status === 'active'}
                      onCheckedChange={checked =>
                        handleStatusToggle(member.id, checked)
                      }
                      aria-label={`Toggle ${member.name} status`}
                    />
                  )}
                </div>

                {/* API Key Section */}
                {member.status !== 'pending' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs">
                        <KeyIcon size={12} />
                        API Key
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          handleCopyApiKey(member.apiKey, member.id)
                        }
                        aria-label={
                          copiedId === member.id ? 'Copied' : 'Copy API key'
                        }
                      >
                        {copiedId === member.id ? (
                          <CheckIcon size={14} className="text-green-600" />
                        ) : (
                          <CopyIcon size={14} />
                        )}
                      </Button>
                    </div>
                    <code className="bg-muted/50 block truncate rounded border px-2 py-1 font-mono text-xs">
                      {member.apiKey}
                    </code>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 flex-1 text-xs"
                        onClick={() => handleRegenerateKey(member.id)}
                      >
                        <RefreshCwIcon size={12} className="mr-1" />
                        Regenerate
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 flex-1 text-xs"
                          >
                            <TrashIcon size={12} className="mr-1" />
                            Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently revoke access for{' '}
                              {member.name}. They will immediately lose access
                              to all MCP services.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleStatusToggle(member.id, false)
                              }
                            >
                              Confirm Revoke
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}

                {/* Last Seen */}
                <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
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
        <div className="text-muted-foreground bg-muted/30 mt-6 rounded-lg border p-8 text-center text-sm">
          <p>No members match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
