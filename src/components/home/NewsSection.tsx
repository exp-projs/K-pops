'use client';

import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import type { NewsArticle } from '@/lib/api/news';
import styles from './NewsSection.module.css';

const categoryColors: Record<string, string> = {
  'Drama': 'var(--accent-rose)',
  'K-Pop': 'var(--accent-violet)',
  'Celebrity': 'var(--accent-cyan)',
  'Industry': 'var(--accent-gold)',
  'BTS': 'var(--accent-violet-light)',
};

interface NewsSectionProps {
  news?: NewsArticle[];
}

export default function NewsSection({ news = [] }: NewsSectionProps) {
  if (!news.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Latest Buzz</h2>
            <p className={styles.subtitle}>Breaking news from the K-culture world</p>
          </div>
          <Link href="/news" className={styles.seeAll}>
            All News <ChevronRight size={16} />
          </Link>
        </div>

        <div className={styles.grid}>
          {news.map(article => (
            <a key={article.id} href={article.url} className={styles.card} target="_blank" rel="noopener noreferrer">
              <div className={styles.cardThumb}>
                <div className={styles.thumbPlaceholder}>
                  <span style={{ color: categoryColors[article.category] || 'var(--text-muted)' }}>
                    {article.category.includes('Music') || article.category === 'K-Pop' ? '♪' : '★'}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.categoryPill} style={{ color: categoryColors[article.category] || 'var(--text-muted)', background: `${categoryColors[article.category] || '#ffffff'}15` }}>
                  {article.category}
                </span>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.source}>{article.source}</span>
                  <span className={styles.metaDot}>•</span>
                  <span>{timeAgo(article.publishedAt)}</span>
                  <ExternalLink size={12} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
