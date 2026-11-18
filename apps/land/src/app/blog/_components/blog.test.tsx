import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BlogMarkdown from './BlogMarkdown';
import BlogRetry from './BlogRetry';
import PostCard from './PostCard';
import SiteProvider from '../../../components/site/SiteProvider';
import { discussionFixture } from '../../../lib/blog/fixtures';
import { discussionToPost } from '../../../lib/blog/model';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

afterEach(() => refresh.mockClear());

describe('blog content', () => {
  it('renders a card that links to a stable Discussion number', () => {
    render(
      <SiteProvider>
        <PostCard post={discussionToPost(discussionFixture)!} />
      </SiteProvider>,
    );
    expect(
      screen.getByRole('link', { name: /함께 만드는 첫 번째 페이지/ }),
    ).toHaveAttribute('href', '/blog/337');
    expect(screen.getByText('kgu-developers')).toBeInTheDocument();
    expect(
      screen
        .getByRole('img', { name: 'kgu developers 블로그 기본 커버' })
        .getAttribute('src'),
    ).toMatch(/\/images\/blog-cover\.svg$/);
  });
  it.each([2, 3] as const)('uses the parent-provided h%s level', level => {
    render(
      <SiteProvider>
        <PostCard
          post={discussionToPost(discussionFixture)!}
          headingLevel={level}
        />
      </SiteProvider>,
    );
    expect(
      screen.getByRole('heading', {
        name: '함께 만드는 첫 번째 페이지',
        level,
      }),
    ).toBeInTheDocument();
  });
  it('refreshes the current route from the retry action', () => {
    render(
      <SiteProvider>
        <BlogRetry />
      </SiteProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(refresh).toHaveBeenCalledOnce();
  });
  it('renders GFM and code without executing HTML or unsafe links', () => {
    const { container } = render(
      <BlogMarkdown
        content={
          '# 본문 제목\n\n```js\nalert("text only")\n```\n\n<script>alert(1)</script>\n\n[위험](javascript:alert(1))\n\n![위험한 이미지](data:image/svg+xml,evil)\n\n| 제목 | 값 |\n| --- | --- |\n| 항목 | 내용 |'
        }
      />,
    );
    expect(
      screen.getByRole('heading', { name: '본문 제목', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.querySelector('img[src^="data:"]')).toBeNull();
    expect(container.querySelector('pre code')).toHaveTextContent(
      'alert("text only")',
    );
  });
});
