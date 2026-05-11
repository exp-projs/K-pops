import { Music, Calendar } from 'lucide-react';
import { kpopApi } from '@/lib/api/kpop';
import PreviewPlayer from './PreviewPlayer';
import styles from './kpop.module.css';

export default async function KPopPage() {
  const [chartData, featuredArtists] = await Promise.all([
    kpopApi.getTrendingTracks(10),
    kpopApi.getFeaturedArtists()
  ]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.badge}><Music size={14} /> K-POP HUB</span>
          <h1 className={styles.title}>K-Pop</h1>
          <p className={styles.subtitle}>Discover artists, chart toppers, and upcoming comebacks</p>
        </div>
      </section>

      {/* Chart */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔥 Global K-Pop Chart</h2>
          <div className={styles.chart}>
            {chartData.map((item, i) => (
              <div key={item.id} className={styles.chartItem}>
                <span className={styles.chartRank}>{i + 1}</span>
                <img src={item.artwork} alt={item.title} className={styles.chartImg} />
                <div className={styles.chartInfo}>
                  <span className={styles.chartSong}>{item.title}</span>
                  <span className={styles.chartArtist}>{item.artist}</span>
                </div>
                <span className={styles.chartStreams}>{item.album.length > 20 ? item.album.slice(0, 20) + '...' : item.album}</span>
                <PreviewPlayer url={item.previewUrl} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Directory */}
      <section className={styles.section} style={{ background: 'var(--surface-dark)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Artist Directory</h2>
          <p className={styles.sectionSub}>Explore the biggest names in the industry</p>
          <div className={styles.artistGrid}>
            {featuredArtists.map(a => (
              <a key={a.id} href={a.name === 'BTS' ? '/bts' : '#'} className={styles.artistCard}>
                <div className={styles.artistStrip} />
                <img src={a.artwork} alt={a.name} className={styles.artistImg} />
                <span className={styles.artistName}>{a.name}</span>
                <span className={styles.artistType}>{a.genre}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Comeback Calendar Preview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><Calendar size={20} /> Upcoming Comebacks</h2>
          <div className={styles.comebacks}>
            {[
              { date: 'May 15', artist: 'BTS', event: 'Reunion Album Drop', confirmed: true },
              { date: 'May 20', artist: 'BLACKPINK', event: 'World Tour Kickoff', confirmed: true },
              { date: 'Jun 1', artist: 'Stray Kids', event: 'New Mini Album', confirmed: true },
              { date: 'Jun 10', artist: 'NewJeans', event: 'Summer Single', confirmed: false },
            ].map((cb, i) => (
              <div key={i} className={styles.comebackItem}>
                <span className={styles.comebackDate}>{cb.date}</span>
                <div className={styles.comebackInfo}>
                  <span className={styles.comebackArtist}>{cb.artist}</span>
                  <span className={styles.comebackEvent}>{cb.event}</span>
                </div>
                <span className={cb.confirmed ? styles.confirmed : styles.rumored}>
                  {cb.confirmed ? 'Confirmed' : 'Rumored'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
