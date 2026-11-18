import Image from 'next/image';
import Link from 'next/link';

import * as styles from './SiteFooter.css';
import { teamGithub, teamName } from '../../lib/site';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <Link href='/' className={styles.brand}>
          {teamName}
        </Link>
        <nav aria-label='푸터 메뉴' className={styles.links}>
          <Link href='/'>Home</Link>
          <Link href='/blog'>Blog</Link>
          <Link href='/apply'>Apply</Link>
        </nav>
        <div className={styles.social}>
          <a
            href={teamGithub}
            aria-label='kgu developers GitHub'
            className={styles.socialLink}
          >
            <Image src='/icons/footer-code.svg' alt='' width={16} height={16} />
          </a>
          <Link
            href='/blog'
            aria-label='팀 이야기'
            className={styles.socialLink}
          >
            <Image
              src='/icons/footer-heart.svg'
              alt=''
              width={16}
              height={16}
            />
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>{teamName} Team</span>
        <nav aria-label='정책 메뉴' className={styles.links}>
          <Link href='/terms'>이용약관</Link>
          <Link href='/privacy'>개인정보처리방침</Link>
          <Link href='/copyright'>저작권 정책</Link>
        </nav>
        <span className={styles.copyright}>
          ©{new Date().getUTCFullYear()} {teamName}
        </span>
      </div>
    </footer>
  );
}
