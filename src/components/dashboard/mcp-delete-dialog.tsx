'use client';

import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MCPDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configName: string;
  onConfirm: () => void;
}

export function MCPDeleteDialog({
  open,
  onOpenChange,
  configName,
  onConfirm,
}: MCPDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <div className="space-y-1">
              <AlertDialogTitle>Delete Configuration</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Are you sure you want to delete <strong>{configName}</strong>?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="bg-destructive/5 text-destructive-foreground mt-4 rounded-md p-4 text-sm">
          <p className="mb-1 font-medium">This action cannot be undone.</p>
          <p className="text-xs opacity-80">
            Any MCP tools using this configuration will lose access.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Configuration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
