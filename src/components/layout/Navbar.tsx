'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Tv, Music, Newspaper, Trophy, Users, BookmarkPlus, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';
import SearchModal from './SearchModal';
import { createClient } from '@/utils/supabase/client';
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
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

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

          {user ? (
            <div className={styles.profileContainer}>
              <button 
                className={styles.profileBtn}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className={styles.avatar}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} />
              </button>

              {showProfileMenu && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                    <span className={styles.premiumBadge}>VIP</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setShowProfileMenu(false)}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link href="/watchlist" className={styles.dropdownItem} onClick={() => setShowProfileMenu(false)}>
                    <BookmarkPlus size={16} /> Watchlist
                  </Link>
                  <Link href="/community" className={styles.dropdownItem} onClick={() => setShowProfileMenu(false)}>
                    <Users size={16} /> Community
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={styles.signOutBtn} onClick={handleSignOut}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.joinBtn}>
              Join
            </Link>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
