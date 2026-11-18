import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import '@aics/design-system/styles.css';
import './globals.css';

import { description, siteUrl, teamName } from '../lib/site';

export const metadata: Metadata = {
  title: { default: teamName, template: '%s | ' + teamName },
  description,
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <nav aria-label='주 메뉴'>
          <Link href='/'>홈</Link>
          <Link href='/apply'>지원</Link>
          <Link href='/blog'>블로그</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
