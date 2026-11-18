import { tokens } from '@aics/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const header = style({
  paddingInline: tokens.spacing[6],
  background: tokens.color.background.surface,
  '@media': { '(max-width: 600px)': { paddingInline: tokens.spacing[3] } },
});
export const navigation = style({
  minHeight: 48,
  borderBottom: `1px solid ${tokens.color.border.base}`,
  '@media': {
    '(max-width: 600px)': {
      gridTemplateColumns: 'auto 1fr',
      rowGap: tokens.spacing[2],
      paddingBlock: tokens.spacing[3],
    },
  },
});
globalStyle(`${navigation} > :nth-child(2)`, {
  '@media': { '(max-width: 600px)': { gridColumn: '1 / -1', gridRow: 2 } },
});
export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
});
export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing[1],
});
