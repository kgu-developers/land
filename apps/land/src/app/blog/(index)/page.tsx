import { EmptyState, Heading, Text } from '@aics/design-system';
import Link from 'next/link';

import { getBlogPosts } from '../../../lib/blog/github';
import { blogTypes, selectPosts } from '../../../lib/blog/model';
import { pageMetadata, teamName } from '../../../lib/site';
import * as styles from '../_components/blog.css';
import BlogRetry from '../_components/BlogRetry';
import PostCard from '../_components/PostCard';

const metadata = pageMetadata(
  '/blog',
  '블로그',
  `${teamName}의 소식, 개발 경험, 함께 만드는 이야기`,
);

export async function generateMetadata() {
  const result = await getBlogPosts();
  return result.status === 'ready'
    ? metadata
    : { ...metadata, robots: { index: false, follow: false } };
}

type Props = {
  searchParams: Promise<{ type?: string | string[]; page?: string | string[] }>;
};
function pageHref(type: string, page: number) {
  const query = new URLSearchParams();
  if (type !== '전체') query.set('type', type);
  if (page > 1) query.set('page', String(page));
  return query.size ? `/blog?${query}` : '/blog';
}

export default async function BlogPage({ searchParams }: Props) {
  const query = await searchParams;
  const type =
    typeof query.type === 'string' &&
    blogTypes.includes(query.type as (typeof blogTypes)[number])
      ? query.type
      : '전체';
  const requestedPage =
    typeof query.page === 'string' && /^[1-9]\d{0,6}$/.test(query.page)
      ? Number(query.page)
      : 1;
  const result = await getBlogPosts();
  const selection = selectPosts(result.posts, type, requestedPage);
  const pagePosts = [...selection.posts];
  // Promote a selected featured post within its page; otherwise lead with the latest post.
  const featuredIndex = pagePosts.findIndex(post => post.featured);
  const featured =
    selection.currentPage === 1
      ? pagePosts.splice(Math.max(0, featuredIndex), 1)[0]
      : undefined;
  return (
    <main>
      <div className={styles.introduction}>
        <Heading level={1}>블로그</Heading>
        <Text as='p' color='secondary'>
          함께 만들고, 배우고, 경험을 나누는 {teamName}의 이야기
        </Text>
      </div>
      <nav aria-label='글 유형 필터' className={styles.filters}>
        {['전체', ...blogTypes].map(item => (
          <Link
            key={item}
            href={pageHref(item, 1)}
            className={styles.filter}
            aria-current={type === item ? 'true' : undefined}
          >
            {item}{' '}
            <span>
              (
              {item === '전체'
                ? result.posts.length
                : result.posts.filter(post => post.type === item).length}
              )
            </span>
          </Link>
        ))}
      </nav>
      {result.status === 'error' ? (
        <EmptyState
          headingLevel={2}
          title='글을 불러오지 못했습니다'
          description='잠시 후 다시 시도해 주세요.'
          actions={<BlogRetry />}
        />
      ) : result.status === 'unconfigured' ? (
        <EmptyState
          headingLevel={2}
          title='첫 이야기를 준비하고 있습니다'
          description='kgu developers의 소식과 개발 이야기를 곧 전해드릴게요.'
        />
      ) : selection.total === 0 ? (
        <EmptyState
          headingLevel={2}
          title='아직 등록된 글이 없습니다'
          description='새로운 이야기가 올라오면 이곳에서 만나볼 수 있습니다.'
        />
      ) : (
        <>
          {featured && (
            <div className={styles.featured}>
              <PostCard post={featured} featured />
            </div>
          )}
          <div className={styles.grid}>
            {pagePosts.map(post => (
              <PostCard
                key={post.number}
                post={post}
                headingLevel={featured ? 3 : 2}
              />
            ))}
          </div>
          {selection.totalPages > 1 && (
            <nav aria-label='블로그 페이지' className={styles.pagination}>
              {selection.currentPage > 1 && (
                <Link
                  className={styles.pageLink}
                  href={pageHref(type, selection.currentPage - 1)}
                >
                  ← 이전
                </Link>
              )}
              <span aria-current='page'>
                {selection.currentPage} / {selection.totalPages}
              </span>
              {selection.currentPage < selection.totalPages && (
                <Link
                  className={styles.pageLink}
                  href={pageHref(type, selection.currentPage + 1)}
                >
                  다음 →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </main>
  );
}
