import type { MetadataRoute } from 'next';

import { getBlogPosts } from '../lib/blog/github';
import { siteUrl } from '../lib/site';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteUrl) return [];
  const { posts } = await getBlogPosts();
  return [
    ...['/', '/apply', '/blog'].map(path => ({
      url: new URL(path, siteUrl).href,
    })),
    ...posts.map(post => ({
      url: new URL(`/blog/${post.number}`, siteUrl).href,
      lastModified: post.updatedAt,
    })),
  ];
}
