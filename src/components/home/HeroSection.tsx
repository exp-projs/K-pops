'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Plus, ChevronDown, Star } from 'lucide-react';
import type { Drama } from '@/types/drama';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  dramas: Drama[];
}

export default function HeroSection({ dramas }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const drama = dramas[activeIndex] || dramas[0];

  // Auto-cycle every 8 seconds
  useEffect(() => {
    if (!dramas.length) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % dramas.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [dramas.length]);

  // Spotlight cursor effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (!dramas.length) return null;

  return (
    <section className={styles.hero} ref={heroRef} onMouseMove={handleMouseMove}>
      {/* Spotlight cursor */}
      <div
        className={styles.spotlight}
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Background with crossfade */}
      {dramas.map((d, i) => (
        <div
          key={d.id}
          className={`${styles.backdrop} ${i === activeIndex ? styles.backdropActive : ''}`}
          style={{ 
            backgroundImage: d.backdropPath ? `url(${d.backdropPath})` : 'none',
            backgroundColor: '#0a0a0f'
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          K-DRAMA
        </div>

        <h1 className={styles.title} key={drama.id + '-title'}>
          {drama.title}
        </h1>

        {drama.koreanTitle && (
          <p className={styles.koreanTitle}>{drama.koreanTitle}</p>
        )}

        <div className={styles.metaRow}>
          <span className={styles.rating}>
            <Star size={16} fill="#F5C518" stroke="#F5C518" />
            {drama.voteAverage?.toFixed(1) || 'N/A'}
          </span>
          <span className={styles.metaDivider}>•</span>
          <span>{drama.numberOfEpisodes || '??'} Episodes</span>
          <span className={styles.metaDivider}>•</span>
          <span>{drama.firstAirDate?.slice(0, 4) || 'TBA'}</span>
          <span className={styles.metaDivider}>•</span>
          {drama.genres.slice(0, 2).map((genre, i) => (
            <span key={i} className={styles.genreTag}>{genre}</span>
          ))}
        </div>

        <p className={styles.description}>{drama.overview}</p>

        <div className={styles.ctas}>
          <button className={styles.primaryBtn}>
            <Play size={18} fill="#fff" /> Watch Trailer
          </button>
          <button className={styles.secondaryBtn}>
            <Plus size={18} /> Add to List
          </button>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className={styles.dots}>
        {dramas.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <ChevronDown size={24} className={styles.scrollArrow} />
      </div>
    </section>
  );
}
