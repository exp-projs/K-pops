import { watchlistApi } from '@/lib/api/watchlist';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Bookmark, Play, CheckCircle, Clock, Trash2, Edit2, Star, ChevronRight } from 'lucide-react';
import styles from './watchlist.module.css';

export const dynamic = 'force-dynamic';

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/watchlist');
  }

  const watchlist = await watchlistApi.getWatchlist();

  const categories = [
    { id: 'all', label: 'All', icon: Bookmark, count: watchlist.length },
    { id: 'watching', label: 'Watching', icon: Play, count: watchlist.filter(e => e.status === 'watching').length },
    { id: 'plan_to_watch', label: 'Plan to Watch', icon: Clock, count: watchlist.filter(e => e.status === 'plan_to_watch').length },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: watchlist.filter(e => e.status === 'completed').length },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Watchlist</h1>
          <p className={styles.subtitle}>Track your progress and rate your favorites</p>
        </div>

        <div className={styles.tabs}>
          {categories.map(cat => (
            <button key={cat.id} className={`${styles.tab} ${cat.id === 'all' ? styles.tabActive : ''}`}>
              <cat.icon size={18} />
              <span>{cat.label}</span>
              <span className={styles.tabCount}>{cat.count}</span>
            </button>
          ))}
        </div>

        {watchlist.length === 0 ? (
          <div className={styles.empty}>
            <Bookmark size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>Your list is empty</h2>
            <p>Start adding dramas to your watchlist to track them here!</p>
            <a href="/dramas" className={styles.browseBtn}>Browse Dramas</a>
          </div>
        ) : (
          <div className={styles.list}>
            {watchlist.map(entry => (
              <div key={entry.id} className={styles.entryRow}>
                <div className={styles.entryMain}>
                  <div className={styles.entryThumb}>
                    {/* Placeholder for drama image */}
                    <div className={styles.thumbPlaceholder}>
                       <Tv size={24} />
                    </div>
                  </div>
                  <div className={styles.entryDetails}>
                    <h3 className={styles.entryTitle}>Drama #{entry.tmdb_id}</h3>
                    <div className={styles.entryMeta}>
                      <span className={`${styles.statusBadge} ${styles['status_' + entry.status]}`}>
                        {entry.status.replace(/_/g, ' ')}
                      </span>
                      <span className={styles.entryDate}>Added {new Date(entry.added_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.entryStats}>
                  <div className={styles.progress}>
                    <span className={styles.progressLabel}>Episodes</span>
                    <span className={styles.progressValue}>{entry.episodes_watched} / --</span>
                  </div>
                  <div className={styles.rating}>
                    <Star size={16} fill={entry.rating ? "#F5C518" : "none"} stroke={entry.rating ? "#F5C518" : "currentColor"} />
                    <span>{entry.rating || 'No rating'}</span>
                  </div>
                </div>

                <div className={styles.entryActions}>
                  <button className={styles.actionBtn} title="Edit progress">
                    <Edit2 size={18} />
                  </button>
                  <button className={styles.deleteBtn} title="Remove from list">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add simple icons needed
function Tv({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>;
}
