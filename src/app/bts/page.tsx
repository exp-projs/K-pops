import { Music, Play } from 'lucide-react';
import { btsMembers, btsArtist } from '@/lib/mock-data';
import { formatCompactNumber } from '@/lib/utils';
import { kpopApi } from '@/lib/api/kpop';
import MemberSelector from './MemberSelector';
import PreviewPlayer from '../kpop/PreviewPlayer';
import styles from './bts.module.css';

export default async function BTSPage() {
  const [topTracks, artistInfo] = await Promise.all([
    kpopApi.getArtistTracks('BTS', 12),
    kpopApi.getArtistInfo('BTS')
  ]);

  const btsStats = {
    ...btsArtist,
    genre: artistInfo?.genre || btsArtist.genre,
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.badge}><Music size={14} /> K-POP LEGENDS</span>
          <h1 className={styles.title}>BTS</h1>
          <p className={styles.koreanTitle}>방탄소년단</p>
          <p className={styles.subtitle}>Bangtan Sonyeondan · Beyond The Scene</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{formatCompactNumber(btsStats.monthlyListeners || 0)}</span>
              <span className={styles.heroStatLabel}>Monthly Listeners</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{formatCompactNumber(btsStats.followers || 0)}</span>
              <span className={styles.heroStatLabel}>Followers</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>2013</span>
              <span className={styles.heroStatLabel}>Debut Year</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>ARMY</span>
              <span className={styles.heroStatLabel}>Fandom</span>
            </div>
          </div>
        </div>
      </section>

      {/* Member Selector */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Members</h2>
          <p className={styles.sectionSub}>Click a member to see their solo work and details</p>
          <MemberSelector />
        </div>
      </section>

      {/* Military Tracker */}
      <section className={styles.section} style={{ background: 'var(--surface-dark)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Chapter Two Tracker</h2>
          <p className={styles.sectionSub}>Military service status — all members have completed service 💜</p>
          <div className={styles.timeline}>
            {btsMembers.map(member => (
              <div key={member.name} className={styles.timelineItem}>
                <div className={styles.timelineDot} style={{ background: member.color }} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineName}>{member.name}</span>
                  <span className={styles.timelineStatus}>
                    {member.militaryStatus?.status === 'completed' ? `✓ Completed · ${member.militaryStatus.branch}` : 'Active'}
                  </span>
                </div>
                <div className={styles.timelineBar}>
                  <div className={styles.timelineProgress} style={{ width: '100%', background: member.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Discography (Top Tracks) */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Top Tracks & Discography</h2>
          <p className={styles.sectionSub}>Powered by iTunes Search API</p>
          <div className={styles.discography}>
            {topTracks.map((track) => (
              <div key={track.id} className={styles.albumCard}>
                <div className={styles.albumArtWrap}>
                  <img src={track.artwork} alt={track.title} className={styles.albumArtImg} />
                  <div className={styles.albumArtOverlay}>
                    <PreviewPlayer url={track.previewUrl} />
                  </div>
                </div>
                <div className={styles.albumInfo}>
                  <span className={styles.albumTitle}>{track.title}</span>
                  <span className={styles.albumMeta}>{track.releaseDate.slice(0, 4)} · {track.album.slice(0, 25)}{track.album.length > 25 ? '...' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
