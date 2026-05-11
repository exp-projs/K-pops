'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Tv } from 'lucide-react';
import { tvmaze } from '@/lib/api/tvmaze';
import type { Drama } from '@/types/drama';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await tvmaze.searchDramas(query);
        setResults(data.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search dramas, actors..."
            className={styles.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.centerState}>
              <Loader2 size={24} className={styles.spinner} />
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.results}>
              <h3 className={styles.resultsTitle}>Dramas</h3>
              {results.map(drama => (
                <button
                  key={drama.id}
                  className={styles.resultItem}
                  onClick={() => {
                    onClose();
                    router.push(`/dramas/${drama.slug}`);
                  }}
                >
                  {drama.posterPath ? (
                    <img src={drama.posterPath} alt={drama.title} className={styles.resultImg} />
                  ) : (
                    <div className={styles.resultPlaceholder}><Tv size={20} /></div>
                  )}
                  <div className={styles.resultInfo}>
                    <span className={styles.resultTitle}>{drama.title}</span>
                    <span className={styles.resultMeta}>
                      {drama.firstAirDate?.slice(0, 4)} • {drama.genres.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </button>
              ))}
              <button 
                className={styles.viewAllBtn}
                onClick={() => {
                  onClose();
                  router.push(`/dramas`); // Could pass query as param later
                }}
              >
                View all results
              </button>
            </div>
          ) : query.trim() ? (
            <div className={styles.centerState}>
              No results found for "{query}"
            </div>
          ) : (
            <div className={styles.initialState}>
              <p>Type to search for your favorite K-Dramas.</p>
              <div className={styles.shortcutHints}>
                <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd></span>
                <span>Select: <kbd>Enter</kbd></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
