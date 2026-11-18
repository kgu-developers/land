'use client';

import { AstryxThemeProvider } from '@aics/design-system';
import type { ReactNode } from 'react';

import { landTheme } from './landTheme';

export default function SiteProvider({ children }: { children: ReactNode }) {
  return (
    <AstryxThemeProvider mode='light' theme={landTheme}>
      {children}
    </AstryxThemeProvider>
  );
}
