'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import DramaCard from '@/components/ui/DramaCard';
import type { Drama } from '@/types/drama';
import styles from './ContentRow.module.css';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  koreanTitle?: string;
  dramas: Drama[];
  seeAllHref?: string;
  showRank?: boolean;
}

export default function ContentRow({ title, subtitle, koreanTitle, dramas, seeAllHref, showRank }: ContentRowProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            {koreanTitle && <span className={styles.koreanLabel}>{koreanTitle}</span>}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {seeAllHref && (
            <Link href={seeAllHref} className={styles.seeAll}>
              See All <ChevronRight size={16} />
            </Link>
          )}
        </div>

        <div className={styles.scrollRow}>
          {dramas.map((drama, i) => (
            <DramaCard key={drama.id} drama={drama} index={i} showRank={showRank} />
          ))}
        </div>
      </div>
    </section>
  );
}
