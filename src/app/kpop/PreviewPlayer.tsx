'use client';

import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import styles from './kpop.module.css';

interface PreviewPlayerProps {
  url: string;
}

export default function PreviewPlayer({ url }: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Pause all other audio elements if any
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current) el.pause();
      });
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      className={styles.playBtn} 
      onClick={togglePlay} 
      title={isPlaying ? "Pause Preview" : "Play Preview"}
    >
      {isPlaying ? (
        <Pause size={16} fill="var(--accent-rose)" />
      ) : (
        <Play size={16} fill="var(--accent-rose)" />
      )}
    </button>
  );
}
