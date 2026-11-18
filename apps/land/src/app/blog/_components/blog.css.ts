import { tokens } from '@aics/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const introduction = style({
  textAlign: 'center',
  marginBottom: tokens.spacing[10],
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[2],
});
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: tokens.spacing[1],
  marginBottom: tokens.spacing[10],
});
export const filter = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: tokens.spacing[1],
  padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
  borderRadius: tokens.radius.full,
  fontSize: tokens['font-size'].base,
  selectors: {
    '&[aria-current="true"]': {
      background: tokens.color.neutral,
      fontWeight: tokens['font-weight'].semibold,
    },
  },
});
export const featured = style({ marginBottom: tokens.spacing[10] });
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: `${tokens.spacing[10]} ${tokens.spacing[5]}`,
  '@media': { '(max-width: 600px)': { gridTemplateColumns: '1fr' } },
});
export const card = style({ minWidth: 0 });
export const cardLink = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: tokens.spacing[3],
  ':hover': { textDecoration: 'none' },
});
globalStyle(`${cardLink}:hover h2, ${cardLink}:hover h3`, {
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
});
export const cover = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  background: tokens.color.background.muted,
  borderRadius: tokens.radius.container,
});
export const cardCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[1],
  flex: 1,
});
export const meta = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: tokens.spacing[2],
  rowGap: tokens.spacing[1],
  fontSize: tokens['font-size'].sm,
  color: tokens.color.text.secondary,
  lineHeight: 1.7,
});
export const pagination = style({
  display: 'flex',
  gap: tokens.spacing[3],
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: tokens.spacing[12],
  flexWrap: 'wrap',
});
export const pageLink = style({
  padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
  borderRadius: tokens.radius.element,
  background: tokens.color.neutral,
});
export const articleHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[4],
  paddingBottom: tokens.spacing[6],
  marginBottom: tokens.spacing[6],
  borderBottom: `1px solid ${tokens.color.border.base}`,
});
export const breadcrumb = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: tokens.spacing[2],
  fontSize: tokens['font-size'].sm,
  color: tokens.color.text.secondary,
});
export const articleCover = style([cover, { marginBottom: tokens.spacing[8] }]);
export const tags = style({
  display: 'flex',
  gap: tokens.spacing[2],
  flexWrap: 'wrap',
  marginBlock: tokens.spacing[8],
});
export const articleFooter = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: tokens.spacing[4],
  paddingTop: tokens.spacing[6],
  borderTop: `1px solid ${tokens.color.border.base}`,
  fontSize: tokens['font-size'].sm,
  color: tokens.color.text.secondary,
});
export const prose = style({
  fontSize: tokens['font-size'].base,
  lineHeight: 1.9,
  overflowWrap: 'anywhere',
});
globalStyle(`${prose} p, ${prose} ul, ${prose} ol, ${prose} blockquote`, {
  marginBlock: tokens.spacing[4],
});
globalStyle(`${prose} ul`, {
  paddingLeft: tokens.spacing[6],
  listStyle: 'disc',
});
globalStyle(`${prose} ol`, {
  paddingLeft: tokens.spacing[6],
  listStyle: 'decimal',
});
globalStyle(`${prose} h2`, {
  fontSize: tokens['font-size']['2xl'],
  fontWeight: 600,
  marginTop: tokens.spacing[10],
  marginBottom: tokens.spacing[4],
});
globalStyle(`${prose} h3, ${prose} h4`, {
  fontSize: tokens['font-size'].lg,
  fontWeight: 600,
  marginTop: tokens.spacing[8],
});
globalStyle(`${prose} a`, { textDecoration: 'underline' });
globalStyle(`${prose} pre`, {
  padding: tokens.spacing[4],
  background: tokens.color.background.muted,
  borderRadius: tokens.radius.element,
  overflowX: 'auto',
  fontFamily: tokens['font-family'].code,
  lineHeight: 1.7,
});
globalStyle(`${prose} :not(pre) > code`, {
  padding: `0 ${tokens.spacing[1]}`,
  background: tokens.color.background.muted,
  borderRadius: tokens.radius.inner,
});
globalStyle(`${prose} blockquote`, {
  borderLeft: `3px solid ${tokens.color.border.base}`,
  paddingLeft: tokens.spacing[4],
  color: tokens.color.text.secondary,
});
globalStyle(`${prose} table`, { borderCollapse: 'collapse', width: '100%' });
globalStyle(`${prose} th, ${prose} td`, {
  border: `1px solid ${tokens.color.border.base}`,
  padding: tokens.spacing[3],
  textAlign: 'left',
});
export const tableScroll = style({ overflowX: 'auto' });
export const inlineImage = style({
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
  borderRadius: tokens.radius.element,
});
