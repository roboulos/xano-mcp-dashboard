'use client';

import { useState } from 'react';

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
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MoreHorizontalIcon,
  TrashIcon,
  RefreshCwIcon,
  X,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronsUpDownIcon,
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API',
    description: 'Main production API key for Claude Desktop integration',
    key: 'sk_live_abc123def456789ghi012jkl345mno678pqr901stu234vwx567',
    assignedTo: '1',
    assignedUserName: 'Sarah Johnson',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2025-01-15'),
    lastUsed: new Date(),
    usageCount: 1247,
    status: 'active',
    scopes: ['read', 'write', 'admin'],
  },
  {
    id: '2',
    name: 'Development Key',
    description: 'Testing and development environment key',
    key: 'sk_dev_xyz789abc123456def789ghi012jkl345mno678pqr901stu',
    assignedTo: '2',
    assignedUserName: 'Michael Chen',
    createdAt: new Date('2024-02-20'),
    expiresAt: new Date('2024-12-31'),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    usageCount: 934,
    status: 'active',
    scopes: ['read', 'write'],
  },
  {
    id: '3',
    name: 'Analytics Bot',
    description: 'Automated analytics and reporting bot',
    key: 'sk_live_bot456def789012ghi345jkl678mno901pqr234stu567vwx',
    createdAt: new Date('2024-03-01'),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    usageCount: 2156,
    status: 'active',
    scopes: ['read'],
  },
  {
    id: '4',
    name: 'Staging Test',
    description: 'Staging environment testing key',
    key: 'sk_test_staging123456def789ghi012jkl345mno678pqr901stu',
    assignedTo: '4',
    assignedUserName: 'David Park',
    createdAt: new Date('2024-02-01'),
    expiresAt: new Date('2024-06-01'),
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    usageCount: 45,
    status: 'expired',
    scopes: ['read'],
  },
];

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
  const [keys, setKeys] = useState(mockApiKeys);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const [createForm, setCreateForm] = useState({
    name: '',
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

  const handleRegenerate = async (keyId: string) => {
    const newKey = `sk_live_${Math.random().toString(36).substr(2, 16)}...`;
    setKeys(prev =>
      prev.map(key => (key.id === keyId ? { ...key, key: newKey } : key))
    );
    toast({
      title: 'API Key Regenerated',
      description: 'New key has been generated successfully',
    });
  };

  const handleRevoke = async (keyId: string) => {
    setKeys(prev =>
      prev.map(key =>
        key.id === keyId ? { ...key, status: 'revoked' as const } : key
      )
    );
    toast({
      title: 'API Key Revoked',
      description: 'The key has been permanently disabled',
      variant: 'destructive',
    });
  };

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: createForm.name,
      description: createForm.description,
      key: `sk_live_${Math.random().toString(36).substr(2, 40)}`,
      assignedTo: createForm.assignedTo || undefined,
      assignedUserName: createForm.assignedTo ? 'Assigned User' : undefined,
      createdAt: new Date(),
      expiresAt: createForm.expiresAt
        ? new Date(createForm.expiresAt)
        : undefined,
      usageCount: 0,
      status: 'active',
      scopes: createForm.scopes,
    };

    setKeys(prev => [newKey, ...prev]);
    setIsCreateOpen(false);
    setCreateForm({
      name: '',
      description: '',
      assignedTo: '',
      expiresAt: '',
      scopes: ['read'],
    });

    toast({
      title: 'API Key Generated',
      description: `${createForm.name} has been created successfully`,
    });
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
        const fullKey = row.getValue('key') as string;
        const maskedKey = `•••• •••• •••• ${fullKey.slice(-4)}`;
        const isVisible = visibleKeys.has(row.original.id);

        return (
          <div className="flex items-center gap-2">
            <code className="bg-muted/50 rounded px-2 py-1 font-mono text-sm">
              {isVisible ? fullKey : maskedKey}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleKeyVisibility(row.original.id)}
            >
              {isVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(fullKey, row.original.name)}
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
        return user ? (
          <div className="flex items-center gap-2">
            <UserIcon className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{user}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unassigned</span>
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
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'expired'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {status}
          </Badge>
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
            <DropdownMenuItem onClick={() => handleRegenerate(row.original.id)}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Regenerate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleRevoke(row.original.id)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Revoke
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
      k.expiresAt.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
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
                  <Label htmlFor="description">Description *</Label>
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
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Michael Chen</SelectItem>
                      <SelectItem value="3">Emily Rodriguez</SelectItem>
                      <SelectItem value="4">David Park</SelectItem>
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
                  disabled={!createForm.name || !createForm.description}
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
