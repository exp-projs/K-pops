import { communityApi } from '@/lib/api/community';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, Heart, Eye, Clock, Plus } from 'lucide-react';
import styles from '../community.module.css';

export const dynamic = 'force-dynamic';

interface BoardPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const boards = await communityApi.getBoards();
  const board = boards.find(b => b.slug === slug);
  const posts = await communityApi.getPosts(slug);

  if (!board) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1>Board Not Found</h1>
          <Link href="/community">Back to Community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.boardHeader}>
          <Link href="/community" className={styles.backLink}>
            <ChevronLeft size={16} /> Community Hub
          </Link>
          <div className={styles.boardTitleRow}>
            <div className={styles.boardIdentity}>
              <span className={styles.boardLargeIcon}>{board.icon}</span>
              <div>
                <h1 className={styles.boardHeading}>{board.name}</h1>
                <p className={styles.boardDescription}>{board.description}</p>
              </div>
            </div>
            <Link href={`/community/${slug}/new`} className={styles.createBtn}>
              <Plus size={20} /> Create Post
            </Link>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <MessageSquare size={48} strokeWidth={1} />
                <h3>No posts yet</h3>
                <p>Be the first one to start a conversation in {board.name}!</p>
              </div>
            ) : (
              <div className={styles.postList}>
                {posts.map(post => (
                  <Link key={post.id} href={`/community/post/${post.id}`} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                          {post.profiles?.display_name?.charAt(0) || 'F'}
                        </div>
                        <div className={styles.authorMeta}>
                          <span className={styles.authorName}>{post.profiles?.display_name || 'Fan'}</span>
                          <span className={styles.postDate}>
                            <Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {post.type && <span className={styles.postTypeBadge}>{post.type}</span>}
                    </div>

                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.body.slice(0, 160)}...</p>

                    <div className={styles.postFooter}>
                      <div className={styles.postStats}>
                        <span className={styles.stat}>
                          <Heart size={16} /> {post._count?.reactions || 0}
                        </span>
                        <span className={styles.stat}>
                          <MessageSquare size={16} /> {post._count?.comments || 0}
                        </span>
                        <span className={styles.stat}>
                          <Eye size={16} /> {post.view_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            {/* Same sidebar as main community page or specialized board info */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Board Stats</h3>
              <div className={styles.statRow}>
                <span>Total Posts</span>
                <span>{posts.length}</span>
              </div>
              <div className={styles.statRow}>
                <span>Active Fans</span>
                <span>{Math.ceil(posts.length * 1.5)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
