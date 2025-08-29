export type ConnectionStatus = 'connected' | 'error' | 'testing' | 'inactive';

export interface MCPConfiguration {
  id: string;
  name: string;
  apiKey: string;
  apiUrl: string;
  workspace: string;
  isActive: boolean;
  status: ConnectionStatus;
  lastConnected?: Date;
  createdAt: Date;
  updatedAt: Date;
  preview?: {
    totalEndpoints?: number;
    totalTables?: number;
    workspaceName?: string;
    lastActivity?: Date;
  };
}

export interface MCPConfigurationFormData {
  name: string;
  apiKey: string;
  apiUrl: string;
  workspace: string;
}
