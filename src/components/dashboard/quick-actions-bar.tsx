'use client';

import { useState } from 'react';

import {
  IconAlertTriangle,
  IconUserPlus,
  IconUserOff,
  IconFileText,
  IconPower,
  IconShieldOff,
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className={cn('overflow-hidden', className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />

      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-3">
          <h3 className="mb-2 text-sm font-semibold">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {/* Emergency Kill Switch */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-auto flex-col gap-2 bg-red-500 py-3 hover:bg-red-600"
                >
                  <IconPower size={20} />
                  <span className="text-xs">Emergency Kill</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                      <IconAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <AlertDialogTitle className="text-xl">
                      Emergency Kill Switch
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-base">
                    This will immediately terminate all MCP services and
                    disconnect every active connection. This is an irreversible
                    action that should only be used in critical situations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleEmergencyKill}
                  >
                    Activate Kill Switch
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Suspend All Users */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-auto flex-col gap-2 bg-orange-500 py-3 hover:bg-orange-600"
                >
                  <IconUserOff size={20} />
                  <span className="text-xs">Suspend All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                      <IconShieldOff className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <AlertDialogTitle className="text-xl">
                      Suspend All Users
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-base">
                    This will suspend all user accounts immediately, preventing
                    any access to MCP services. You can reactivate users
                    individually from the user management panel.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleSuspendAllUsers}
                  >
                    Suspend All Users
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Add Team Member */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="h-auto flex-col gap-2 bg-blue-500 py-3 hover:bg-blue-600"
                >
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
                  <Button
                    onClick={handleAddTeamMember}
                    disabled={isAddingMember}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isAddingMember
                      ? 'Sending Invitation...'
                      : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View Full Logs */}
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-3"
              onClick={handleViewLogs}
            >
              <IconFileText size={20} />
              <span className="text-xs">View Full Logs</span>
            </Button>
          </div>

          {/* Additional Quick Stats */}
          <div className="grid grid-cols-3 gap-2 border-t pt-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">4</p>
              <p className="text-muted-foreground text-xs">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">2</p>
              <p className="text-muted-foreground text-xs">Warnings Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">127</p>
              <p className="text-muted-foreground text-xs">API Calls (24h)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
