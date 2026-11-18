import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BlogPage, {
  generateMetadata as generateBlogMetadata,
} from './(index)/page';
import BlogPostPage, { generateMetadata } from './[number]/page';
import SiteProvider from '../../components/site/SiteProvider';
import { discussionFixture } from '../../lib/blog/fixtures';
import { discussionToPost } from '../../lib/blog/model';

const { getBlogPosts, refresh } = vi.hoisted(() => ({
  getBlogPosts: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('../../lib/blog/github', () => ({ getBlogPosts }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  useRouter: () => ({ refresh }),
}));

const params = Promise.resolve({ number: '337' });
const searchParams = Promise.resolve({});

afterEach(() => {
  getBlogPosts.mockReset();
  refresh.mockReset();
});

describe('blog route states', () => {
  it.each([
    ['unconfigured', '첫 이야기를 준비하고 있습니다'],
    ['error', '글을 불러오지 못했습니다'],
  ] as const)('renders the /blog %s state', async (status, heading) => {
    getBlogPosts.mockResolvedValue({ status, posts: [] });
    expect(await generateBlogMetadata()).toMatchObject({
      robots: { index: false, follow: false },
    });
    render(<SiteProvider>{await BlogPage({ searchParams })}</SiteProvider>);
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    if (status === 'error')
      expect(
        screen.getByRole('button', { name: '다시 불러오기' }),
      ).toBeInTheDocument();
  });

  it.each([
    ['unconfigured', '블로그를 준비하고 있습니다'],
    ['error', '글을 불러오지 못했습니다'],
  ] as const)(
    'keeps the /blog/[number] %s route friendly and noindex',
    async (status, heading) => {
      getBlogPosts.mockResolvedValue({ status, posts: [] });
      expect(await generateMetadata({ params })).toMatchObject({
        robots: { index: false, follow: false },
      });
      render(<SiteProvider>{await BlogPostPage({ params })}</SiteProvider>);
      expect(
        screen.getByRole('heading', { name: heading }),
      ).toBeInTheDocument();
      if (status === 'error')
        expect(
          screen.getByRole('button', { name: '다시 불러오기' }),
        ).toBeInTheDocument();
    },
  );

  it('uses the raster fallback in ready metadata and preserves ready rendering', async () => {
    const post = discussionToPost(discussionFixture)!;
    getBlogPosts.mockResolvedValue({ status: 'ready', posts: [post] });
    expect(await generateMetadata({ params })).toMatchObject({
      openGraph: {
        type: 'article',
        images: [
          {
            url: '/images/blog-cover-og.png',
            alt: 'kgu developers 블로그 기본 커버',
          },
        ],
      },
    });
    render(<SiteProvider>{await BlogPostPage({ params })}</SiteProvider>);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '함께 만드는 첫 번째 페이지',
      }),
    ).toBeInTheDocument();
  });

  it('uses 404 only when a ready result has no matching post', async () => {
    getBlogPosts.mockResolvedValue({ status: 'ready', posts: [] });
    await expect(BlogPostPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
