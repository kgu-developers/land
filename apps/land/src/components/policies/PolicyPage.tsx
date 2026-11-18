import { Heading, Text } from '@aics/design-system';
import Link from 'next/link';

import * as styles from './PolicyPage.css';
import { policies } from '../../lib/policies';

export default function PolicyPage({ kind }: { kind: keyof typeof policies }) {
  const policy = policies[kind];
  return (
    <main>
      <header className={styles.header}>
        <Text color='secondary'>kgu developers · 정책</Text>
        <Heading level={1}>{policy.title}</Heading>
        <Text as='p' color='secondary'>
          {policy.introduction}
        </Text>
        <Text color='secondary' size='sm'>
          초안 작성일: 2026년 11월 18일 · 시행일: 미정
        </Text>
      </header>
      <aside className={styles.notice} aria-label='정책 초안 안내'>
        <strong>운영 확인 전 초안입니다.</strong>
        <p>
          연락처와 실제 정보 처리 방식은 추후 운영 회의에서 결정합니다. 이
          문안은 확정된 정책이 아니며, 결정한 내용을 반영한 후 정식 시행합니다.
        </p>
      </aside>
      <nav aria-label={`${policy.title} 목차`} className={styles.toc}>
        {policy.sections.map((section, index) => (
          <a key={section.title} href={`#section-${index + 1}`}>
            {section.title}
          </a>
        ))}
      </nav>
      {policy.sections.map((section, index) => (
        <section
          id={`section-${index + 1}`}
          key={section.title}
          className={styles.section}
        >
          <Heading level={2}>{section.title}</Heading>
          {section.paragraphs.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <nav aria-label='다른 정책' className={styles.related}>
        <Link href='/terms'>이용약관</Link>
        <Link href='/privacy'>개인정보처리방침</Link>
        <Link href='/copyright'>저작권 정책</Link>
      </nav>
    </main>
  );
}
