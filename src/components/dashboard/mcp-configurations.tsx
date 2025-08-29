'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MCPConfigurationCard } from './mcp-configuration-card';
import { type MCPConfiguration } from '@/types/mcp-config';

// Mock data - in real implementation this would come from API/database
const mockConfigurations: MCPConfiguration[] = [
  {
    id: '1',
    name: 'Production Workspace',
    apiKey: 'xano_prod_1234567890abcdef1234567890abcdef',
    apiUrl: 'https://api.xano.com/prod',
    workspace: 'prod-workspace',
    isActive: true,
    status: 'connected',
    lastConnected: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    preview: {
      totalEndpoints: 47,
      totalTables: 12,
      workspaceName: 'Production',
      lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
  },
  {
    id: '2',
    name: 'Development Workspace',
    apiKey: 'xano_dev_abcdef1234567890abcdef1234567890',
    apiUrl: 'https://api.xano.com/dev',
    workspace: 'dev-workspace',
    isActive: false,
    status: 'connected',
    lastConnected: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    preview: {
      totalEndpoints: 23,
      totalTables: 8,
      workspaceName: 'Development',
      lastActivity: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  },
  {
    id: '3',
    name: 'Staging Environment',
    apiKey: 'xano_stage_fedcba0987654321fedcba0987654321',
    apiUrl: 'https://api.xano.com/staging',
    workspace: 'staging-workspace',
    isActive: false,
    status: 'error',
    lastConnected: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

export function MCPConfigurations() {
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>(mockConfigurations);

  const handleSetActive = (id: string) => {
    setConfigurations(prevConfigs =>
      prevConfigs.map(config => ({
        ...config,
        isActive: config.id === id,
      }))
    );
  };

  const handleEdit = (config: MCPConfiguration) => {
    // TODO: Implement edit modal/form
    console.log('Edit configuration:', config);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete confirmation
    setConfigurations(prevConfigs =>
      prevConfigs.filter(config => config.id !== id)
    );
  };

  const handleTestConnection = (id: string) => {
    // Update status to testing
    setConfigurations(prevConfigs =>
      prevConfigs.map(config =>
        config.id === id ? { ...config, status: 'testing' } : config
      )
    );

    // Simulate API call
    setTimeout(() => {
      setConfigurations(prevConfigs =>
        prevConfigs.map(config =>
          config.id === id
            ? {
                ...config,
                status: Math.random() > 0.3 ? 'connected' : 'error',
                lastConnected: new Date(),
                updatedAt: new Date(),
              }
            : config
        )
      );
    }, 2000);
  };

  const handleAddNew = () => {
    // TODO: Implement add new configuration modal/form
    console.log('Add new configuration');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">MCP Tool Configurations</h3>
          <p className="text-sm text-muted-foreground">
            Manage your Xano API configurations for external MCP tools
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      {/* Configurations Grid */}
      {configurations.length > 0 ? (
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
        /* Empty State */
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Configurations Found</CardTitle>
            <CardDescription className="mb-6 max-w-md">
              Get started by adding your first Xano workspace configuration.
              This will allow external MCP tools to connect to your Xano backend.
            </CardDescription>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Configuration
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-medium">How to use with MCP tools:</p>
            <ol className="space-y-1 pl-4 list-decimal">
              <li>Add your Xano workspace API configuration above</li>
              <li>Set one configuration as "Active" - this is what MCP tools will use</li>
              <li>Test the connection to verify everything works</li>
              <li>Your external MCP tools will automatically use the active configuration</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}