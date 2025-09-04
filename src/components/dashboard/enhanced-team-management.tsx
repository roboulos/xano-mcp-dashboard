'use client';

import React, { useState, useMemo } from 'react';

import {
  PlusIcon,
  KeyIcon,
  ClockIcon,
  MailIcon,
  ActivityIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

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
import { useWorkspace } from '@/contexts/workspace-context';
import {
  useDashboardMetrics,
  useDailyMetrics,
  useXanoCredentials,
  useWorkspaceMembers,
} from '@/hooks/use-dashboard-data';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  isOnline: boolean;
  assignedCredentialId?: number;
  lastSeen: Date;
  role: 'admin' | 'developer' | 'viewer';
  totalCalls: number;
  callsToday: number;
  successRate: number;
  joinedAt: Date;
  isCurrentUser: boolean;
}

interface EnhancedTeamManagementProps {
  className?: string;
}

export default function EnhancedTeamManagement({
  className,
}: EnhancedTeamManagementProps) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { data: dashboardMetrics } = useDashboardMetrics('week');
  const { data: dailyMetrics } = useDailyMetrics();
  const { data: credentials } = useXanoCredentials();
  const {
    data: workspaceMembers,
    assignMemberToCredential,
    unassignMemberFromCredential,
  } = useWorkspaceMembers(currentWorkspace?.id || 0); // Use 0 if no workspace selected to avoid defaulting to 5

  // Transform workspace members into team members format
  const transformedMembers = useMemo(() => {
    if (!workspaceMembers || workspaceMembers.length === 0) {
      // If no workspace members, use current user as default
      return [
        {
          id: user?.id?.toString() || '1',
          name: user?.name || 'Current User',
          email: user?.email || 'user@example.com',
          status: 'active' as const,
          isOnline: true,
          assignedCredentialId: undefined,
          lastSeen: new Date(),
          role: 'admin' as const,
          totalCalls: dashboardMetrics?.total_calls || 0,
          callsToday: dailyMetrics?.calls_today || 0,
          successRate: dashboardMetrics?.success_rate || 100,
          joinedAt: new Date(user?.created_at || Date.now()),
          isCurrentUser: true,
        },
      ];
    }

    return workspaceMembers.map(member => {
      // Try to get a meaningful name for the member
      let memberName = `Member ${member.id}`;
      let memberEmail = member.user_id;

      // If this member's user_id matches our current user, use their info
      if (user && member.user_id === user.id) {
        memberName = user.name || 'Current User';
        memberEmail = user.email || member.user_id;
      } else {
        // Try to extract name from email if it looks like an email
        const emailMatch = member.user_id.match(/^([^@]+)@/);
        if (emailMatch) {
          // It's an email, use it as email and derive name
          memberEmail = member.user_id;
          const emailPart = emailMatch[1];
          // Convert email username to readable name (e.g., "john.doe" -> "John Doe")
          memberName = emailPart
            .split(/[._-]/)
            .map(
              part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(' ');
        } else {
          // If it's not an email (like a UUID), use it as is but show Member X format
          memberEmail = member.user_id;
          memberName = `Member ${member.id}`;
        }
      }

      return {
        id: member.id.toString(),
        name: memberName,
        email: memberEmail,
        status:
          member.status === 'active'
            ? ('active' as const)
            : member.status === 'invited'
              ? ('pending' as const)
              : ('suspended' as const),
        isOnline: member.status === 'active',
        assignedCredentialId: member.credential_ref,
        lastSeen: new Date(),
        role:
          member.role === 'owner' || member.role === 'admin'
            ? ('admin' as const)
            : member.role === 'viewer'
              ? ('viewer' as const)
              : ('developer' as const),
        totalCalls: 0, // We'll get this from metrics later
        callsToday: 0,
        successRate: 100,
        joinedAt: new Date(member.created_at * 1000), // Convert timestamp to Date
        isCurrentUser: !!(user && member.user_id === user.id),
      };
    });
  }, [workspaceMembers, user, dashboardMetrics, dailyMetrics]);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [assigningCredential, setAssigningCredential] = useState<string | null>(
    null
  );
  const [expandedControls, setExpandedControls] = useState<
    Record<string, boolean>
  >({});

  // Update members when workspace members change
  React.useEffect(() => {
    setMembers(transformedMembers);
  }, [transformedMembers]);
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
      assignedCredentialId: undefined,
      lastSeen: new Date(),
      role: inviteForm.role,
      totalCalls: 0,
      callsToday: 0,
      successRate: 0,
      joinedAt: new Date(),
      isCurrentUser: false,
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

  const handleCredentialAssignment = async (
    memberId: string,
    credentialId: string
  ) => {
    try {
      const memberIdNum = parseInt(memberId);
      const member = workspaceMembers?.find(m => m.id === memberIdNum);

      if (!member) return;

      if (credentialId === 'none') {
        // Unassign any existing credential
        if (member.credential_ref) {
          await unassignMemberFromCredential(
            member.credential_ref,
            memberIdNum
          );
        }
      } else {
        const credId = parseInt(credentialId);
        // First unassign from any existing credential
        if (member.credential_ref && member.credential_ref !== credId) {
          await unassignMemberFromCredential(
            member.credential_ref,
            memberIdNum
          );
        }
        // Then assign to new credential
        await assignMemberToCredential(credId, memberIdNum);
      }

      setAssigningCredential(null);
    } catch {
      // Failed to assign credential
      setAssigningCredential(null);
    }
  };

  const toggleControlsExpansion = (memberId: string) => {
    setExpandedControls(prev => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
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
                      {member.isCurrentUser && (
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          (you)
                        </span>
                      )}
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
                <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5">
                      <ActivityIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold">
                        {member.callsToday}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">Calls Today</p>
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

                {/* API Key Assignment */}
                {member.status !== 'pending' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs">
                      <KeyIcon size={12} />
                      <span>Assigned API Key</span>
                    </div>
                    <Select
                      value={member.assignedCredentialId?.toString() || 'none'}
                      onValueChange={value => {
                        setAssigningCredential(member.id);
                        handleCredentialAssignment(member.id, value);
                      }}
                      disabled={assigningCredential === member.id}
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue>
                          {assigningCredential === member.id ? (
                            <span className="text-muted-foreground">
                              Updating...
                            </span>
                          ) : member.assignedCredentialId ? (
                            <span className="font-mono text-xs">
                              {credentials?.find(
                                c => c.id === member.assignedCredentialId
                              )?.credential_name ||
                                `Key ${member.assignedCredentialId}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              No key assigned
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">
                            No key assigned
                          </span>
                        </SelectItem>
                        {credentials?.map(credential => (
                          <SelectItem
                            key={credential.id}
                            value={credential.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <KeyIcon className="h-3 w-3" />
                              <span className="font-mono text-sm">
                                {credential.credential_name}
                              </span>
                              {credential.xano_instance_name && (
                                <span className="text-muted-foreground text-xs">
                                  ({credential.xano_instance_name})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {member.assignedCredentialId && (
                      <code className="bg-muted/50 block truncate rounded border px-2 py-1 font-mono text-xs">
                        xano_prod_a8b2{'•'.repeat(8)}
                      </code>
                    )}
                  </div>
                )}

                {/* Access Controls Toggle */}
                {member.status !== 'pending' && member.assignedCredentialId && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-auto w-full justify-between p-2 text-xs"
                      onClick={() => toggleControlsExpansion(member.id)}
                    >
                      <div className="flex items-center gap-1.5">
                        <SettingsIcon className="h-3 w-3" />
                        <span>Access Controls</span>
                      </div>
                      {expandedControls[member.id] ? (
                        <ChevronUpIcon className="h-3 w-3" />
                      ) : (
                        <ChevronDownIcon className="h-3 w-3" />
                      )}
                    </Button>

                    {expandedControls[member.id] && (
                      <div className="space-y-3 px-2">
                        {/* Branch Selection */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">
                              Branch Access
                            </span>
                          </div>
                          <Select defaultValue="v1">
                            <SelectTrigger className="h-8 w-full text-sm">
                              <SelectValue placeholder="Select branch..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="v1"
                                className="font-mono text-sm"
                              >
                                v1 (Production)
                              </SelectItem>
                              <SelectItem
                                value="v2"
                                className="font-mono text-sm"
                              >
                                v2 (Staging)
                              </SelectItem>
                              <SelectItem
                                value="dev"
                                className="font-mono text-sm"
                              >
                                dev (Development)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Xano Workspace Selection */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">
                              Xano Workspace
                            </span>
                          </div>
                          <Select defaultValue="prod">
                            <SelectTrigger className="h-8 w-full text-sm">
                              <SelectValue placeholder="Select Xano workspace..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prod" className="text-sm">
                                Production (xivz-202s-g8gq)
                              </SelectItem>
                              <SelectItem value="staging" className="text-sm">
                                Staging (xnwv-v1z6-dvnr)
                              </SelectItem>
                              <SelectItem value="dev" className="text-sm">
                                Development (beta-test-123)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
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
