import { NotificationsForm } from './notifications-form';
import ContentSection from '../components/content-section';

export default function SettingsNotificationsPage() {
  return (
    <ContentSection
      title="Notifications"
      desc="Manage and connect different applications."
    >
      <NotificationsForm />
    </ContentSection>
  );
}
