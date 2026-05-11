import { Star, Plus, Share2, CheckCircle, Play, Calendar, Clock, Film, ChevronRight, ExternalLink } from 'lucide-react';
import { tvmaze } from '@/lib/api/tvmaze';
import { formatDate, formatRuntime } from '@/lib/utils';
import { getStreamingLinks } from '@/lib/streaming-links';
import DramaCard from '@/components/ui/DramaCard';
import DramaDetailTabs from './DramaDetailTabs';
import styles from './drama-detail.module.css';

interface DramaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DramaPageProps) {
  const { slug } = await params;
  try {
    const drama = await tvmaze.getDramaBySlug(slug);
    return {
      title: `${drama.title} — K-Drama`,
      description: drama.overview?.slice(0, 160) || `Watch ${drama.title} on HALLYU.WORLD`,
      openGraph: {
        title: `${drama.title} | HALLYU.WORLD`,
        description: drama.overview?.slice(0, 160),
        images: drama.posterPath ? [{ url: drama.posterPath }] : [],
      },
    };
  } catch {
    return { title: 'Drama Not Found' };
  }
}

export default async function DramaDetailPage({ params }: DramaPageProps) {
  const { slug } = await params;
  
  try {
    const dramaData = await tvmaze.getDramaBySlug(slug);
    const related = (await tvmaze.getTrendingDramas()).filter(d => d.id !== dramaData.id).slice(0, 6);
    const streamingLinks = getStreamingLinks(dramaData.title, dramaData.networks?.[0]?.name);

    return (
      <div className={styles.page}>
        {/* Hero Banner */}
        <div className={styles.hero} style={{ backgroundImage: dramaData.backdropPath ? `url(${dramaData.backdropPath})` : 'none', backgroundColor: '#1a0a2e' }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.posterWrap}>
              {dramaData.posterPath ? (
                <img src={dramaData.posterPath} alt={dramaData.title} className={styles.posterImg} />
              ) : (
                <div className={styles.poster} style={{ background: 'linear-gradient(135deg, #2d1b4e, #1a0a2e)' }}>
                  <span className={styles.posterTitle}>{dramaData.title}</span>
                </div>
              )}
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.title}>{dramaData.title}</h1>
              {dramaData.koreanTitle && <p className={styles.koreanTitle}>{dramaData.koreanTitle}</p>}

              <div className={styles.metaRow}>
                {dramaData.genres.map((genre, i) => (
                  <span key={i} className={styles.genrePill}>{genre}</span>
                ))}
                <span className={styles.metaItem}><Calendar size={14} /> {dramaData.firstAirDate?.slice(0, 4)}</span>
                <span className={styles.metaItem}><Film size={14} /> {dramaData.numberOfEpisodes || '??'} Episodes</span>
                <span className={styles.metaItem}><Clock size={14} /> {formatRuntime(dramaData.episodeRunTime?.[0] || 60)}/ep</span>
                <span className={styles.statusBadge}>{dramaData.status === 'Ended' ? 'Completed' : 'Airing'}</span>
              </div>

              <div className={styles.ratingRow}>
                <div className={styles.ratingBig}>
                  <Star size={24} fill="#F5C518" stroke="#F5C518" />
                  <span className={styles.ratingValue}>{dramaData.voteAverage?.toFixed(1) || 'N/A'}</span>
                  <span className={styles.ratingMax}>/10</span>
                </div>
                <span className={styles.ratingCount}>{dramaData.popularity?.toFixed(0)} weight</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}><Plus size={18} /> Add to Watchlist</button>
                <button className={styles.iconAction}><Star size={18} /><span>Rate</span></button>
                <button className={styles.iconAction}><Share2 size={18} /><span>Share</span></button>
                <button className={styles.iconAction}><CheckCircle size={18} /><span>Seen It</span></button>
              </div>

              {/* Where to Watch — Affiliate Links */}
              <div className={styles.streamOn}>
                <span className={styles.streamLabel}>어디서 볼까? Where to Watch:</span>
                <div className={styles.streamLinks}>
                  {streamingLinks.map(link => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.streamBadge}
                      style={{ borderColor: link.color }}
                    >
                      <span>{link.icon}</span>
                      {link.platform}
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs (Client Component) */}
        <DramaDetailTabs drama={dramaData} />

        {/* Related Dramas */}
        <div className={styles.related}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.sectionTitle}>You Might Also Like</h2>
            <a href="/dramas" className={styles.seeAll}>See All <ChevronRight size={16} /></a>
          </div>
          <div className={styles.relatedScroll}>
            {related.map((d, i) => <DramaCard key={d.id} drama={d} index={i} />)}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.errorPage}>
        <h1>Drama Not Found</h1>
        <p>Sorry, we couldn't find the drama you're looking for.</p>
        <a href="/dramas" className={styles.primaryBtn}>Back to Browse</a>
      </div>
    );
  }
}
