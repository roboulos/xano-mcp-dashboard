'use client';

import { useState } from 'react';

import {
  PlusIcon,
  UserIcon,
  KeyIcon,
  ClockIcon,
  CopyIcon,
  RefreshCwIcon,
  TrashIcon,
  MailIcon,
  ActivityIcon,
  TrendingUpIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

// Mock data with enhanced metrics
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
    totalCalls: 1247,
    callsToday: 87,
    successRate: 99.2,
    joinedAt: new Date('2024-01-15'),
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
    totalCalls: 934,
    callsToday: 45,
    successRate: 97.8,
    joinedAt: new Date('2024-02-20'),
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
    totalCalls: 456,
    callsToday: 0,
    successRate: 94.1,
    joinedAt: new Date('2024-03-10'),
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
    totalCalls: 123,
    callsToday: 8,
    successRate: 100,
    joinedAt: new Date('2024-03-25'),
  },
];

interface EnhancedTeamManagementProps {
  className?: string;
}

export default function EnhancedTeamManagement({
  className,
}: EnhancedTeamManagementProps) {
  const [members, setMembers] = useState(mockTeamMembers);
  const [, setCopiedId] = useState<string | null>(null);
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
              apiKey: `sk_live_new${Math.random().toString(36).substr(2, 9)}...`,
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
  const avgSuccessRate =
    members.reduce((sum, m) => sum + m.successRate, 0) / members.length;

  return (
    <div className={className}>
      {/* Header with Metrics */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">
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

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-muted-foreground text-xs">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {activeMembers}
            </div>
            <p className="text-muted-foreground text-xs">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-muted-foreground text-xs">API Calls Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {avgSuccessRate.toFixed(1)}%
            </div>
            <p className="text-muted-foreground text-xs">Avg Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map(member => (
          <Card key={member.id} className="transition-all hover:shadow-md">
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
                          : member.status === 'pending'
                            ? 'bg-orange-500'
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
              {/* Activity Metrics */}
              <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-lg p-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ActivityIcon className="h-3 w-3 text-blue-600" />
                    <span className="text-sm font-semibold">
                      {member.callsToday}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">Today</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUpIcon className="h-3 w-3 text-emerald-600" />
                    <span className="text-sm font-semibold">
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
                      'h-2 w-2 rounded-full',
                      member.status === 'active'
                        ? 'bg-emerald-500'
                        : member.status === 'pending'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                    )}
                  />
                  <span className="text-sm capitalize">{member.status}</span>
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
                    <span className="flex items-center gap-1 text-sm">
                      <KeyIcon size={14} />
                      API Key
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => handleCopyApiKey(member.apiKey, member.id)}
                    >
                      <CopyIcon size={14} />
                    </Button>
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
                        >
                          <TrashIcon size={14} className="mr-1" />
                          Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently revoke access for{' '}
                            {member.name}. They will immediately lose access to
                            all MCP services.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusToggle(member.id, false)}
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
    </div>
  );
}
