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
        credentialName: xano.validation_result.credentialName,
        userName: xano.validation_result.userName,
        userEmail: xano.validation_result.userEmail,
        tokenExpiresAt: xano.validation_result.tokenExpiresAt,
      }
    : undefined;

  return {
    id: xano.id,
    name: xano.credential_name,
    apiKey: xano.xano_api_key,
    instanceName: xano.validation_result?.userName || xano.xano_instance_name,
    email: xano.validation_result?.userEmail || xano.xano_instance_email,
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
export function mapFormToXano(formData: { name: string; apiKey: string }) {
  return {
    credential_name: formData.name,
    xano_api_key: formData.apiKey,
  };
}
