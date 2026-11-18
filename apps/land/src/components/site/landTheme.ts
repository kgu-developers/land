'use client';

import { defineTheme } from '@aics/design-system';

// Figma's shared header/footer foundations. Other scales stay owned by Astryx.
const typography = {
  family: 'Figtree Variable',
  fallbacks: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
export const landTheme = defineTheme({
  name: 'land',
  typography: { body: typography, heading: typography },
  components: {
    button: {
      'variant:primary': {
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-on-accent)',
      },
    },
  },
  tokens: {
    '--color-accent': '#262626',
    '--color-on-accent': '#ffffff',
    '--color-neutral': 'rgba(0, 0, 0, 0.06)',
    '--color-text-primary': '#171717',
    '--color-text-secondary': '#737373',
    '--color-border': 'rgba(0, 0, 0, 0.08)',
    '--color-background-muted': '#f1f1f1',
    '--radius-element': '10px',
    '--radius-container': '16px',
  },
});
