import { Badge, EmptyState, Heading, Text } from '@aics/design-system';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogPosts } from '../../../lib/blog/github';
import { formatPostDate, openGraphImage } from '../../../lib/blog/model';
import { pageMetadata, siteUrl, teamName } from '../../../lib/site';
import * as styles from '../_components/blog.css';
import BlogImage from '../_components/BlogImage';
import BlogMarkdown from '../_components/BlogMarkdown';
import BlogRetry from '../_components/BlogRetry';
import PostMeta from '../_components/PostMeta';

type Props = { params: Promise<{ number: string }> };
async function resolvePost(params: Props['params']) {
  const { number } = await params;
  if (!/^[1-9]\d{0,9}$/.test(number)) notFound();
  const result = await getBlogPosts();
  return {
    ...result,
    post: result.posts.find(post => post.number === Number(number)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await resolvePost(params);
  if (!post)
    return {
      title: '글을 불러올 수 없습니다',
      robots: { index: false, follow: false },
    };
  const metadata = pageMetadata(
    `/blog/${post.number}`,
    post.title,
    post.summary,
  );
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.login],
      images: [{ url: openGraphImage(post), alt: post.coverAlt }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { post, status } = await resolvePost(params);
  if (status !== 'ready')
    return (
      <main>
        <EmptyState
          title={
            status === 'error'
              ? '글을 불러오지 못했습니다'
              : '블로그를 준비하고 있습니다'
          }
          description='잠시 후 다시 방문해 주세요.'
          actions={
            status === 'error' ? (
              <BlogRetry />
            ) : (
              <Link href='/blog'>블로그로 돌아가기</Link>
            )
          }
        />
      </main>
    );
  if (!post) notFound();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.login,
      url: post.author.url,
    },
    publisher: { '@type': 'Organization', name: teamName },
    ...(siteUrl && {
      url: new URL(`/blog/${post.number}`, siteUrl).href,
      image: new URL(post.cover, siteUrl).href,
    }),
  };
  return (
    <main>
      <article>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        <header className={styles.articleHeader}>
          <nav aria-label='현재 위치' className={styles.breadcrumb}>
            <Link href='/blog'>블로그</Link>
            <span>/</span>
            <Link href={`/blog?type=${encodeURIComponent(post.type)}`}>
              {post.type}
            </Link>
          </nav>
          <Heading level={1}>{post.title}</Heading>
          <Text as='p' color='secondary'>
            {post.summary}
          </Text>
          <PostMeta post={post} />
        </header>
        <BlogImage
          src={post.cover}
          alt={post.coverAlt}
          className={styles.articleCover}
          priority
        />
        <BlogMarkdown content={post.content} />
        <div className={styles.tags}>
          {post.tags.map(tag => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
        <footer className={styles.articleFooter}>
          <Link href='/blog'>← 전체 글 보기</Link>
          <a href={post.url}>GitHub에서 원문과 댓글 보기 ↗</a>
          {post.updatedAt !== post.createdAt && (
            <span>마지막 수정 {formatPostDate(post.updatedAt)}</span>
          )}
        </footer>
      </article>
    </main>
  );
}
