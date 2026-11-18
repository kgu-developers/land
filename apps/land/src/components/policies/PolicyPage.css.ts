import { tokens } from '@aics/design-system';
import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[3],
  marginBottom: tokens.spacing[8],
});
export const notice = style({
  padding: tokens.spacing[5],
  background: tokens.color.background.muted,
  borderRadius: tokens.radius.container,
  lineHeight: 1.8,
  marginBottom: tokens.spacing[8],
});
export const toc = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[2],
  color: tokens.color.text.secondary,
  fontSize: tokens['font-size'].base,
  paddingBottom: tokens.spacing[8],
  borderBottom: `1px solid ${tokens.color.border.base}`,
});
export const section = style({
  marginTop: tokens.spacing[10],
  scrollMarginTop: tokens.spacing[6],
  lineHeight: 1.9,
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[4],
});
export const related = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: tokens.spacing[4],
  marginTop: tokens.spacing[12],
  paddingTop: tokens.spacing[6],
  borderTop: `1px solid ${tokens.color.border.base}`,
  fontSize: tokens['font-size'].sm,
  color: tokens.color.text.secondary,
});
