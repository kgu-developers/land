import { pageMetadata } from '../../lib/site';

export const metadata = pageMetadata(
  '/blog',
  '블로그',
  'KD Developers 팀 블로그',
);

export default function BlogPage() {
  return (
    <main>
      <h1>블로그</h1>
    </main>
  );
}
