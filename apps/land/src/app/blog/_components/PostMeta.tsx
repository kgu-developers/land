import { Avatar } from '@aics/design-system';

import * as styles from './blog.css';
import { formatPostDate, type BlogPost } from '../../../lib/blog/model';

export default function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className={styles.meta}>
      <Avatar
        name={post.author.login}
        src={post.author.avatarUrl || undefined}
        size={24}
        tooltip={false}
      />
      <span>{post.author.login}</span>
      <span aria-hidden='true'>·</span>
      <time dateTime={post.createdAt}>{formatPostDate(post.createdAt)}</time>
      <span aria-hidden='true'>·</span>
      <span>{post.readingMinutes}분 읽기</span>
    </div>
  );
}
