import 'server-only';

import { unstable_cache } from 'next/cache';

import { discussionToPost, type BlogPost, type Discussion } from './model';

type Config = { owner: string; repo: string; category: string; token: string };
type RequestState = {
  inFlight?: Promise<BlogPost[]>;
  retryAfter?: number;
};
export type BlogResult = {
  status: 'ready' | 'unconfigured' | 'error';
  posts: BlogPost[];
};

const failureCooldownMs = 10_000;
const requestStates = new Map<string, RequestState>();

export async function githubQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
  const payload = (await response.json()) as { data?: T; errors?: unknown[] };
  if (payload.errors?.length || !payload.data)
    throw new Error('GitHub GraphQL request failed');
  return payload.data;
}

const categoriesQuery = `query BlogCategory($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    discussionCategories(first: 100) { nodes { id slug } pageInfo { hasNextPage } }
  }
}`;
const postsQuery = `query BlogPosts($owner: String!, $repo: String!, $categoryId: ID!, $after: String) {
  repository(owner: $owner, name: $repo) {
    discussions(first: 50, categoryId: $categoryId, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        number title body url createdAt updatedAt
        category { slug }
        author { login avatarUrl url }
        labels(first: 100) { nodes { name } pageInfo { hasNextPage } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

export async function fetchBlogPosts(config: Config): Promise<BlogPost[]> {
  const categoryResult = await githubQuery<{
    repository: {
      discussionCategories: {
        nodes: { id: string; slug: string }[];
        pageInfo: { hasNextPage: boolean };
      };
    } | null;
  }>(categoriesQuery, { owner: config.owner, repo: config.repo }, config.token);
  const categoryId = categoryResult.repository?.discussionCategories.nodes.find(
    category => category.slug === config.category,
  )?.id;
  if (!categoryId) throw new Error('Blog discussion category is unavailable');
  const posts: BlogPost[] = [];
  let after: string | null = null;
  // Bound upstream work; never present a partial archive as the full archive.
  for (let page = 0; page < 20; page++) {
    const data: {
      repository: {
        discussions: {
          nodes: (Discussion | null)[];
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
      } | null;
    } = await githubQuery(
      postsQuery,
      { owner: config.owner, repo: config.repo, categoryId, after },
      config.token,
    );
    if (!data.repository) throw new Error('Blog repository is unavailable');
    for (const discussion of data.repository.discussions.nodes) {
      if (!discussion) continue;
      if (discussion.labels.pageInfo?.hasNextPage)
        throw new Error('Discussion label pagination is incomplete');
      // GitHub may return a null author after an account is deleted.
      discussion.author ??= {
        login: 'kgu developers',
        avatarUrl: '',
        url: 'https://github.com/kgu-developers',
      };
      const post = discussionToPost(discussion, config.category);
      if (post) posts.push(post);
    }
    const info = data.repository.discussions.pageInfo;
    if (!info.hasNextPage)
      return posts.sort(
        (a, b) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
          b.number - a.number,
      );
    if (!info.endCursor || info.endCursor === after)
      throw new Error('Invalid GitHub pagination cursor');
    after = info.endCursor;
  }
  throw new Error('Blog archive exceeds the supported size');
}

export async function getBlogPosts(): Promise<BlogResult> {
  const token = process.env.GITHUB_DISCUSSIONS_TOKEN;
  if (!token) return { status: 'unconfigured', posts: [] };
  const config: Config = {
    owner: process.env.GITHUB_DISCUSSIONS_OWNER || 'kgu-developers',
    repo: process.env.GITHUB_DISCUSSIONS_REPO || 'land',
    category: process.env.GITHUB_DISCUSSIONS_CATEGORY || 'blog',
    token,
  };
  try {
    return { status: 'ready', posts: await getMitigatedBlogPosts(config) };
  } catch {
    // Do not log upstream bodies, headers, or tokens. Retry is available in the UI.
    console.error(
      'Blog Discussions sync failed. Check repository, category, and token permissions.',
    );
    return { status: 'error', posts: [] };
  }
}

async function getMitigatedBlogPosts(config: Config): Promise<BlogPost[]> {
  const key = JSON.stringify([config.owner, config.repo, config.category]);
  const now = Date.now();
  const existing = requestStates.get(key);
  if (existing?.inFlight) return existing.inFlight;
  if (existing?.retryAfter && existing.retryAfter > now)
    throw new Error('GitHub retry cooldown is active');

  // Credentials stay inside the closure and never enter a cache or process key.
  const getCachedPosts = unstable_cache(
    () => fetchBlogPosts(config),
    ['blog-v1', config.owner, config.repo, config.category],
    { revalidate: 300, tags: ['blog'] },
  );
  const state: RequestState = {};
  const request = getCachedPosts();
  state.inFlight = request;
  requestStates.set(key, state);
  try {
    const posts = await request;
    requestStates.delete(key);
    return posts;
  } catch (error) {
    state.retryAfter = Date.now() + failureCooldownMs;
    throw error;
  } finally {
    state.inFlight = undefined;
  }
}
