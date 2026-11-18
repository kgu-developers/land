'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function BlogImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <Image
      src={failedSource === src ? '/images/blog-cover.svg' : src}
      alt={failedSource === src ? 'kgu developers 블로그 기본 커버' : alt}
      width={1200}
      height={675}
      className={className}
      unoptimized
      priority={priority}
      onError={() => setFailedSource(src)}
    />
  );
}
