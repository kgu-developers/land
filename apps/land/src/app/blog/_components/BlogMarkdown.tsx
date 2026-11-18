import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import * as styles from './blog.css';
import BlogImage from './BlogImage';
import { safeImageUrl } from '../../../lib/blog/model';

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className={styles.prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => (
            <a href={href} rel='noopener noreferrer'>
              {children}
            </a>
          ),
          img: ({ src, alt }) => {
            const safeSrc =
              typeof src === 'string' ? safeImageUrl(src) : undefined;
            return safeSrc ? (
              <BlogImage
                src={safeSrc}
                alt={alt || '본문 이미지'}
                className={styles.inlineImage}
              />
            ) : (
              <span>{alt}</span>
            );
          },
          table: ({ children }) => (
            <div className={styles.tableScroll}>
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
