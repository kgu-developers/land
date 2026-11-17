import { expect, test } from '@playwright/test';

test('public landing pages expose semantic metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('KD Developers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('script[type="application/ld+json"]')).toContainText(
    '"@type":"Organization"',
  );
});

test('SEO endpoints are available', async ({ request }) => {
  const [robots, sitemap] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
  ]);

  expect(robots.ok()).toBe(true);
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<urlset');
});
