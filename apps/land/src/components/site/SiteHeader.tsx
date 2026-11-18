'use client';

import { Button, IconButton, TopNav, TopNavItem } from '@aics/design-system';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as styles from './SiteHeader.css';
import { teamName } from '../../lib/site';

export const headerActions = {
  search: () => {
    /* TODO(KD3-337): 검색 트리거 연결 */
  },
  theme: () => {
    /* TODO(KD3-337): 테마 트리거 연결 */
  },
  community: () => {
    /* TODO(KD3-337): 커뮤니티 트리거 연결 */
  },
  github: () => {
    /* TODO(KD3-337): GitHub 트리거 연결 */
  },
  apply: () => {
    /* TODO(KD3-337): 지원 트리거 연결 */
  },
};

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/apply', label: 'Apply' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <TopNav
        label='주 메뉴'
        className={styles.navigation}
        heading={
          <Link href='/' aria-label={`${teamName} 홈`} className={styles.brand}>
            <Image
              src='/images/logo-placeholder.svg'
              width={32}
              height={32}
              alt=''
            />
          </Link>
        }
        centerContent={navigation.map(item => (
          <TopNavItem
            key={item.href}
            as={Link}
            href={item.href}
            label={item.label}
            isSelected={
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            }
          />
        ))}
        endContent={
          <div className={styles.actions}>
            {(
              [
                ['search', '검색', 'search'],
                ['theme', '테마 변경', 'moon'],
                ['community', '커뮤니티', 'heart'],
                ['github', 'GitHub', 'code'],
              ] as const
            ).map(([action, label, icon]) => (
              <IconButton
                key={action}
                label={label}
                variant='ghost'
                size='sm'
                icon={
                  <Image
                    src={`/icons/${icon}.svg`}
                    alt=''
                    width={16}
                    height={16}
                  />
                }
                onClick={headerActions[action]}
              />
            ))}
            <Button
              label='Apply'
              variant='primary'
              size='sm'
              onClick={headerActions.apply}
            />
          </div>
        }
      />
    </header>
  );
}
