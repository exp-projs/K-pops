import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoHighlight}>HALLYU</span>
            <span className={styles.logoDot}>.</span>
            <span>WORLD</span>
          </Link>
          <p className={styles.tagline}>Your universe of Korean culture — dramas, music, everything.</p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Explore</h4>
            <Link href="/dramas" className={styles.colLink}>K-Dramas</Link>
            <Link href="/kpop" className={styles.colLink}>K-Pop</Link>
            <Link href="/bts" className={styles.colLink}>BTS Universe</Link>
            <Link href="/rankings" className={styles.colLink}>Rankings</Link>
            <Link href="/recommend" className={styles.colLink}>AI 추천</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Community</h4>
            <Link href="/community" className={styles.colLink}>Discussion</Link>
            <Link href="/news" className={styles.colLink}>News</Link>
            <Link href="/community" className={styles.colLink}>Fan Art</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Account</h4>
            <Link href="/login" className={styles.colLink}>Sign In</Link>
            <Link href="/login" className={styles.colLink}>Create Account</Link>
            <Link href="/watchlist" className={styles.colLink}>My List</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {new Date().getFullYear()} HALLYU.WORLD. Made with 💜 for fans, by fans.</p>
        <p className={styles.disclaimer}>Data by TVmaze, iTunes Search API & Soompi. AI by Google Gemini.</p>
      </div>
    </footer>
  );
}
