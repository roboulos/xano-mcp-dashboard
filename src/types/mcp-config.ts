export type ConnectionStatus = 'connected' | 'error' | 'testing' | 'inactive';

export interface MCPConfiguration {
  id: string;
  name: string;
  apiKey: string;
  instanceName?: string;
  email?: string;
  isActive: boolean;
  status: ConnectionStatus;
  lastConnected?: Date;
  createdAt: Date;
  updatedAt: Date;
  preview?: {
    totalEndpoints?: number;
    totalTables?: number;
    instanceName?: string;
    email?: string;
  };
}

export interface MCPConfigurationFormData {
  name: string;
  apiKey: string;
  instanceName?: string;
  email?: string;
}
