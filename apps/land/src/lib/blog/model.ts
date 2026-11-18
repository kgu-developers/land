import remarkParse from 'remark-parse';
import { unified } from 'unified';

export const blogTypes = ['소식', '개발', '팀 이야기'] as const;
export const defaultBlogCover = '/images/blog-cover.svg';
export const defaultBlogOpenGraphImage = '/images/blog-cover-og.png';
export type BlogType = (typeof blogTypes)[number];
export type BlogPost = {
  number: number;
  title: string;
  summary: string;
  type: BlogType;
  cover: string;
  coverAlt: string;
  tags: string[];
  content: string;
  author: { login: string; avatarUrl: string; url: string };
  createdAt: string;
  updatedAt: string;
  url: string;
  featured: boolean;
  readingMinutes: number;
};

export type Discussion = Pick<
  BlogPost,
  'number' | 'title' | 'author' | 'createdAt' | 'updatedAt' | 'url'
> & {
  body: string;
  category: { slug: string };
  labels: { nodes: { name: string }[]; pageInfo?: { hasNextPage: boolean } };
};

export function safeImageUrl(value: string): string | undefined {
  // Never allow protocol-relative URLs, SVG/HTML data URLs, or arbitrary schemes.
  if (/^\/images\/[\w./-]+$/.test(value) && !value.includes('..')) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password)
      return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

const formFields = [
  '글 유형',
  '요약',
  '대표 이미지',
  '이미지 설명',
  '태그',
  '본문',
];

/** GitHub form responses use level-three headings. Parse AST nodes, not fences. */
export function parseDiscussionForm(
  markdown: string,
): Record<string, string> | null {
  const nodes = unified().use(remarkParse).parse(markdown).children;
  const sections: Record<string, string> = {};
  let fieldIndex = 0;
  let contentStart = 0;
  for (const node of nodes) {
    if (node.type !== 'heading' || node.depth !== 3) continue;
    const label = node.children
      .map(child => ('value' in child ? child.value : ''))
      .join('')
      .trim();
    if (label !== formFields[fieldIndex]) continue;
    const previousField = formFields[fieldIndex - 1];
    if (previousField) {
      sections[previousField] = markdown
        .slice(contentStart, node.position?.start.offset)
        .trim();
    }
    contentStart = node.position?.end.offset ?? 0;
    fieldIndex++;
    if (label === '본문') {
      sections[label] = markdown.slice(contentStart).trim();
      return sections;
    }
  }
  return null;
}

function optionalField(value = '') {
  return ['', '_No response_', 'No response', '없음'].includes(value.trim())
    ? ''
    : value.trim();
}

export function discussionToPost(
  discussion: Discussion,
  category = 'blog',
): BlogPost | null {
  const labels = discussion.labels.nodes.map(label => label.name);
  if (
    discussion.category.slug !== category ||
    !labels.includes('blog:published')
  )
    return null;
  const fields = parseDiscussionForm(discussion.body);
  if (!fields || !blogTypes.includes(fields['글 유형'] as BlogType))
    return null;
  const summary = fields['요약'];
  const content = fields['본문'];
  if (
    !summary ||
    !optionalField(summary) ||
    summary.length > 240 ||
    !content ||
    !optionalField(content) ||
    !discussion.title.trim()
  )
    return null;
  if (
    Number.isNaN(Date.parse(discussion.createdAt)) ||
    Number.isNaN(Date.parse(discussion.updatedAt))
  )
    return null;
  const coverInput = optionalField(fields['대표 이미지']);
  const cover = coverInput ? safeImageUrl(coverInput) : defaultBlogCover;
  const coverAlt = optionalField(fields['이미지 설명']);
  if (!cover || (coverInput && !coverAlt)) return null;
  const tags = optionalField(fields['태그'])
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
  if (tags.length > 8 || tags.some(tag => tag.length > 30)) return null;
  const words = content
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/u)
    .filter(Boolean).length;
  return {
    number: discussion.number,
    title: discussion.title.trim(),
    summary,
    type: fields['글 유형'] as BlogType,
    cover,
    coverAlt: coverAlt || 'kgu developers 블로그 기본 커버',
    tags: [...new Set(tags)],
    content,
    author: discussion.author,
    createdAt: discussion.createdAt,
    updatedAt: discussion.updatedAt,
    url: discussion.url,
    featured: labels.includes('blog:featured'),
    readingMinutes: Math.max(1, Math.ceil(words / 200)),
  };
}

export function openGraphImage(post: BlogPost) {
  return post.cover === defaultBlogCover
    ? defaultBlogOpenGraphImage
    : post.cover;
}

export function selectPosts(
  posts: BlogPost[],
  type: string,
  page: number,
  pageSize = 6,
) {
  const filtered =
    type === '전체' ? posts : posts.filter(post => post.type === type);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  return {
    posts: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    totalPages,
    currentPage,
    total: filtered.length,
  };
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(new Date(date));
}
