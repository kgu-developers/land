import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@aics/design-system/styles.css';
import '@fontsource-variable/figtree';
import './globals.css';

import SiteLayout from '../components/site/SiteLayout';
import SiteProvider from '../components/site/SiteProvider';
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
        <SiteProvider>
          <SiteLayout>{children}</SiteLayout>
        </SiteProvider>
        <Analytics />
      </body>
    </html>
  );
}
