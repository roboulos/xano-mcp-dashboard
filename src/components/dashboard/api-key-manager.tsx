'use client';

import { useState, useMemo } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  Table,
} from '@tanstack/react-table';
import {
  PlusIcon,
  KeyIcon,
  CopyIcon,
  UserIcon,
  MoreHorizontalIcon,
  TrashIcon,
  X,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronsUpDownIcon,
  CheckIcon,
  EditIcon,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  useXanoCredentials,
  useWorkspaceMembers,
} from '@/hooks/use-dashboard-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formatDate = (d?: Date) => (d ? new Date(d).toLocaleDateString() : '—');

interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  assignedTo?: string;
  assignedUserName?: string;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  usageCount: number;
  status: 'active' | 'expired' | 'revoked';
  scopes: string[];
}

// Data Table Column Header Component
function DataTableColumnHeader({
  column,
  title,
  className,
}: {
  column: Column<ApiKey, unknown>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Data Table Toolbar Component
function DataTableToolbar({ table }: { table: Table<ApiKey> }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search keys..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Status filter pills */}
        <div className="flex gap-2">
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Disable ({selectedRows.length})
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Revoke ({selectedRows.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke API Keys</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. {selectedRows.length} key(s)
                  will be permanently disabled.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Revoke Keys</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

interface ApiKeyManagerProps {
  className?: string;
}

export default function ApiKeyManager({ className }: ApiKeyManagerProps) {
  const {
    data: credentials,
    createCredential,
    deleteCredential,
  } = useXanoCredentials();
  const {
    data: workspaceMembers,
    assignMemberToCredential,
    unassignMemberFromCredential,
  } = useWorkspaceMembers();
  const [editingAssignment, setEditingAssignment] = useState<string | null>(
    null
  );
  const [assignmentValues, setAssignmentValues] = useState<
    Record<string, string>
  >({});

  // Transform workspace members to be compatible with existing code
  const teamMembers = useMemo(
    () =>
      workspaceMembers?.map(member => ({
        id: member.id.toString(),
        name: `Member ${member.id}`, // We don't have names in the data, use member ID for now
        email: member.user_id, // Use user_id as email placeholder
        memberId: member.id,
        currentCredential: member.credential_ref,
      })) || [],
    [workspaceMembers]
  );

  // Transform Xano credentials to match the existing ApiKey interface
  const keys = useMemo(
    () =>
      credentials?.map(cred => ({
        id: cred.id.toString(),
        name: cred.credential_name,
        description: `Xano credential for ${cred.xano_instance_name || 'instance'}`,
        key: `xano_${cred.credential_name.toLowerCase()}_****`,
        assignedTo: workspaceMembers
          ?.find(m => m.credential_ref === cred.id)
          ?.id.toString(),
        assignedUserName: workspaceMembers?.find(
          m => m.credential_ref === cred.id
        )
          ? `Member ${workspaceMembers.find(m => m.credential_ref === cred.id)?.id}`
          : undefined,
        createdAt: new Date(cred.created_at),
        lastUsed: cred.last_validated
          ? new Date(cred.last_validated)
          : undefined,
        usageCount: 0, // Default usage count
        status: cred.is_active ? ('active' as const) : ('revoked' as const),
        scopes: cred.is_active ? ['read', 'write'] : ['read'],
        expiresAt: undefined, // Xano keys don't expire
      })) || [],
    [credentials, workspaceMembers]
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const [createForm, setCreateForm] = useState({
    name: '',
    apiKey: '',
    description: '',
    assignedTo: '',
    expiresAt: '',
    scopes: ['read'] as string[],
  });

  // React Table setup
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${label} has been copied`,
    });
  };

  const handleRevoke = async (keyId: string) => {
    try {
      await deleteCredential(parseInt(keyId));
      toast({
        title: 'API Key Deleted',
        description: 'The key has been permanently removed',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  const handleCreateKey = async () => {
    try {
      // Create the credential first
      const newCredential = await createCredential(
        createForm.name,
        createForm.apiKey
      );

      // If a member is assigned, assign them to the new credential
      if (createForm.assignedTo) {
        const assignedMember = teamMembers.find(
          m => m.id === createForm.assignedTo
        );

        if (assignedMember && newCredential) {
          await assignMemberToCredential(
            newCredential.id,
            assignedMember.memberId
          );
        }
      }

      const assignedMember = teamMembers.find(
        m => m.id === createForm.assignedTo
      );

      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        apiKey: '',
        description: '',
        assignedTo: '',
        expiresAt: '',
        scopes: ['read'],
      });

      toast({
        title: 'API Key Generated',
        description: assignedMember
          ? `${createForm.name} has been created and assigned to Member ${assignedMember.memberId}`
          : `${createForm.name} has been created successfully`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    }
  };

  // Column definitions
  const columns: ColumnDef<ApiKey>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ row }) => {
        const keyValue = row.getValue('key') as string;
        const displayValue = `${keyValue.slice(0, 4)}${'•'.repeat(8)}${keyValue.slice(-4)}`;

        return (
          <div className="group flex items-center gap-2">
            <code className="bg-background rounded border px-2 py-1 font-mono text-sm shadow-sm">
              {displayValue}
            </code>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={async () => {
                await navigator.clipboard.writeText(keyValue);
                toast({
                  title: 'Copied to clipboard',
                  description: `${row.original.name} has been copied`,
                });
              }}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'assignedUserName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => {
        const user = row.getValue('assignedUserName') as string;
        const keyId = row.original.id;
        const isEditing = editingAssignment === keyId;
        const selectedUser =
          assignmentValues[keyId] || row.original.assignedTo || '';

        const handleAssignmentUpdate = async () => {
          if (selectedUser === row.original.assignedTo) {
            setEditingAssignment(null);
            return;
          }

          try {
            const assignedMember = teamMembers.find(m => m.id === selectedUser);
            const credentialId = parseInt(row.original.id);

            if (selectedUser && assignedMember) {
              // Assign member to credential
              await assignMemberToCredential(
                credentialId,
                assignedMember.memberId
              );

              toast({
                title: 'Assignment Updated',
                description: `Key assigned to Member ${assignedMember.memberId}`,
              });
            } else {
              // Find current assignment and unassign
              const currentMember = teamMembers.find(
                m => m.currentCredential === credentialId
              );

              if (currentMember) {
                await unassignMemberFromCredential(
                  credentialId,
                  currentMember.memberId
                );

                toast({
                  title: 'Assignment Removed',
                  description: 'Key assignment removed',
                });
              }
            }

            setEditingAssignment(null);
          } catch {
            toast({
              title: 'Error',
              description: 'Failed to update assignment',
              variant: 'destructive',
            });
          }
        };

        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Select
                value={selectedUser}
                onValueChange={value => {
                  setAssignmentValues(prev => ({ ...prev, [keyId]: value }));
                }}
              >
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      Member {member.memberId}
                      {member.currentCredential &&
                        member.currentCredential !==
                          parseInt(row.original.id) &&
                        ' (assigned elsewhere)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleAssignmentUpdate}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  setEditingAssignment(null);
                  setAssignmentValues(prev => ({
                    ...prev,
                    [keyId]: row.original.assignedTo || '',
                  }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }

        return (
          <div
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => {
              setEditingAssignment(keyId);
              setAssignmentValues(prev => ({
                ...prev,
                [keyId]: row.original.assignedTo || '',
              }));
            }}
          >
            {user ? (
              <>
                <UserIcon className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{user}</span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">Unassigned</span>
            )}
            <EditIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        );
      },
    },
    {
      accessorKey: 'scopes',
      header: 'Scopes',
      cell: ({ row }) => {
        const scopes = row.getValue('scopes') as string[];
        return (
          <div className="flex gap-1">
            {scopes.map(scope => (
              <Badge key={scope} variant="outline" className="text-xs">
                {scope}
              </Badge>
            ))}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'usageCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usage" />
      ),
      cell: ({ row }) => {
        const usage = row.getValue('usageCount') as number;
        return (
          <span className="font-mono text-sm">{usage.toLocaleString()}</span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'lastUsed',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last used" />
      ),
      cell: ({ row }) => {
        const lastUsed = row.original.lastUsed;
        if (!lastUsed)
          return <span className="text-muted-foreground text-sm">Never</span>;

        const days = Math.round(
          (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24)
        );
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        return (
          <span className="text-sm" title={lastUsed.toLocaleString()}>
            {rtf.format(-days, 'day')}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                status === 'active'
                  ? 'default'
                  : status === 'expired'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {status}
            </Badge>
            {row.original.expiresAt &&
              row.original.status === 'active' &&
              row.original.expiresAt.getTime() - Date.now() <
                30 * 24 * 60 * 60 * 1000 && (
                <Badge
                  variant="outline"
                  className="border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-orange-950"
                >
                  Expiring soon
                </Badge>
              )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                copyToClipboard(row.original.key, row.original.name)
              }
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy Key
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleRevoke(row.original.id)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: keys,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalKeys = keys.length;
  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalUsage = keys.reduce((sum, k) => sum + k.usageCount, 0);
  const expiringSoon = keys.filter(
    k =>
      k.expiresAt &&
      (k.expiresAt as Date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <KeyIcon className="h-5 w-5" />
              API Key Manager
            </CardTitle>
            <CardDescription>
              Create, manage, and monitor API keys with detailed usage tracking
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key with custom settings and permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Key Name *</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={e =>
                      setCreateForm(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Production API Key"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey">Xano API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={createForm.apiKey}
                    onChange={e =>
                      setCreateForm(prev => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder="xano_prod_..."
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    Enter your Xano API key from your Xano instance
                  </p>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={e =>
                      setCreateForm(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="What this key will be used for..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assign to User (Optional)</Label>
                  <Select
                    value={createForm.assignedTo}
                    onValueChange={value =>
                      setCreateForm(prev => ({ ...prev, assignedTo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex flex-col">
                            <span>Member {member.memberId}</span>
                            <span className="text-muted-foreground text-xs">
                              ID: {member.memberId}
                              {member.currentCredential &&
                                ` (assigned to credential ${member.currentCredential})`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={createForm.expiresAt}
                    onChange={e =>
                      setCreateForm(prev => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="mt-2 flex gap-2">
                    {['read', 'write', 'admin'].map(scope => (
                      <Button
                        key={scope}
                        type="button"
                        size="sm"
                        variant={
                          createForm.scopes.includes(scope)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => {
                          setCreateForm(prev => ({
                            ...prev,
                            scopes: prev.scopes.includes(scope)
                              ? prev.scopes.filter(s => s !== scope)
                              : [...prev.scopes, scope],
                          }));
                        }}
                      >
                        {scope}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={!createForm.name || !createForm.apiKey}
                >
                  Create Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{totalKeys}</p>
            <p className="text-muted-foreground text-xs">Total Keys</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-primary text-2xl font-bold">{activeKeys}</p>
            <p className="text-muted-foreground text-xs">Active</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{totalUsage.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs">Total Usage</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{expiringSoon}</p>
            <p className="text-muted-foreground text-xs">Expiring Soon</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <div className="rounded-md border">
            <UITable>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <KeyIcon className="text-muted-foreground h-8 w-8" />
                        <p>No API keys found</p>
                        <p className="text-muted-foreground text-sm">
                          Create your first API key to get started
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </UITable>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={value => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>«
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>‹
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>›
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>»
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
