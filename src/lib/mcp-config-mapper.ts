import {
  XanoCredential,
  MCPConfiguration,
  ConnectionStatus,
} from '@/types/mcp-config';

// Map Xano credential to frontend configuration
export function mapXanoToConfig(xano: XanoCredential): MCPConfiguration {
  // Determine status based on validation result
  const status: ConnectionStatus = xano.validation_result
    ? 'connected'
    : 'inactive';

  // Parse preview data from validation result if available
  const preview = xano.validation_result
    ? {
        totalEndpoints: xano.validation_result.endpoints?.length || 0,
        totalTables: xano.validation_result.tables?.length || 0,
        instanceName: xano.validation_result.name || xano.xano_instance_name,
        email: xano.validation_result.email || xano.xano_instance_email,
      }
    : undefined;

  return {
    id: xano.id,
    name: xano.credential_name,
    apiKey: xano.xano_api_key,
    instanceName: xano.xano_instance_name,
    email: xano.xano_instance_email,
    isActive: xano.is_active,
    isDefault: xano.is_default,
    status,
    lastConnected: xano.last_validated
      ? new Date(xano.last_validated)
      : undefined,
    createdAt: new Date(xano.created_at),
    updatedAt: xano.updated_at ? new Date(xano.updated_at) : undefined,
    preview,
    validationResult: xano.validation_result,
  };
}

// Map frontend form data to Xano credential format
export function mapFormToXano(formData: {
  name: string;
  apiKey: string;
  instanceName?: string;
  email?: string;
}) {
  return {
    credential_name: formData.name,
    xano_api_key: formData.apiKey,
    xano_instance_name: formData.instanceName,
    xano_instance_email: formData.email,
  };
}
