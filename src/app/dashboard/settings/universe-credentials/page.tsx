import ContentSection from '../components/content-section';
import XanoCredentialsForm from './components/xano-credentials-form';

export default function XanoCredentialsPage() {
  return (
    <ContentSection
      title="Xano Workspace Credentials"
      desc="Configure your Xano workspace connection settings."
    >
      <XanoCredentialsForm />
    </ContentSection>
  );
}
