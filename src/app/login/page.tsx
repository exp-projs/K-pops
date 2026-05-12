'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { SiGithub, SiGoogle, SiDiscord, SiFacebook } from '@icons-pack/react-simple-icons';
import { createClient } from '@/utils/supabase/client';
import styles from './login.module.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/profile');
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
        },
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Success! Check your email to confirm your account.');
        // If email confirmation is off, it logs them in automatically
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          router.push('/profile');
          router.refresh();
        }
      }
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github' | 'discord' | 'facebook') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred during social login.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background Effects */}
      <div className={styles.background}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Join Hallyu'}</h1>
            <p className={styles.subtitle}>
              {isLogin ? 'Sign in to access your watchlist and community.' : 'Create an account to track your favorite dramas.'}
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: errorMsg.includes('Success') ? 'var(--success)' : 'var(--error)', marginBottom: '1rem', fontSize: '14px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
              {errorMsg}
            </div>
          )}

          <form className={styles.form} onSubmit={handleAuth}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="jungkook_fan99" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  type="email" 
                  className={styles.input} 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type="password" 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isLogin && (
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className={styles.divider}>or continue with</div>

          <div className={styles.socialLogins}>
            <button type="button" className={styles.socialBtn} onClick={() => handleOAuth('google')} title="Login with Google">
              <SiGoogle size={20} />
              <span>Google</span>
            </button>
            <button type="button" className={styles.socialBtn} onClick={() => handleOAuth('github')} title="Login with GitHub">
              <SiGithub size={20} />
              <span>GitHub</span>
            </button>
            <button type="button" className={styles.socialBtn} onClick={() => handleOAuth('discord')} title="Login with Discord">
              <SiDiscord size={20} />
              <span>Discord</span>
            </button>
            <button type="button" className={styles.socialBtn} onClick={() => handleOAuth('facebook')} title="Login with Facebook">
              <SiFacebook size={20} />
              <span>Facebook</span>
            </button>
          </div>

          <div className={styles.toggleView}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className={styles.toggleBtn} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
