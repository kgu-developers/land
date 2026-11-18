import PolicyPage from '../../components/policies/PolicyPage';
import { pageMetadata } from '../../lib/site';

export const metadata = {
  ...pageMetadata(
    '/privacy',
    '개인정보처리방침',
    'kgu developers 개인정보처리방침 초안',
  ),
  robots: { index: false, follow: true },
};
export default function PrivacyPage() {
  return <PolicyPage kind='privacy' />;
}
