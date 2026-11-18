import { describe, expect, it } from 'vitest';

import { discussionFixture } from './fixtures';
import {
  discussionToPost,
  openGraphImage,
  parseDiscussionForm,
  safeImageUrl,
  selectPosts,
} from './model';

describe('Discussion publication contract', () => {
  it('maps the GitHub form, preserves code and derives metadata', () => {
    const post = discussionToPost(discussionFixture);
    expect(post).toMatchObject({
      number: 337,
      type: '개발',
      tags: ['Next.js', '협업'],
      readingMinutes: 1,
      cover: '/images/blog-cover.svg',
    });
    expect(post?.content).toContain('```ts');
    expect(post?.content).not.toContain('### 요약');
  });
  it('excludes unpublished discussions and discussions from another category', () => {
    expect(
      discussionToPost({ ...discussionFixture, labels: { nodes: [] } }),
    ).toBeNull();
    expect(
      discussionToPost({ ...discussionFixture, category: { slug: 'general' } }),
    ).toBeNull();
  });
  it('does not mistake a heading inside a code fence for a form field', () => {
    const body = discussionFixture.body.replace(
      '### 태그',
      '```md\n### 본문\n```\n\n### 태그',
    );
    expect(parseDiscussionForm(body)?.['본문']).toMatch(/^## 공통의 기준/);
  });
  it.each([
    [
      '요약 누락',
      '공통 컴포넌트를 만들며 배운 점을 정리합니다.',
      '_No response_',
    ],
    [
      '너무 긴 요약',
      '공통 컴포넌트를 만들며 배운 점을 정리합니다.',
      '가'.repeat(241),
    ],
    ['지원하지 않는 유형', '\n개발\n', '\n기타\n'],
    ['형식 누락', '### 요약', '## 요약'],
  ])('%s 글을 제외한다', (_name, from, to) => {
    expect(
      discussionToPost({
        ...discussionFixture,
        body: discussionFixture.body.replace(from, to),
      }),
    ).toBeNull();
  });
  it('requires image descriptions for supplied covers', () => {
    const body = discussionFixture.body.replace(
      '_No response_',
      'https://example.com/cover.png',
    );
    expect(discussionToPost({ ...discussionFixture, body })).toBeNull();
    expect(
      discussionToPost({
        ...discussionFixture,
        body: body.replace('_No response_', '팀 협업 장면'),
      })?.cover,
    ).toBe('https://example.com/cover.png');
  });
  it('uses a raster Open Graph fallback without changing the UI cover', () => {
    const fallbackPost = discussionToPost(discussionFixture)!;
    expect(fallbackPost.cover).toBe('/images/blog-cover.svg');
    expect(openGraphImage(fallbackPost)).toBe('/images/blog-cover-og.png');
    expect(
      openGraphImage({
        ...fallbackPost,
        cover: 'https://example.com/cover.png',
      }),
    ).toBe('https://example.com/cover.png');
  });
  it('rejects unsafe image protocols and local path traversal', () => {
    for (const src of [
      'javascript:alert(1)',
      'data:image/svg+xml,test',
      '//example.com/x',
      '/images/../file',
      'http://example.com/x',
    ])
      expect(safeImageUrl(src)).toBeUndefined();
    expect(
      safeImageUrl('https://github.com/user-attachments/assets/abc'),
    ).toBeTruthy();
  });
  it('filters before paginating and clamps invalid page bounds', () => {
    const post = discussionToPost(discussionFixture)!;
    const posts = Array.from({ length: 15 }, (_, i) => ({
      ...post,
      number: i,
      type: i < 7 ? ('개발' as const) : ('소식' as const),
    }));
    expect(selectPosts(posts, '개발', 99)).toMatchObject({
      currentPage: 2,
      totalPages: 2,
      total: 7,
      posts: [{ number: 6 }],
    });
    expect(selectPosts(posts, '팀 이야기', 1).posts).toEqual([]);
  });
});
