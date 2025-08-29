'use client';

import { useState, useEffect } from 'react';

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
import {
  type MCPConfiguration,
  type MCPConfigurationFormData,
} from '@/types/mcp-config';

// Mock data - in real implementation this would come from API/database
const mockConfigurations: MCPConfiguration[] = [
  {
    id: '1',
    name: 'Production Workspace',
    apiKey: 'xano_prod_1234567890abcdef1234567890abcdef',
    instanceName: 'Production Instance',
    email: 'admin@production.com',
    isActive: true,
    status: 'connected',
    lastConnected: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    preview: {
      totalEndpoints: 47,
      totalTables: 12,
      instanceName: 'Production Instance',
      email: 'admin@production.com',
    },
  },
  {
    id: '2',
    name: 'Development Workspace',
    apiKey: 'xano_dev_abcdef1234567890abcdef1234567890',
    instanceName: 'Development Instance',
    email: 'dev@example.com',
    isActive: false,
    status: 'connected',
    lastConnected: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    preview: {
      totalEndpoints: 23,
      totalTables: 8,
      instanceName: 'Development Instance',
      email: 'dev@example.com',
    },
  },
  {
    id: '3',
    name: 'Staging Environment',
    apiKey: 'xano_stage_fedcba0987654321fedcba0987654321',
    instanceName: 'Staging Instance',
    email: 'staging@example.com',
    isActive: false,
    status: 'error',
    lastConnected: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

export function MCPConfigurations() {
  const [configurations, setConfigurations] =
    useState<MCPConfiguration[]>(mockConfigurations);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<
    MCPConfiguration | undefined
  >();
  const [deleteConfig, setDeleteConfig] = useState<
    MCPConfiguration | undefined
  >();
  const { toast } = useToast();

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetActive = (id: string) => {
    const config = configurations.find(c => c.id === id);
    if (!config) return;

    setConfigurations(prevConfigs =>
      prevConfigs.map(config => ({
        ...config,
        isActive: config.id === id,
      }))
    );

    toast({
      title: 'Active Configuration Updated',
      description: `${config.name} is now the active configuration for MCP tools.`,
    });
  };

  const handleEdit = (config: MCPConfiguration) => {
    setEditingConfig(config);
    setShowConfigForm(true);
  };

  const handleDelete = (id: string) => {
    const config = configurations.find(c => c.id === id);
    if (config) {
      setDeleteConfig(config);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfig) return;

    setConfigurations(prevConfigs =>
      prevConfigs.filter(config => config.id !== deleteConfig.id)
    );

    toast({
      title: 'Configuration Deleted',
      description: `${deleteConfig.name} has been removed.`,
    });

    setDeleteConfig(undefined);
  };

  const handleTestConnection = async (id: string) => {
    const config = configurations.find(c => c.id === id);
    if (!config) return;

    // Update status to testing
    setConfigurations(prevConfigs =>
      prevConfigs.map(config =>
        config.id === id ? { ...config, status: 'testing' } : config
      )
    );

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConfigurations(prevConfigs =>
        prevConfigs.map(config =>
          config.id === id
            ? {
                ...config,
                status: success ? 'connected' : 'error',
                lastConnected: success ? new Date() : config.lastConnected,
                updatedAt: new Date(),
                preview: success
                  ? {
                      ...config.preview,
                      lastActivity: new Date(),
                    }
                  : config.preview,
              }
            : config
        )
      );

      toast({
        title: success ? 'Connection Successful' : 'Connection Failed',
        description: success
          ? `Successfully connected to ${config.name}.`
          : 'Unable to establish connection. Please check your credentials.',
        variant: success ? 'default' : 'destructive',
      });
    }, 2000);
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

      // Call our API to save the API key to Xano
      const response = await fetch('/api/mcp/save-config', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: data.apiKey,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save configuration');
      }

      // Extract validation info from Xano response
      const validationInfo = result.validation_result;
      const isValid = validationInfo?.is_valid === 200;
      const userInfo = validationInfo?.user_info;

      if (editingConfig) {
        // Update existing
        setConfigurations(prevConfigs =>
          prevConfigs.map(config =>
            config.id === editingConfig.id
              ? {
                  ...config,
                  ...data,
                  status: isValid ? 'connected' : 'error',
                  lastConnected: isValid ? new Date() : config.lastConnected,
                  updatedAt: new Date(),
                  preview:
                    isValid && userInfo
                      ? {
                          totalEndpoints: userInfo.endpoints?.length || 0,
                          totalTables: userInfo.tables?.length || 0,
                          instanceName: userInfo.name || data.instanceName,
                          email: userInfo.email || data.email,
                        }
                      : config.preview,
                }
              : config
          )
        );

        toast({
          title: 'Configuration Updated',
          description: `${data.name} has been ${isValid ? 'validated and ' : ''}updated successfully.`,
        });
      } else {
        // Add new
        const newConfig: MCPConfiguration = {
          id: Date.now().toString(),
          ...data,
          isActive: configurations.length === 0,
          status: isValid ? 'connected' : 'error',
          lastConnected: isValid ? new Date() : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          preview:
            isValid && userInfo
              ? {
                  totalEndpoints: userInfo.endpoints?.length || 0,
                  totalTables: userInfo.tables?.length || 0,
                  instanceName: userInfo.name || data.instanceName,
                  email: userInfo.email || data.email,
                }
              : undefined,
        };

        setConfigurations(prevConfigs => [...prevConfigs, newConfig]);

        toast({
          title: 'Configuration Added',
          description: `${data.name} has been ${isValid ? 'validated and ' : ''}created successfully.`,
          variant: isValid ? 'default' : 'destructive',
        });

        // If validation failed, show more info
        if (!isValid) {
          toast({
            title: 'API Key Validation Failed',
            description:
              'The API key could not be validated with Xano. Please check your API key and try again.',
            variant: 'destructive',
          });
        }
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
              onSetActive={handleSetActive}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTestConnection={handleTestConnection}
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
