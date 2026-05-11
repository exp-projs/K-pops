'use client';

import { useEffect, useRef, useState } from 'react';
import { Tv, Music, Users, Globe } from 'lucide-react';
import styles from './StatsStrip.module.css';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { label: 'Dramas in Database', value: 5000, suffix: '+', icon: <Tv size={24} /> },
  { label: 'K-Pop Artists', value: 2000, suffix: '+', icon: <Music size={24} /> },
  { label: 'Community Members', value: 48500, suffix: '+', icon: <Users size={24} /> },
  { label: 'Countries Reached', value: 190, suffix: '+', icon: <Globe size={24} /> },
];

function AnimatedCounter({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span className={styles.number}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.strip} ref={ref}>
      <div className={styles.inner}>
        {stats.map(stat => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.iconWrap}>{stat.icon}</div>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={visible} />
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
