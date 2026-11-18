import { EmptyState } from '@aics/design-system';

export default function BlogLoading() {
  return (
    <main aria-busy='true'>
      <EmptyState title='글을 불러오고 있습니다' />
    </main>
  );
}
