import PolicyPage from '../../components/policies/PolicyPage';
import { pageMetadata } from '../../lib/site';

export const metadata = {
  ...pageMetadata(
    '/copyright',
    '저작권 정책',
    'kgu developers 콘텐츠 저작권 정책 초안',
  ),
  robots: { index: false, follow: true },
};
export default function CopyrightPage() {
  return <PolicyPage kind='copyright' />;
}
