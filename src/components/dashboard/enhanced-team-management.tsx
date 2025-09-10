'use client';

import React, { useState, useMemo, useEffect } from 'react';

import {
  KeyIcon,
  ClockIcon,
  ActivityIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth-context';
import { useWorkspace } from '@/contexts/workspace-context';
import {
  useDashboardMetrics,
  useDailyMetrics,
  useXanoCredentials,
  useWorkspaceMembers,
} from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { xanoClient } from '@/services/xano-client';

interface ValidationResult {
  userEmail?: string;
  credentialName?: string;
  currentInstanceName?: string;
  currentWorkspaceName?: string;
  currentBranch?: string;
  liveBranch?: string;
  currentWorkspaceId?: number;
  workspaces?: Array<{ id: number; name: string }>;
  branches?: Array<{ label: string; live?: boolean }>;
  isValid?: boolean;
}

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
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { data: dashboardMetrics } = useDashboardMetrics('week');
  const { data: dailyMetrics } = useDailyMetrics();
  const {
    data: credentials,
    refetch: refetchCredentials,
    validateCredential,
  } = useXanoCredentials();

  // State for active credential validation info
  const [activeCredentialInfo, setActiveCredentialInfo] = useState<{
    email?: string;
    instanceName?: string;
    currentInstanceName?: string;
    workspaceName?: string;
    currentBranch?: string;
    workspaceId?: number;
    workspaces?: Array<{ id: number; name: string }>;
    branches?: Array<{ label: string; live?: boolean }>;
  }>({});
  const [hasValidated, setHasValidated] = useState(false); // Track if we've already validated

  const { data: workspaceMembers } = useWorkspaceMembers(
    currentWorkspace?.id || 0
  ); // Use 0 if no workspace selected to avoid defaulting to 5

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

  // Fetch and validate active credential once credentials are loaded
  useEffect(() => {
    // Don't run if we've already validated or credentials haven't loaded
    if (hasValidated || !credentials || credentials.length === 0) return;

    // Find the active credential
    const activeCredential = credentials.find(
      cred => cred.is_active || cred.is_default
    );

    if (activeCredential) {
      // Mark as validated immediately to prevent re-runs
      setHasValidated(true);

      // If credential has a stored workspace, validate with that workspace to get branches
      const workspaceToValidate = activeCredential.workspace_id;

      // Validate it to get the email and user info
      validateCredential(activeCredential.id, workspaceToValidate)
        .then(validationResult => {
          if (validationResult) {
            // Validation succeeded - update state with the response data
            const result = validationResult as ValidationResult;
            setActiveCredentialInfo({
              email: result.userEmail,
              instanceName:
                result.credentialName || activeCredential.credential_name,
              currentInstanceName: result.currentInstanceName,
              workspaceName:
                result.currentWorkspaceName ||
                (workspaceToValidate
                  ? result.workspaces?.find(w => w.id === workspaceToValidate)
                      ?.name
                  : undefined),
              currentBranch:
                activeCredential.branch ||
                result.currentBranch ||
                result.liveBranch,
              workspaceId: workspaceToValidate || result.currentWorkspaceId,
              workspaces: result.workspaces || [],
              branches: result.branches || [],
            });
          }
        })
        .catch(() => {
          // Validation failed - this is expected if the credential doesn't belong to this user
          // Just show what we have without logging the error
          setActiveCredentialInfo({
            instanceName: activeCredential.credential_name,
          });
        });
    }
  }, [credentials, hasValidated, validateCredential]); // Dependencies

  const filteredMembers = members.filter(member => {
    if (memberFilter === 'all') return true;
    return member.status === memberFilter;
  });

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
      if (credentialId === 'none') {
        // Can't unset a default credential through the API
        // Just update UI state
        setAssigningCredential(null);
        return;
      }

      const credId = parseInt(credentialId);

      // Validate the credential before setting it as default
      try {
        const validationResult = await validateCredential(credId);
        const result = validationResult as ValidationResult;
        if (validationResult && !result.isValid) {
          toast({
            title: 'Invalid API Key',
            description:
              'This API key is not valid. Please check the key and try again.',
            variant: 'destructive',
          });
          setAssigningCredential(null);
          return;
        }
      } catch {
        // Validation failed - show toast without logging to console
        toast({
          title: 'Invalid API Key',
          description:
            'This API key is not valid or you do not have access to it.',
          variant: 'destructive',
        });
        setAssigningCredential(null);
        return; // Don't set as default if validation fails
      }

      // Call the actual Xano API to set this as the default credential
      await xanoClient.credentials.setDefault(credId);

      // Refresh the credentials list to get updated default status
      await refetchCredentials();

      // Reset validation flag so the new credential gets validated
      setHasValidated(false);

      setAssigningCredential(null);

      toast({
        title: 'Success',
        description: 'API key set as default successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to set default credential.',
        variant: 'destructive',
      });
      setAssigningCredential(null);
    }
  };

  const toggleControlsExpansion = (memberId: string) => {
    setExpandedControls(prev => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const handleWorkspaceChange = async (workspaceName: string) => {
    const activeCredential = credentials?.find(c => c.is_default);
    if (!activeCredential) return;

    // Handle "none" selection
    if (workspaceName === 'none') {
      try {
        // Update credential to remove workspace restriction
        await xanoClient.credentials.update(activeCredential.id, {
          workspace_id: undefined,
          branch: undefined,
        });

        // Re-validate without workspace to get all workspaces
        const validationResult = await validateCredential(activeCredential.id);
        const result = validationResult as ValidationResult;

        // Update local state
        setActiveCredentialInfo({
          email: result.userEmail,
          instanceName:
            result.credentialName || activeCredential.credential_name,
          currentInstanceName: result.currentInstanceName,
          workspaceName: undefined,
          currentBranch: undefined,
          workspaceId: undefined,
          workspaces: result.workspaces || [],
          branches: [], // Clear branches when no workspace is selected
        });

        toast({
          title: 'Workspace Updated',
          description: 'Access to all workspaces',
        });
        return;
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to update workspace',
          variant: 'destructive',
        });
        return;
      }
    }

    // Find the workspace by name to get its ID
    const workspace = activeCredentialInfo.workspaces?.find(
      w => w.name === workspaceName
    );
    if (!workspace) return;

    try {
      // Validate with the specific workspace to get its branches
      const validationResult = await validateCredential(
        activeCredential.id,
        workspace.id
      );
      const result = validationResult as ValidationResult;

      // Update the credential with the workspace (but not branch yet)
      await xanoClient.credentials.update(activeCredential.id, {
        workspace_id: workspace.id,
        branch: undefined, // Clear branch when workspace changes
      });

      // Update local state with workspace info and branches from validation
      setActiveCredentialInfo(prev => ({
        ...prev,
        workspaceName: workspace.name,
        workspaceId: workspace.id,
        currentBranch: undefined, // Clear current branch
        branches: result.branches || [], // Update branches from validation
      }));

      toast({
        title: 'Workspace Updated',
        description: `Switched to workspace: ${workspace.name}`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update workspace',
        variant: 'destructive',
      });
    }
  };

  const handleBranchChange = async (branchLabel: string) => {
    const activeCredential = credentials?.find(c => c.is_default);
    if (!activeCredential) return;

    try {
      await xanoClient.credentials.update(activeCredential.id, {
        branch: branchLabel,
      });

      // Update local state
      setActiveCredentialInfo(prev => ({
        ...prev,
        currentBranch: branchLabel,
      }));

      toast({
        title: 'Branch Updated',
        description: `Switched to branch: ${branchLabel}`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update branch',
        variant: 'destructive',
      });
    }
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
            Manage and monitor your team members
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
            <p className="text-lg font-semibold">{totalCalls} API calls</p>
          </div>
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
                  <div className="flex flex-col">
                    {member.isCurrentUser && activeCredentialInfo.email ? (
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">
                            {activeCredentialInfo.email}
                          </p>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            Instance Name:
                          </span>
                          <p className="font-medium">
                            {activeCredentialInfo.currentInstanceName ||
                              activeCredentialInfo.instanceName ||
                              'Active Credential'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5">
                          <ActivityIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-bold">
                            {member.callsToday}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Calls Today
                        </p>
                      </div>
                    )}
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
                      value={
                        credentials?.find(c => c.is_default)?.id.toString() ||
                        'none'
                      }
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
                          ) : credentials?.find(c => c.is_default) ? (
                            <span className="font-mono text-xs">
                              {
                                credentials.find(c => c.is_default)
                                  ?.credential_name
                              }
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
                              {credential.is_default && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
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
                    {credentials?.find(c => c.is_default) && (
                      <code className="bg-muted/50 block truncate rounded border px-2 py-1 font-mono text-xs">
                        xano_prod_a8b2{'•'.repeat(8)}
                      </code>
                    )}
                  </div>
                )}

                {/* Access Controls Toggle */}
                {member.status !== 'pending' &&
                  credentials?.find(c => c.is_default) && (
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
                          {/* Xano Workspace Selection */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-muted-foreground">
                                Xano Workspace
                              </span>
                            </div>
                            <Select
                              value={
                                member.isCurrentUser &&
                                activeCredentialInfo.workspaceName
                                  ? activeCredentialInfo.workspaceName
                                  : ''
                              }
                              disabled={
                                !member.isCurrentUser ||
                                !activeCredentialInfo.workspaces?.length
                              }
                              onValueChange={handleWorkspaceChange}
                            >
                              <SelectTrigger className="h-8 w-full text-sm">
                                <SelectValue placeholder="Select workspace..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none" className="text-sm">
                                  <span className="text-muted-foreground">
                                    None (All workspaces)
                                  </span>
                                </SelectItem>
                                {activeCredentialInfo.workspaces?.map(
                                  workspace => (
                                    <SelectItem
                                      key={workspace.id}
                                      value={workspace.name}
                                      className="text-sm"
                                    >
                                      {workspace.name}
                                    </SelectItem>
                                  )
                                ) || (
                                  <SelectItem value="loading" disabled>
                                    Loading workspaces...
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Branch Selection */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-muted-foreground">
                                Branch Access
                              </span>
                            </div>
                            <Select
                              value={
                                member.isCurrentUser &&
                                activeCredentialInfo.currentBranch
                                  ? activeCredentialInfo.currentBranch
                                  : ''
                              }
                              disabled={
                                !member.isCurrentUser ||
                                !activeCredentialInfo.branches?.length ||
                                !activeCredentialInfo.workspaceName ||
                                activeCredentialInfo.workspaceName === 'none'
                              }
                              onValueChange={handleBranchChange}
                            >
                              <SelectTrigger className="h-8 w-full text-sm">
                                <SelectValue
                                  placeholder={
                                    activeCredentialInfo.workspaceName &&
                                    activeCredentialInfo.workspaceName !==
                                      'none'
                                      ? 'Select branch...'
                                      : 'Select a workspace first'
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {activeCredentialInfo.branches?.map(branch => (
                                  <SelectItem
                                    key={branch.label}
                                    value={branch.label}
                                    className="font-mono text-sm"
                                  >
                                    {branch.label}
                                    {branch.live && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2 text-xs"
                                      >
                                        Live
                                      </Badge>
                                    )}
                                  </SelectItem>
                                )) || (
                                  <SelectItem value="loading" disabled>
                                    {activeCredentialInfo.workspaceName &&
                                    activeCredentialInfo.workspaceName !==
                                      'none'
                                      ? 'Loading branches...'
                                      : 'No workspace selected'}
                                  </SelectItem>
                                )}
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
