import { afterEach, describe, expect, it, vi } from 'vitest';

import { discussionFixture } from './fixtures';
import { fetchBlogPosts, getBlogPosts } from './github';

const { cacheKeys } = vi.hoisted(() => ({ cacheKeys: [] as string[][] }));
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => unknown, keys: string[]) => {
    cacheKeys.push(keys);
    return fn;
  },
}));

const config = {
  owner: 'kgu-developers',
  repo: 'land-client',
  category: 'blog',
  token: 'test-token',
};
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
const postsResponse = (
  nodes: unknown[],
  hasNextPage = false,
  endCursor: string | null = null,
) => ({
  data: {
    repository: {
      discussions: { nodes, pageInfo: { hasNextPage, endCursor } },
    },
  },
});
afterEach(() => {
  cacheKeys.length = 0;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('GitHub Discussions read path', () => {
  it('requires no upstream request when credentials are absent', async () => {
    vi.stubEnv('GITHUB_DISCUSSIONS_TOKEN', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await getBlogPosts()).toEqual({ status: 'unconfigured', posts: [] });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('reads every page and filters unpublished posts from all results', async () => {
    const responses = [
      categoryResponse,
      postsResponse(
        [{ ...discussionFixture, number: 1, labels: { nodes: [] } }],
        true,
        'next',
      ),
      postsResponse([discussionFixture]),
    ];
    const fetch = vi
      .fn()
      .mockImplementation(async () => Response.json(responses.shift()));
    vi.stubGlobal('fetch', fetch);
    expect(await fetchBlogPosts(config)).toMatchObject([{ number: 337 }]);
    expect(JSON.parse(fetch.mock.calls[2]![1].body).variables.after).toBe(
      'next',
    );
    expect(fetch.mock.calls[0]![1].headers['User-Agent']).toBe(
      'kgu-developers-land',
    );
    expect(fetch.mock.calls[0]![1].headers.Authorization).toBe(
      'Bearer test-token',
    );
  });
  it.each([401, 403])(
    'handles upstream HTTP %s without exposing tokens',
    async status => {
      vi.stubEnv('GITHUB_DISCUSSIONS_TOKEN', 'never-print-this');
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response('', { status })),
      );
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(await getBlogPosts()).toEqual({ status: 'error', posts: [] });
      expect(JSON.stringify(log.mock.calls)).not.toContain('never-print-this');
    },
  );
  it('coalesces concurrent callers without putting credentials in a key', async () => {
    vi.stubEnv('GITHUB_DISCUSSIONS_TOKEN', 'single-flight-secret');
    vi.stubEnv('GITHUB_DISCUSSIONS_REPO', 'single-flight-repo');
    let releaseCategory!: (response: Response) => void;
    const categoryPending = new Promise<Response>(resolve => {
      releaseCategory = resolve;
    });
    const fetch = vi
      .fn()
      .mockImplementationOnce(() => categoryPending)
      .mockResolvedValueOnce(Response.json(postsResponse([discussionFixture])));
    vi.stubGlobal('fetch', fetch);

    const requests = [getBlogPosts(), getBlogPosts(), getBlogPosts()];
    expect(fetch).toHaveBeenCalledTimes(1);
    releaseCategory(Response.json(categoryResponse));

    const results = await Promise.all(requests);
    expect(results.every(result => result.status === 'ready')).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(cacheKeys)).not.toContain('single-flight-secret');
  });
  it.each([
    ['429', () => Promise.resolve(new Response('', { status: 429 }))],
    ['5xx', () => Promise.resolve(new Response('', { status: 503 }))],
    ['timeout', () => Promise.reject(new Error('request timed out'))],
  ])(
    'suppresses repeated %s failures briefly and recovers afterward',
    async (name, fail) => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2026-11-18T00:00:00Z'));
      vi.stubEnv('GITHUB_DISCUSSIONS_TOKEN', `secret-${name}`);
      vi.stubEnv('GITHUB_DISCUSSIONS_REPO', `failure-${name}`);
      const fetch = vi.fn().mockImplementationOnce(fail);
      vi.stubGlobal('fetch', fetch);
      vi.spyOn(console, 'error').mockImplementation(() => {});

      expect((await getBlogPosts()).status).toBe('error');
      expect((await getBlogPosts()).status).toBe('error');
      expect(fetch).toHaveBeenCalledTimes(1);

      vi.setSystemTime(new Date('2026-11-18T00:00:10.001Z'));
      fetch
        .mockResolvedValueOnce(Response.json(categoryResponse))
        .mockResolvedValueOnce(
          Response.json(postsResponse([discussionFixture])),
        );
      const recovered = await getBlogPosts();
      expect(recovered).toMatchObject({
        status: 'ready',
        posts: [{ number: 337 }],
      });
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(JSON.stringify(cacheKeys)).not.toContain(`secret-${name}`);
    },
  );
  it('rejects GraphQL errors even with HTTP 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ errors: [{ message: 'denied' }] })),
    );
    await expect(fetchBlogPosts(config)).rejects.toThrow('GraphQL');
  });
  it('rejects missing category and nonadvancing cursors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ data: { repository: null } })),
    );
    await expect(fetchBlogPosts(config)).rejects.toThrow('category');
    const responses = [categoryResponse, postsResponse([], true, null)];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(responses.shift())),
    );
    await expect(fetchBlogPosts(config)).rejects.toThrow('cursor');
  });
});
