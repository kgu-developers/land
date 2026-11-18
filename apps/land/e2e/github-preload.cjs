// Only loaded by Playwright's webServer; never loaded by dev/build/start scripts.
const originalFetch = globalThis.fetch;
const posts = Array.from({ length: 8 }, (_, index) => ({
  number: 337 + index,
  title: `함께 만드는 페이지 ${index + 1}`,
  body: `### 글 유형\n\n${['개발', '소식', '팀 이야기'][index % 3]}\n\n### 요약\n\n공통의 기준을 만들고 개발 경험을 나누는 이야기입니다.\n\n### 대표 이미지\n\n_No response_\n\n### 이미지 설명\n\n_No response_\n\n### 태그\n\n협업, 개발\n\n### 본문\n\n## 함께 만드는 과정\n\n작은 시작이 더 나은 경험을 만듭니다.\n\n### 태그\n\n본문 안의 제목은 그대로 보존합니다.\n\n~~~ts\nconst team = 'kgu developers';\n~~~\n\n| 목표 | 내용 |\n| --- | --- |\n| 함께 배우기 | 경험 공유 |`,
  category: { slug: 'blog' },
  labels: {
    nodes: [
      { name: 'blog:published' },
      ...(index === 7 ? [{ name: 'blog:featured' }] : []),
    ],
    pageInfo: { hasNextPage: false },
  },
  author: {
    login: 'kgu-developers',
    avatarUrl: '',
    url: 'https://github.com/kgu-developers',
  },
  createdAt: `2026-11-${String(10 + index).padStart(2, '0')}T00:00:00Z`,
  updatedAt: `2026-11-${String(10 + index).padStart(2, '0')}T00:00:00Z`,
  url: `https://github.com/kgu-developers/land-client/discussions/${337 + index}`,
}));
globalThis.fetch = async (input, init) => {
  if (
    String(input) !== 'https://api.github.com/graphql' ||
    process.env.GITHUB_DISCUSSIONS_TOKEN !== 'e2e-fixture-token'
  )
    return originalFetch(input, init);
  const { query } = JSON.parse(init.body);
  if (query.includes('BlogCategory'))
    return Response.json({
      data: {
        repository: {
          discussionCategories: {
            nodes: [{ id: 'blog', slug: 'blog' }],
            pageInfo: { hasNextPage: false },
          },
        },
      },
    });
  return Response.json({
    data: {
      repository: {
        discussions: {
          nodes: [
            ...posts,
            { ...posts[0], number: 335, labels: { nodes: [] } },
            { ...posts[0], number: 336, body: '잘못된 형식' },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  });
};
