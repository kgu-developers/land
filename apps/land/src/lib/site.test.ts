import { describe, expect, it } from 'vitest';

import { description, pageMetadata, teamName } from './site';

describe('pageMetadata', () => {
  it('includes the page title and description', () => {
    const metadata = pageMetadata('/apply', '지원', description);

    expect(metadata.title).toBe('지원');
    expect(metadata.description).toBe(description);
    expect(metadata.openGraph).toMatchObject({
      title: '지원',
      description,
      locale: 'ko_KR',
      type: 'website',
    });
  });

  it('uses the team name consistently', () => {
    expect(teamName).toBe('kgu developers');
  });
});
