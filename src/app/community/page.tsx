import { communityApi } from '@/lib/api/community';
import Link from 'next/link';
import { Users, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import styles from './community.module.css';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const boards = await communityApi.getBoards();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Community Hub</h1>
            <p className={styles.subtitle}>Join the global conversation with fellow K-fans</p>
          </div>
          <Link href="/community/new" className={styles.createBtn}>
            <Plus size={20} /> New Post
          </Link>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Users size={20} /> Discussion Boards
              </h2>
              <div className={styles.boardGrid}>
                {boards.map(board => (
                  <Link key={board.id} href={`/community/${board.slug}`} className={styles.boardCard}>
                    <div className={styles.boardIcon}>{board.icon}</div>
                    <div className={styles.boardInfo}>
                      <h3 className={styles.boardName}>{board.name}</h3>
                      <p className={styles.boardDesc}>{board.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>
                <TrendingUp size={18} /> Trending Topics
              </h3>
              <ul className={styles.trendingList}>
                <li className={styles.trendingItem}>
                  <Link href="#">#SquidGameSeason2</Link>
                  <span>1.2k posts</span>
                </li>
                <li className={styles.trendingItem}>
                  <Link href="#">#BTSMilitaryReturn</Link>
                  <span>850 posts</span>
                </li>
                <li className={styles.trendingItem}>
                  <Link href="#">#HallyuWorldAwards</Link>
                  <span>430 posts</span>
                </li>
              </ul>
            </div>

            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Community Rules</h3>
              <ul className={styles.rulesList}>
                <li>Be respectful to all fans and idols.</li>
                <li>No spoilers without [SPOILER] tags.</li>
                <li>Keep content relevant to Hallyu culture.</li>
                <li>No fan-war or hate speech.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
