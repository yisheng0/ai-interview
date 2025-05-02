'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './navbar.module.css';
import { ThemeToggle } from '@/components/theme-toggle';

/**
 * 导航栏组件
 * 包含网站导航链接和主题切换按钮
 */
export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Next待办应用</div>
      <div className={styles.links}>
        <Link 
          href="/" 
          className={pathname === '/' ? styles.active : ''}
        >
          首页
        </Link>
        <Link 
          href="/reports" 
          className={pathname === '/reports' ? styles.active : ''}
        >
          日报
        </Link>
      </div>
      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar; 