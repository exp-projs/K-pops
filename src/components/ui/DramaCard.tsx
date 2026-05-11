'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import { getPosterGradient } from '@/lib/utils';
import type { Drama } from '@/types/drama';
import styles from './DramaCard.module.css';

interface DramaCardProps {
  drama: Drama;
  index?: number;
  showRank?: boolean;
}

export default function DramaCard({ drama, index = 0, showRank }: DramaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/dramas/${drama.slug}`} className={styles.card}>
      {/* Poster */}
      <div className={styles.poster} style={imgError || !drama.posterPath ? { background: getPosterGradient(index) } : undefined}>
        {showRank && (
          <span className={styles.rank}>{index + 1}</span>
        )}

        {!imgError && drama.posterPath && (
          <div
            className={styles.posterImg}
            style={{ backgroundImage: `url(${drama.posterPath.startsWith('http') ? drama.posterPath : `https://image.tmdb.org/t/p/w342${drama.posterPath}`})` }}
            onError={() => setImgError(true)}
            role="img"
            aria-label={drama.title}
          />
        )}

        {/* Fallback gradient with title */}
        {(imgError || !drama.posterPath) && (
          <div className={styles.posterFallback}>
            <span className={styles.fallbackTitle}>{drama.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className={styles.hoverOverlay}>
          <p className={styles.synopsis}>{drama.overview}</p>
          <button className={styles.addBtn} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
            <Plus size={16} /> Add to List
          </button>
        </div>

        {/* Glow border on hover */}
        <div className={styles.glowBorder} />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{drama.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating}>
            <Star size={12} fill="#F5C518" stroke="#F5C518" />
            {drama.voteAverage?.toFixed(1) || 'N/A'}
          </span>
          <span className={styles.year}>{drama.firstAirDate?.slice(0, 4)}</span>
          <span className={styles.eps}>{drama.numberOfEpisodes} eps</span>
        </div>
        <div className={styles.genres}>
          {drama.genres.slice(0, 2).map((genre, i) => (
            <span key={i} className={styles.genrePill}>{genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
