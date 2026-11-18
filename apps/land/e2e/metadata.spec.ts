import { expect, test } from '@playwright/test';

test('public pages expose metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('kgu developers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');

  const script = page.locator('script[type="application/ld+json"]');
  const jsonLd = await script.textContent();
  expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({
    '@type': 'Organization',
    name: 'kgu developers',
  });
});

test('SEO endpoints stay non-indexable without a build-time origin', async ({
  request,
}) => {
  const [robots, sitemap] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
  ]);

  expect(robots.ok()).toBe(true);
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()['content-type']).toContain('application/xml');

  const robotsText = await robots.text();
  expect(robotsText).toContain('User-Agent: *');
  expect(robotsText).toContain('Disallow: /');
  expect(robotsText).not.toContain('Sitemap:');

  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain('<urlset');
  expect(sitemapXml).not.toContain('<loc>');
});
