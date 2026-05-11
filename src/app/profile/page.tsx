import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import styles from './profile.module.css';

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the profile data from public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {profile?.display_name?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.name}>{profile?.display_name || 'Fan'}</h1>
            <p className={styles.username}>@{profile?.username}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account Details</h2>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{user.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Joined</span>
              <span className={styles.detailValue}>
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button className={styles.signOutBtn} type="submit">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
