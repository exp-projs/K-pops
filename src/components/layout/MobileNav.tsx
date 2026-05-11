'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Music, Newspaper, User } from 'lucide-react';
import styles from './MobileNav.module.css';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dramas', label: 'Dramas', icon: Tv },
  { href: '/kpop', label: 'K-Pop', icon: Music },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
        return (
          <Link key={tab.href} href={tab.href} className={`${styles.tab} ${isActive ? styles.active : ''}`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className={styles.label}>{tab.label}</span>
            {isActive && <span className={styles.indicator} />}
          </Link>
        );
      })}
    </nav>
  );
}
