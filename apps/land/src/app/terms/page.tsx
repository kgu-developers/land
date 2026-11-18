import PolicyPage from '../../components/policies/PolicyPage';
import { pageMetadata } from '../../lib/site';

export const metadata = {
  ...pageMetadata(
    '/terms',
    '이용약관',
    'kgu developers 웹사이트 이용약관 초안',
  ),
  robots: { index: false, follow: true },
};
export default function TermsPage() {
  return <PolicyPage kind='terms' />;
}
