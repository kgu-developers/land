import type { ReactNode } from 'react';

import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import * as styles from './SiteLayout.css';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <a href='#main-content' className={styles.skipLink}>
        본문 바로가기
      </a>
      <SiteHeader />
      <div id='main-content' tabIndex={-1} className={styles.content}>
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
