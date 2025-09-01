'use client';

import { useState } from 'react';

import {
  IconUserPlus,
  IconFileText,
  IconPower,
  IconShieldOff,
  IconBolt,
} from '@tabler/icons-react';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuickActionsBarProps {
  className?: string;
}

export default function QuickActionsBar({ className }: QuickActionsBarProps) {
  const { toast } = useToast();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('developer');

  const handleEmergencyKill = () => {
    // Simulate emergency kill
    toast({
      title: 'Emergency Kill Switch Activated',
      description: 'All MCP services have been stopped immediately.',
      variant: 'destructive',
    });
  };

  const handleSuspendAllUsers = () => {
    // Simulate suspending all users
    toast({
      title: 'All Users Suspended',
      description: 'All user accounts have been temporarily suspended.',
      variant: 'destructive',
    });
  };

  const handleAddTeamMember = () => {
    if (!newMemberEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address for the new team member.',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingMember(true);
    // Simulate adding team member
    setTimeout(() => {
      setIsAddingMember(false);
      setNewMemberEmail('');
      toast({
        title: 'Team Member Added',
        description: `Invitation sent to ${newMemberEmail}`,
      });
    }, 1500);
  };

  const handleViewLogs = () => {
    // Navigate to full logs page
    window.location.href = '/dashboard/developers/events-&-logs';
  };

  return (
    <Card className={cn('bg-muted', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <IconBolt size={20} />
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Emergency Kill Switch */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="h-20 flex-col gap-2">
                <IconPower size={20} />
                <span className="text-xs">Emergency Kill</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency Kill Switch</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately terminate all MCP services and
                  disconnect every active connection. This is an irreversible
                  action that should only be used in critical situations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergencyKill}>
                  Activate Kill Switch
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Suspend All Users */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="h-20 flex-col gap-2">
                <IconShieldOff size={20} />
                <span className="text-xs">Suspend All</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Suspend All Users</AlertDialogTitle>
                <AlertDialogDescription>
                  This will suspend all user accounts immediately, preventing
                  any access to MCP services. You can reactivate users
                  individually from the user management panel.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSuspendAllUsers}>
                  Suspend All Users
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Team Member */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <IconUserPlus size={20} />
                <span className="text-xs">Add Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member to join the MCP
                  dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={setNewMemberRole}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTeamMember} disabled={isAddingMember}>
                  {isAddingMember ? 'Sending Invitation...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Full Logs */}
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={handleViewLogs}
          >
            <IconFileText size={20} />
            <span className="text-xs">View Full Logs</span>
          </Button>
        </div>

        {/* Stats Section using StatsCard */}
        <div className="grid grid-cols-1 gap-3">
          <StatsCard
            title="Active Users"
            description="Currently active team members"
            stats={4}
            type="neutral"
          />
          <StatsCard
            title="API Usage Today"
            description="Total API calls in last 24h"
            stats={127}
            type="asc"
            showTrend={true}
            profitPercentage={15.3}
            profitNumber={18}
          />
          <StatsCard
            title="System Warnings"
            description="Active warnings to review"
            stats={2}
            type="des"
            showTrend={true}
            profitPercentage={-33.3}
            profitNumber={-1}
          />
        </div>
      </CardContent>
    </Card>
  );
}
