import BillingForm from './billing-form';
import ContentSection from '../components/content-section';

export default function SettingsBillingPage() {
  return (
    <ContentSection title="Billing" desc="Update your payment plan details.">
      <BillingForm />
    </ContentSection>
  );
}
