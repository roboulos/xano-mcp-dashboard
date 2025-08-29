'use client';

import { useState, useEffect, useCallback } from 'react';

import { Plus, FileText, Shield, Sparkles, ArrowRight } from 'lucide-react';

import { MCPConfigurationCard } from './mcp-configuration-card';
import { MCPConfigurationForm } from './mcp-configuration-form';
import { MCPConfigurationSkeleton } from './mcp-configuration-skeleton';
import { MCPDeleteDialog } from './mcp-delete-dialog';
import { MCPEmptyState } from './mcp-empty-state';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { mapXanoToConfig, mapFormToXano } from '@/lib/mcp-config-mapper';
import {
  type MCPConfiguration,
  type MCPConfigurationFormData,
  type XanoCredential,
} from '@/types/mcp-config';

export function MCPConfigurations() {
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<
    MCPConfiguration | undefined
  >();
  const [deleteConfig, setDeleteConfig] = useState<
    MCPConfiguration | undefined
  >();
  const { toast } = useToast();

  // Fetch credentials from API
  const fetchCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to view configurations.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/mcp/credentials', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Session expired',
            description: 'Please log in again.',
            variant: 'destructive',
          });
          // Handle logout/redirect
          return;
        }
        throw new Error('Failed to fetch credentials');
      }

      const data = await response.json();
      // Map Xano credentials to frontend format
      const mappedConfigs = (data.items || []).map((cred: XanoCredential) =>
        mapXanoToConfig(cred)
      );
      setConfigurations(mappedConfigs);
    } catch (error) {
      toast({
        title: 'Error loading configurations',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load configurations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load configurations on mount
  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleSetActive = async (id: number) => {
    const config = configurations.find(c => c.id === id);
    if (!config) return;

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to update configurations.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/mcp/credentials/${id}/set-default`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set as default');
      }

      // Update local state
      setConfigurations(prevConfigs =>
        prevConfigs.map(config => ({
          ...config,
          isActive: config.id === id,
          isDefault: config.id === id,
        }))
      );

      toast({
        title: 'Active Configuration Updated',
        description: `${config.name} is now the active configuration for MCP tools.`,
      });
    } catch (error) {
      toast({
        title: 'Error updating configuration',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update configuration',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (config: MCPConfiguration) => {
    setEditingConfig(config);
    setShowConfigForm(true);
  };

  const handleDelete = (id: number) => {
    const config = configurations.find(c => c.id === id);
    if (config) {
      setDeleteConfig(config);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfig) return;

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to delete configurations.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/mcp/credentials/${deleteConfig.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete credential');
      }

      // Update local state
      setConfigurations(prevConfigs =>
        prevConfigs.filter(config => config.id !== deleteConfig.id)
      );

      toast({
        title: 'Configuration Deleted',
        description: `${deleteConfig.name} has been removed.`,
      });

      setDeleteConfig(undefined);
    } catch (error) {
      toast({
        title: 'Error deleting configuration',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete configuration',
        variant: 'destructive',
      });
    }
  };

  const handleTestConnection = async (id: number) => {
    const config = configurations.find(c => c.id === id);
    if (!config) return;

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to test connections.',
          variant: 'destructive',
        });
        return;
      }

      // Update status to testing
      setConfigurations(prevConfigs =>
        prevConfigs.map(config =>
          config.id === id ? { ...config, status: 'testing' } : config
        )
      );

      const response = await fetch(`/api/mcp/credentials/${id}/validate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed');
      }

      // Update configuration status based on validation result
      setConfigurations(prevConfigs =>
        prevConfigs.map(config =>
          config.id === id
            ? {
                ...config,
                status: data.valid ? 'connected' : 'error',
                lastConnected: data.valid ? new Date() : config.lastConnected,
                updatedAt: new Date(),
              }
            : config
        )
      );

      toast({
        title: data.valid ? 'Connection Successful' : 'Connection Failed',
        description:
          data.message ||
          (data.valid
            ? `Successfully connected to ${config.name}.`
            : 'Unable to establish connection. Please check your credentials.'),
        variant: data.valid ? 'default' : 'destructive',
      });
    } catch (error) {
      // Reset status on error
      setConfigurations(prevConfigs =>
        prevConfigs.map(config =>
          config.id === id ? { ...config, status: 'error' } : config
        )
      );

      toast({
        title: 'Error testing connection',
        description:
          error instanceof Error ? error.message : 'Failed to test connection',
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = () => {
    setEditingConfig(undefined);
    setShowConfigForm(true);
  };

  const handleSaveConfiguration = async (data: MCPConfigurationFormData) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to save configurations.',
          variant: 'destructive',
        });
        return;
      }

      const xanoData = mapFormToXano(data);

      if (editingConfig) {
        // Update existing credential
        const response = await fetch(
          `/api/mcp/credentials/${editingConfig.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(xanoData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update configuration');
        }

        // Refresh the list to get updated data
        await fetchCredentials();

        toast({
          title: 'Configuration Updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new credential
        const response = await fetch('/api/mcp/credentials', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(xanoData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to save configuration');
        }

        // Refresh the list to get the new credential
        await fetchCredentials();

        toast({
          title: 'Configuration Added',
          description: `${data.name} has been created successfully.`,
        });
      }

      setShowConfigForm(false);
      setEditingConfig(undefined);
    } catch (error) {
      toast({
        title: 'Error saving configuration',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">MCP Tool Configurations</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    {
                      configurations.filter(c => c.status === 'connected')
                        .length
                    }{' '}
                    Active
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of successfully connected configurations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your Xano API configurations for external MCP tools
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="gap-2 shadow-sm transition-all hover:shadow-md"
          disabled={configurations.length >= 4}
        >
          <Plus className="h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      {/* Configurations Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {[1, 2].map(i => (
            <MCPConfigurationSkeleton key={i} />
          ))}
        </div>
      ) : configurations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {configurations.map(config => (
            <MCPConfigurationCard
              key={config.id}
              config={config}
              onSetActive={id => handleSetActive(id)}
              onEdit={handleEdit}
              onDelete={id => handleDelete(id)}
              onTestConnection={id => handleTestConnection(id)}
            />
          ))}
        </div>
      ) : (
        <MCPEmptyState onAddConfiguration={handleAddNew} />
      )}

      {/* Usage Instructions */}
      <Card className="hover:border-primary/20 group border-dashed transition-colors">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="text-primary h-4 w-4" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {[
              {
                step: '1',
                icon: Shield,
                title: 'Add Configuration',
                description: 'Connect your Xano workspace with API credentials',
              },
              {
                step: '2',
                icon: Sparkles,
                title: 'Set Active',
                description: 'Choose which configuration MCP tools should use',
              },
              {
                step: '3',
                icon: ArrowRight,
                title: 'Start Using',
                description: 'Your MCP tools will automatically connect',
              },
            ].map(item => (
              <div
                key={item.step}
                className="hover:bg-primary/5 flex gap-3 rounded-lg p-3 transition-colors"
              >
                <div className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {item.step}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <item.icon className="text-primary h-3.5 w-3.5" />
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-2">
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Shield className="h-3 w-3" />
              Your API keys are securely stored and only accessible to you
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form Dialog */}
      <MCPConfigurationForm
        open={showConfigForm}
        onOpenChange={setShowConfigForm}
        config={editingConfig}
        onSubmit={handleSaveConfiguration}
      />

      {/* Delete Confirmation Dialog */}
      <MCPDeleteDialog
        open={!!deleteConfig}
        onOpenChange={open => !open && setDeleteConfig(undefined)}
        configName={deleteConfig?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
