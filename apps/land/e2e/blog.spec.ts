import { expect, test } from '@playwright/test';

test('lists, filters, paginates and opens published Discussions', async ({
  page,
}) => {
  await page.goto('/blog');
  await expect(page.locator('main article')).toHaveCount(6);
  await expect(
    page.getByRole('heading', { level: 2, name: '함께 만드는 페이지 8' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 3, name: '함께 만드는 페이지 7' }),
  ).toBeVisible();
  await page.getByRole('link', { name: '다음 →' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('main article')).toHaveCount(2);
  await expect(page.locator('main h2')).toHaveCount(2);
  await expect(page.locator('main h3')).toHaveCount(0);
  await page
    .getByRole('navigation', { name: '글 유형 필터' })
    .getByRole('link', { name: '개발 (3)', exact: true })
    .click();
  await expect(page).not.toHaveURL(/page=2/);
  await expect(page.locator('main article')).toHaveCount(3);
  await page
    .getByRole('heading', { name: '함께 만드는 페이지 1', exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\/337$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '함께 만드는 페이지 1',
  );
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('pre code')).toContainText('kgu developers');
  await expect(
    page.getByRole('link', { name: 'GitHub에서 원문과 댓글 보기 ↗' }),
  ).toHaveAttribute('href', /discussions\/337$/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'article',
  );
});

test('unpublished, malformed and absent posts cannot be opened directly', async ({
  page,
}) => {
  for (const number of ['335', '336', '999999', 'invalid']) {
    const response = await page.goto(`/blog/${number}`);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: '페이지를 찾을 수 없습니다' }),
    ).toBeVisible();
  }
});

test('policy links show drafts and header actions stay unassigned', async ({
  page,
}) => {
  await page.goto('/blog');
  const navigation = page.getByRole('navigation', { name: '주 메뉴' });
  await expect(
    navigation.getByRole('link', { name: 'Blog', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  for (const name of ['검색', '테마 변경', '커뮤니티', 'GitHub', 'Apply']) {
    await navigation.getByRole('button', { name, exact: true }).click();
    await expect(page).toHaveURL(/\/blog$/);
  }
  for (const name of ['이용약관', '개인정보처리방침', '저작권 정책']) {
    await page
      .getByRole('navigation', { name: '정책 메뉴' })
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await expect(page.getByText('운영 확인 전 초안입니다.')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  }
});

test('mobile layouts fit and preserve navigation, cards and policy links', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/blog', '/blog/337', '/privacy']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page
        .getByRole('navigation', { name: '주 메뉴' })
        .getByRole('link', { name: 'Blog', exact: true }),
    ).toBeVisible();
  }
});
