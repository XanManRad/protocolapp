'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Crosshair, LayoutDashboard, Sparkles } from 'lucide-react';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Hide navigation on landing page
  if (pathname === '/') return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Crosshair size={22} />
          <span className={styles.logoText}>Protocol</span>
        </Link>

        <div className={styles.links}>
          <Link
            href="/onboarding"
            className={`${styles.link} ${pathname === '/onboarding' ? styles.active : ''}`}
          >
            <Sparkles size={16} />
            <span>New Protocol</span>
          </Link>
          <Link
            href="/dashboard"
            className={`${styles.link} ${pathname === '/dashboard' ? styles.active : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
        </div>

        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
