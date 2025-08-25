import { AccountForm } from './profile-form';
import ContentSection from '../components/content-section';

export default function SettingsProfilePage() {
  return (
    <ContentSection title="Profile" desc="Update your profile details.">
      <AccountForm />
    </ContentSection>
  );
}
