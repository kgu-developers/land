import {
  description,
  pageMetadata,
  siteUrl,
  teamGithub,
  teamName,
} from '../lib/site';

export const metadata = {
  ...pageMetadata('/', teamName, description),
  title: { absolute: teamName },
};

export default function Home() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: teamName,
    description,
    url: siteUrl,
    sameAs: [teamGithub],
  };
  return (
    <main>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, '\\u003c'),
        }}
      />
      <h1>{teamName}</h1>
      <p>{description}</p>
      <a href={teamGithub}>GitHub에서 팀 프로젝트 보기</a>
    </main>
  );
}
