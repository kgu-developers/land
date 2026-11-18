import { expect, test } from '@playwright/test';

test('home renders team details and navigation', async ({ page }) => {
  await page.goto('/');
  const title = page.getByRole('heading', { name: 'KD Developers' });
  const navigation = page.getByRole('navigation', { name: '주 메뉴' });
  const githubLink = page.getByRole('link', { name: /GitHub/ });

  await expect(title).toBeVisible();
  await expect(navigation).toBeVisible();
  const href = await githubLink.getAttribute('href');
  expect(href).toBe('https://github.com/kgu-developers');
});

test('navigation visits apply and blog', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: '주 메뉴' });
  await navigation.getByRole('link', { name: '지원' }).click();
  await expect(page).toHaveURL(/\/apply\/?$/);
  await expect(page.getByRole('heading', { name: '지원' })).toBeVisible();

  await navigation.getByRole('link', { name: '블로그' }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
  await expect(page.getByRole('heading', { name: '블로그' })).toBeVisible();
});
