import { expect, test } from '@playwright/test';

test('home renders team introduction and primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'KD Developers' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: '주 메뉴' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub에서 팀 프로젝트 보기' })).toHaveAttribute(
    'href',
    'https://github.com/kgu-developers',
  );
});

test('navigation reaches apply and blog routes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '지원' }).click();
  await expect(page).toHaveURL(/\/apply\/?$/);
  await expect(page.getByRole('heading', { name: '지원' })).toBeVisible();

  await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '블로그' }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
  await expect(page.getByRole('heading', { name: '블로그' })).toBeVisible();
});
