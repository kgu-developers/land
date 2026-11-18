import type { Metadata } from 'next';

export const teamName = 'kgu developers';
export const description =
  'kgu developers는 경기대학교의 개발팀입니다. 함께 만들고, 배우고, 경험을 나눕니다.';
export const teamGithub = 'https://github.com/kgu-developers';
export const siteUrl = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : undefined;

export function pageMetadata(
  path: string,
  title: string,
  summary: string,
): Metadata {
  const url = siteUrl ? new URL(path, siteUrl).href : undefined;
  return {
    title,
    description: summary,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      title,
      description: summary,
      url,
    },
  };
}
