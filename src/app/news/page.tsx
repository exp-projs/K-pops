'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { mockNews } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import styles from './news.module.css';

const categories = ['All', 'K-Drama', 'K-Pop', 'BTS', 'Celebrity', 'Industry'];

const categoryColors: Record<string, string> = {
  'Drama': 'var(--accent-rose)', 'K-Pop': 'var(--accent-violet)',
  'Celebrity': 'var(--accent-cyan)', 'Industry': 'var(--accent-gold)',
  'BTS': 'var(--accent-violet-light)',
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const allNews = [...mockNews, ...mockNews.map((n, i) => ({ ...n, id: `extra-${i}` }))];

  return (
    <div className={styles.page}>
      {/* Breaking Ticker */}
      <div className={styles.ticker}>
        <span className={styles.tickerLabel}>BREAKING</span>
        <div className={styles.tickerScroll}>
          <span className={styles.tickerText}>
            BTS announces surprise reunion concert in Seoul • Netflix confirms Season 2 of hit K-Drama • BLACKPINK member Lisa breaks solo streaming record • New K-Drama ratings system launched by CJ ENM •&nbsp;
            BTS announces surprise reunion concert in Seoul • Netflix confirms Season 2 of hit K-Drama • BLACKPINK member Lisa breaks solo streaming record •
          </span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Latest News</h1>
          <p className={styles.subtitle}>Breaking news from the K-culture world</p>
        </div>

        {/* Category filters */}
        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <a href="#" className={styles.featured}>
          <div className={styles.featuredThumb}>
            <span>★</span>
          </div>
          <div className={styles.featuredContent}>
            <span className={styles.featuredPill} style={{ color: 'var(--accent-rose)', background: 'rgba(255,60,110,0.12)' }}>FEATURED</span>
            <h2 className={styles.featuredTitle}>K-Drama Golden Age: How Korean Television Conquered the World in 2026</h2>
            <p className={styles.featuredExcerpt}>From Netflix record-breakers to cultural phenomena, Korean dramas have reshaped global entertainment. Here&apos;s the full story of how Hallyu became unstoppable.</p>
            <div className={styles.featuredMeta}>
              <span>Soompi</span> · <span>5 min read</span> · <span>Today</span>
            </div>
          </div>
        </a>

        {/* News Grid */}
        <div className={styles.grid}>
          {allNews.map(article => (
            <a key={article.id} href={article.url} className={styles.card}>
              <div className={styles.cardThumb}>
                <span style={{ color: categoryColors[article.category] || 'var(--text-muted)' }}>
                  {article.category === 'K-Pop' ? '♪' : article.category === 'Drama' ? '▶' : '★'}
                </span>
              </div>
              <span className={styles.cardPill} style={{ color: categoryColors[article.category], background: `${categoryColors[article.category]}15` }}>
                {article.category}
              </span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.cardExcerpt}>{article.excerpt}</p>
              <div className={styles.cardMeta}>
                <span>{article.source}</span> · <span>{timeAgo(article.publishedAt)}</span>
                <ExternalLink size={11} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
