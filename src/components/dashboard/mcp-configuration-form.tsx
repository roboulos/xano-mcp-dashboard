'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Info, Shield, Link, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  type MCPConfiguration,
  type MCPConfigurationFormData,
} from '@/types/mcp-config';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  apiKey: z
    .string()
    .min(1, 'API Key is required')
    .regex(/^xano_/, 'API Key must start with "xano_"'),
  apiUrl: z.string().url('Must be a valid URL').min(1, 'API URL is required'),
  workspace: z
    .string()
    .min(1, 'Workspace is required')
    .max(50, 'Workspace must be less than 50 characters'),
});

interface MCPConfigurationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: MCPConfiguration;
  onSubmit: (data: MCPConfigurationFormData) => Promise<void>;
}

export function MCPConfigurationForm({
  open,
  onOpenChange,
  config,
  onSubmit,
}: MCPConfigurationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MCPConfigurationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: config?.name || '',
      apiKey: config?.apiKey || '',
      apiUrl: config?.apiUrl || 'https://api.xano.com/',
      workspace: config?.workspace || '',
    },
  });

  const handleSubmit = async (data: MCPConfigurationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // In production, handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{config ? 'Edit' : 'Add'} MCP Configuration</DialogTitle>
          <DialogDescription>
            Configure your Xano workspace connection for MCP tools.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Configuration Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Production Workspace"
                      {...field}
                      className="font-medium"
                    />
                  </FormControl>
                  <FormDescription>
                    A friendly name to identify this configuration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    API Key
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground h-3.5 w-3.5 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>Find your API key in Xano: Settings → API Keys</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="xano_prod_1234567890abcdef"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Your Xano API authentication key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    API URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://api.xano.com/prod"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    The base URL for your Xano API endpoints
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workspace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Workspace ID
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground h-3.5 w-3.5 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>
                            Found in your Xano URL:
                            xano.io/workspace/[workspace-id]
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="prod-workspace"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Your Xano workspace identifier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {config ? 'Update' : 'Add'} Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
