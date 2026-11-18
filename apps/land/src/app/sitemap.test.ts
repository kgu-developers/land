import { afterEach, describe, expect, it, vi } from 'vitest';

import { discussionFixture } from '../lib/blog/fixtures';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }));

const categoryResponse = {
  data: {
    repository: {
      discussionCategories: {
        nodes: [{ id: 'blog-id', slug: 'blog' }],
        pageInfo: { hasNextPage: false },
      },
    },
  },
};

afterEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sitemap publication policy', () => {
  it('includes public routes and published posts while excluding drafts and invalid routes', async () => {
    vi.stubEnv('SITE_URL', 'https://land.example');
    vi.stubEnv('GITHUB_DISCUSSIONS_TOKEN', 'sitemap-test-token');
    vi.stubEnv('GITHUB_DISCUSSIONS_REPO', 'sitemap-test-repo');
    const draft = {
      ...discussionFixture,
      number: 335,
      labels: { nodes: [] },
    };
    const malformed = {
      ...discussionFixture,
      number: 336,
      body: '잘못된 형식',
    };
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json(categoryResponse))
      .mockResolvedValueOnce(
        Response.json({
          data: {
            repository: {
              discussions: {
                nodes: [discussionFixture, draft, malformed],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
            },
          },
        }),
      );
    vi.stubGlobal('fetch', fetch);

    const { default: sitemap } = await import('./sitemap');
    const entries = await sitemap();
    const urls = entries.map(entry => entry.url);

    expect(urls).toEqual([
      'https://land.example/',
      'https://land.example/apply',
      'https://land.example/blog',
      'https://land.example/blog/337',
    ]);
    expect(entries.at(-1)?.lastModified).toBe(discussionFixture.updatedAt);
    for (const excluded of [
      '/terms',
      '/privacy',
      '/copyright',
      '/blog/335',
      '/blog/336',
      '/blog/999999',
    ])
      expect(urls.some(url => url.endsWith(excluded))).toBe(false);
  });
});
