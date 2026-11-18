'use client';

import { Button, EmptyState } from '@aics/design-system';

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <main>
      <EmptyState
        title='블로그를 불러오지 못했습니다'
        description='잠시 후 다시 시도해 주세요.'
        actions={<Button label='다시 시도' onClick={reset} />}
      />
    </main>
  );
}
