import type { Discussion } from './model';

// Fixtures used only by tests; production never substitutes these for live posts.
export const discussionFixture: Discussion = {
  number: 337,
  title: '함께 만드는 첫 번째 페이지',
  body: '### 글 유형\n\n개발\n\n### 요약\n\n공통 컴포넌트를 만들며 배운 점을 정리합니다.\n\n### 대표 이미지\n\n_No response_\n\n### 이미지 설명\n\n_No response_\n\n### 태그\n\nNext.js, 협업\n\n### 본문\n\n## 공통의 기준 만들기\n\n작은 컴포넌트부터 함께 시작합니다.\n\n```ts\nconst team = "kgu developers";\n```\n\n| 항목 | 내용 |\n| --- | --- |\n| 목표 | 함께 배우기 |',
  category: { slug: 'blog' },
  labels: { nodes: [{ name: 'blog:published' }] },
  author: {
    login: 'kgu-developers',
    avatarUrl: '',
    url: 'https://github.com/kgu-developers',
  },
  createdAt: '2026-11-18T00:00:00Z',
  updatedAt: '2026-11-18T00:00:00Z',
  url: 'https://github.com/kgu-developers/land-client/discussions/337',
};
