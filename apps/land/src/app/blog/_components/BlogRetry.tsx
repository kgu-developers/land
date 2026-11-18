'use client';

import { Button } from '@aics/design-system';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function BlogRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      label='다시 불러오기'
      variant='secondary'
      isLoading={pending}
      onClick={() => startTransition(() => router.refresh())}
    />
  );
}
