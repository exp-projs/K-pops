'use client';

import { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { Drama, Episode, CastMember } from '@/types/drama';
import { formatDate } from '@/lib/utils';
import styles from './drama-detail.module.css';

const detailTabs = ['Overview', 'Episodes', 'Cast & Crew', 'Reviews', 'Discussion', 'Photos'];

interface DramaDetailTabsProps {
  drama: Drama & { episodes: Episode[]; cast: CastMember[] };
}

export default function DramaDetailTabs({ drama }: DramaDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <>
      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {detailTabs.map(tab => (
            <button 
              key={tab} 
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'Overview' && (
          <div className={styles.overview}>
            <div className={styles.mainCol}>
              <h2 className={styles.sectionTitle}>Synopsis</h2>
              <p className={styles.synopsis}>{drama.overview || 'No synopsis available.'}</p>

              <h2 className={styles.sectionTitle}>Top Cast</h2>
              <div className={styles.castGrid}>
                {drama.cast.slice(0, 6).map(member => (
                  <div key={member.id} className={styles.castCard}>
                    {member.profilePath ? (
                      <img src={member.profilePath} alt={member.name} className={styles.castAvatarImg} />
                    ) : (
                      <div className={styles.castAvatar}>{member.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className={styles.castName}>{member.name}</p>
                      <p className={styles.castCharacter}>as {member.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Details</h3>
                <div className={styles.infoRow}><span>Network</span><span>{drama.networks?.[0]?.name || 'Unknown'}</span></div>
                <div className={styles.infoRow}><span>Status</span><span>{drama.status}</span></div>
                <div className={styles.infoRow}><span>First Aired</span><span>{formatDate(drama.firstAirDate)}</span></div>
                <div className={styles.infoRow}><span>Language</span><span>Korean</span></div>
                <div className={styles.infoRow}><span>Country</span><span>{drama.networks?.[0]?.originCountry || 'South Korea'}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Episodes' && (
          <div className={styles.episodeList}>
            {drama.episodes.length > 0 ? (
              drama.episodes.map(ep => (
                <div key={ep.id} className={styles.episodeItem}>
                  <span className={styles.epNumber}>{String(ep.episodeNumber).padStart(2, '0')}</span>
                  <div className={styles.epThumb}>
                    {ep.stillPath ? (
                      <img src={ep.stillPath} alt={ep.name} className={styles.epThumbImg} />
                    ) : (
                      <Play size={16} />
                    )}
                  </div>
                  <div className={styles.epInfo}>
                    <p className={styles.epTitle}>{ep.name}</p>
                    <p className={styles.epMeta}>{formatDate(ep.airDate)} · {ep.runtime}min · ★ {ep.voteAverage?.toFixed(1) || 'N/A'}</p>
                  </div>
                  <button className={styles.epWatched}><CheckCircle size={18} /></button>
                </div>
              ))
            ) : (
              <p className={styles.emptyMsg}>No episode data available.</p>
            )}
          </div>
        )}

        {activeTab === 'Cast & Crew' && (
          <div className={styles.castFullGrid}>
            {drama.cast.map(member => (
              <div key={member.id} className={styles.castFullCard}>
                {member.profilePath ? (
                  <img src={member.profilePath} alt={member.name} className={styles.castAvatarLgImg} />
                ) : (
                  <div className={styles.castAvatarLg}>{member.name.charAt(0)}</div>
                )}
                <p className={styles.castName}>{member.name}</p>
                <p className={styles.castCharacter}>{member.character}</p>
              </div>
            ))}
          </div>
        )}

        {(activeTab === 'Reviews' || activeTab === 'Discussion' || activeTab === 'Photos') && (
          <div className={styles.placeholder}>
            <p>This section will be available once the community features are launched.</p>
            <button className={styles.primaryBtn} style={{ marginTop: 'var(--space-4)' }}>Join to Contribute</button>
          </div>
        )}
      </div>
    </>
  );
}
