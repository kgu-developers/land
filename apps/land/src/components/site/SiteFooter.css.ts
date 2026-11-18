import { tokens } from '@aics/design-system';
import { style } from '@vanilla-extract/css';

export const footer = style({
  padding: tokens.spacing[6],
  marginTop: 'auto',
  color: tokens.color.text.secondary,
  fontSize: tokens['font-size'].sm,
});
const rowLayout = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  gap: tokens.spacing[4],
  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
      justifyItems: 'center',
      textAlign: 'center' as const,
    },
  },
};
export const row = style({ ...rowLayout, paddingBottom: tokens.spacing[4] });
export const bottom = style({
  ...rowLayout,
  borderTop: `1px solid ${tokens.color.border.base}`,
  paddingTop: tokens.spacing[4],
});
export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: tokens.spacing[4],
});
export const brand = style({
  color: tokens.color.text.primary,
  fontWeight: tokens['font-weight'].semibold,
  width: 'fit-content',
});
export const social = style({
  display: 'flex',
  gap: tokens.spacing[2],
  justifySelf: 'end',
  '@media': { '(max-width: 640px)': { justifySelf: 'center' } },
});
export const socialLink = style({
  display: 'grid',
  placeItems: 'center',
  width: 28,
  height: 28,
  borderRadius: tokens.radius.element,
  background: tokens.color.neutral,
});
export const copyright = style({
  textAlign: 'right',
  '@media': { '(max-width: 640px)': { textAlign: 'center' } },
});
