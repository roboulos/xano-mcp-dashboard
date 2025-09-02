import ContentSection from '../components/content-section';

import { MCPConfigurations } from '@/components/dashboard/mcp-configurations';

export default function UniverseCredentialsPage() {
  return (
    <ContentSection
      title="Universe Credentials"
      desc="Manage your Xano API configurations for external MCP tools."
    >
      <MCPConfigurations />
    </ContentSection>
  );
}
