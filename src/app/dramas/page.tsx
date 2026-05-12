'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import DramaCard from '@/components/ui/DramaCard';
import { mdlApi } from '@/lib/api/mdl';
import type { Drama } from '@/types/drama';
import styles from './dramas.module.css';

const genres = ['All', 'Romance', 'Drama', 'Comedy', 'Thriller', 'Fantasy', 'Action', 'Mystery', 'Crime', 'Sci-Fi', 'Historical'];
const networks = ['All', 'Netflix', 'tvN', 'JTBC', 'KBS', 'MBC', 'SBS', 'Disney+', 'Viki'];
const years = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
const sortOptions = ['Popularity', 'Rating', 'Newest', 'Oldest', 'A-Z'];

export default function DramasBrowsePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [showFilters, setShowFilters] = useState(false);
  
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeFilters = [selectedGenre, selectedNetwork, selectedYear].filter(f => f !== 'All');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let results: Drama[] = [];
        if (searchQuery) {
          results = await mdlApi.searchDramas(searchQuery);
        } else {
          results = await mdlApi.getTrendingDramas();
        }

        // Apply local filtering for genre/network/year if needed
        // (MDL API live scrapers don't support complex combined server-side filtering for search)
        let filtered = results;
        if (selectedGenre !== 'All') {
          filtered = filtered.filter(d => d.genres.includes(selectedGenre));
        }
        if (selectedYear !== 'All') {
          filtered = filtered.filter(d => d.firstAirDate.startsWith(selectedYear));
        }

        // Apply sorting
        filtered.sort((a, b) => {
          if (selectedSort === 'Rating') return (b.voteAverage || 0) - (a.voteAverage || 0);
          if (selectedSort === 'Newest') return new Date(b.firstAirDate).getTime() - new Date(a.firstAirDate).getTime();
          if (selectedSort === 'Oldest') return new Date(a.firstAirDate).getTime() - new Date(b.firstAirDate).getTime();
          if (selectedSort === 'A-Z') return a.title.localeCompare(b.title);
          return (b.popularity || 0) - (a.popularity || 0);
        });

        setDramas(filtered);
      } catch (error) {
        console.error('Failed to fetch dramas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedYear, selectedSort]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>K-Dramas</h1>
            <p className={styles.pageSubtitle}>Discover your next obsession from the MyDramaList universe</p>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search dramas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.toolbarActions}>
            <button className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={18} />
              Filters
              {activeFilters.length > 0 && <span className={styles.filterCount}>{activeFilters.length}</span>}
            </button>

            <div className={styles.sortWrap}>
              <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)} className={styles.sortSelect}>
                {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className={styles.sortIcon} />
            </div>

            <div className={styles.viewToggle}>
              <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
                <Grid3X3 size={18} />
              </button>
              <button className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('list')} aria-label="List view">
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className={styles.activeFilters}>
            {activeFilters.map(f => (
              <span key={f} className={styles.filterChip}>
                {f}
                <button onClick={() => {
                  if (f === selectedGenre) setSelectedGenre('All');
                  if (f === selectedNetwork) setSelectedNetwork('All');
                  if (f === selectedYear) setSelectedYear('All');
                }}><X size={12} /></button>
              </span>
            ))}
            <button className={styles.clearAll} onClick={() => { setSelectedGenre('All'); setSelectedNetwork('All'); setSelectedYear('All'); }}>Clear all</button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Genre</label>
              <div className={styles.filterOptions}>
                {genres.map(g => (
                  <button key={g} className={`${styles.filterOption} ${selectedGenre === g ? styles.filterOptionActive : ''}`} onClick={() => setSelectedGenre(g)}>{g}</button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Network</label>
              <div className={styles.filterOptions}>
                {networks.map(n => (
                  <button key={n} className={`${styles.filterOption} ${selectedNetwork === n ? styles.filterOptionActive : ''}`} onClick={() => setSelectedNetwork(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year</label>
              <div className={styles.filterOptions}>
                {years.map(y => (
                  <button key={y} className={`${styles.filterOption} ${selectedYear === y ? styles.filterOptionActive : ''}`} onClick={() => setSelectedYear(y)}>{y}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className={styles.resultCount}>
          {isLoading ? 'Searching...' : `Found ${dramas.length} dramas`}
        </p>

        {/* Drama Grid */}
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {isLoading ? (
             <div className={styles.loading}>Loading results...</div>
          ) : dramas.length > 0 ? (
            dramas.map((drama, i) => (
              <DramaCard key={`${drama.id}-${i}`} drama={drama} index={i} />
            ))
          ) : (
            <div className={styles.noResults}>No dramas found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
