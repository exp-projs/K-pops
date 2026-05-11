'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import type { Drama } from '@/types/drama';
import type { KPopArtist, KPopTrack } from '@/lib/api/kpop';
import styles from './RankingsPreview.module.css';

const tabs = ['Top Dramas', 'Top Idols', 'Top Tracks'] as const;

interface RankingsPreviewProps {
  topDramas?: Drama[];
  topIdols?: KPopArtist[];
  topTracks?: KPopTrack[];
}

export default function RankingsPreview({ topDramas = [], topIdols = [], topTracks = [] }: RankingsPreviewProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Top Dramas');

  // Format data dynamically based on the active tab
  let items: any[] = [];

  if (activeTab === 'Top Dramas') {
    items = topDramas.map((d, i) => ({
      rank: i + 1,
      name: d.title,
      sub: `${d.networks?.[0]?.name || 'Web'} · ${d.firstAirDate?.slice(0, 4) || 'TBA'}`,
      score: d.voteAverage?.toFixed(1) || '0.0',
      change: i === 0 ? 0 : (i % 3) - 1, // Deterministic simulated change
      isStar: true,
    }));
  } else if (activeTab === 'Top Idols') {
    items = topIdols.map((a, i) => ({
      rank: i + 1,
      name: a.name,
      sub: a.genre,
      score: Math.floor(100 - i * 2.5), // Simulated popularity score
      change: i === 0 ? 0 : ((i + 1) % 3) - 1,
      isStar: false,
    }));
  } else if (activeTab === 'Top Tracks') {
    items = topTracks.map((t, i) => ({
      rank: i + 1,
      name: t.title,
      sub: `${t.album} · ${t.artist}`,
      score: 100 - i * 2, // Simulated score
      change: i === 0 ? 0 : ((i + 2) % 3) - 1,
      isStar: false,
    }));
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>This Week&apos;s Rankings</h2>
          <div className={styles.tabs}>
            {tabs.map(tab => (
               <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.list}>
          {items.map(item => (
            <div key={item.rank} className={styles.item}>
              <span className={styles.rank}>{item.rank}</span>
              <div className={styles.change}>
                {item.change > 0 && <><TrendingUp size={14} className={styles.up} /> <span className={styles.up}>+{item.change}</span></>}
                {item.change < 0 && <><TrendingDown size={14} className={styles.down} /> <span className={styles.down}>{item.change}</span></>}
                {item.change === 0 && <Minus size={14} className={styles.neutral} />}
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemSub}>{item.sub}</span>
              </div>
              <span className={styles.score}>
                {item.isStar ? (
                  <><Star size={12} fill="#F5C518" stroke="#F5C518" /> {item.score}</>
                ) : (
                  item.score
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
