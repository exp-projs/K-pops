'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Tv, Music, Newspaper, Trophy, Users, BookmarkPlus, Sparkles } from 'lucide-react';
import SearchModal from './SearchModal';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/dramas', label: 'Dramas', icon: Tv },
  { href: '/kpop', label: 'K-Pop', icon: Music },
  { href: '/recommend', label: 'AI 추천', icon: Sparkles },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/watchlist', label: 'My List', icon: BookmarkPlus },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoHighlight}>HALLYU</span>
          <span className={styles.logoDot}>.</span>
          <span className={styles.logoWorld}>WORLD</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          <button 
            className={styles.iconBtn} 
            aria-label="Search (Ctrl+K)" 
            title="Search (Cmd+K)"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
          </button>
          <button className={styles.iconBtn} aria-label="Notifications" title="Notifications">
            <Bell size={20} />
            <span className={styles.notifDot} />
          </button>
          <Link href="/login" className={styles.joinBtn}>
            Join
          </Link>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
