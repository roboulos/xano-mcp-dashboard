export type ConnectionStatus = 'connected' | 'error' | 'testing' | 'inactive';

// Validation result structure from Xano API
export interface XanoValidationResult {
  credentialName?: string;
  userName?: string;
  userEmail?: string;
  tokenExpiresAt?: string;
}

// Xano credential structure from API
export interface XanoCredential {
  id: number;
  created_at: string;
  user_id?: string;
  credential_name: string;
  xano_api_key: string;
  xano_instance_name?: string;
  xano_instance_email?: string;
  is_default: boolean;
  is_active: boolean;
  validation_result?: XanoValidationResult;
  last_validated?: string;
  updated_at?: string;
}

// Frontend display structure
export interface MCPConfiguration {
  id: number;
  name: string;
  apiKey: string;
  instanceName?: string;
  email?: string;
  isActive: boolean;
  isDefault: boolean;
  status: ConnectionStatus;
  lastConnected?: Date;
  createdAt: Date;
  updatedAt?: Date;
  preview?: {
    credentialName?: string;
    userName?: string;
    userEmail?: string;
    tokenExpiresAt?: string;
  };
  validationResult?: XanoValidationResult;
}

export interface MCPConfigurationFormData {
  name: string;
  apiKey: string;
}
