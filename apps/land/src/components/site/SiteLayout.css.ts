import { tokens } from '@aics/design-system';
import { style } from '@vanilla-extract/css';

export const layout = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  background: tokens.color.background.surface,
  color: tokens.color.text.primary,
});
export const content = style({ flex: 1, outline: 'none' });
export const skipLink = style({
  position: 'fixed',
  top: tokens.spacing[2],
  left: tokens.spacing[2],
  padding: tokens.spacing[3],
  background: tokens.color.background.inverted,
  color: tokens.color['on-dark'],
  zIndex: 50,
  transform: 'translateY(-200%)',
  ':focus': { transform: 'translateY(0)' },
});
