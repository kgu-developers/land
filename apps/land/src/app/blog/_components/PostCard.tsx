import { Heading, Text } from '@aics/design-system';
import Link from 'next/link';

import * as styles from './blog.css';
import BlogImage from './BlogImage';
import PostMeta from './PostMeta';
import type { BlogPost } from '../../../lib/blog/model';

export default function PostCard({
  post,
  featured = false,
  headingLevel = 2,
}: {
  post: BlogPost;
  featured?: boolean;
  headingLevel?: 2 | 3;
}) {
  return (
    <article className={styles.card}>
      <Link href={`/blog/${post.number}`} className={styles.cardLink}>
        <BlogImage
          src={post.cover}
          alt={post.coverAlt}
          className={styles.cover}
          priority={featured}
        />
        <div className={styles.cardCopy}>
          <Heading level={headingLevel}>{post.title}</Heading>
          <Text as='p' color='secondary' maxLines={2}>
            {post.summary}
          </Text>
        </div>
        <PostMeta post={post} />
      </Link>
    </article>
  );
}
