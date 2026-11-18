import { EmptyState } from '@aics/design-system';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <EmptyState
        headingLevel={1}
        title='페이지를 찾을 수 없습니다'
        description='주소가 변경되었거나 공개되지 않은 페이지입니다.'
        actions={<Link href='/'>홈으로 돌아가기</Link>}
      />
    </main>
  );
}
