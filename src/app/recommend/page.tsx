'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot, User, RefreshCw } from 'lucide-react';
import styles from './recommend.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const moodCards = [
  { emoji: '💔', label: '실연', sub: 'Heartbroken', prompt: 'I just went through a breakup and need a good cry. Recommend dramas that will make me sob but also heal.' },
  { emoji: '😂', label: '웃기다', sub: 'Need Laughs', prompt: 'I want to laugh until my stomach hurts. Give me the funniest K-dramas with great comedy.' },
  { emoji: '🔥', label: '액션', sub: 'Action & Thrills', prompt: 'I want intense action, thriller, and suspense. Edge-of-my-seat K-dramas please!' },
  { emoji: '🌸', label: '로맨스', sub: 'Light Romance', prompt: 'I want sweet, light-hearted romance. Butterflies in my stomach kind of dramas.' },
  { emoji: '🧠', label: '미스터리', sub: 'Mystery', prompt: 'I love solving puzzles. Recommend K-dramas with amazing plot twists and mysteries.' },
  { emoji: '👑', label: '사극', sub: 'Historical', prompt: 'I want to be transported to Joseon dynasty. Best historical Korean dramas please!' },
  { emoji: '🌟', label: '판타지', sub: 'Fantasy', prompt: 'I love fantasy, supernatural, and sci-fi elements in dramas. Take me to another world!' },
  { emoji: '🏥', label: '의학', sub: 'Medical', prompt: 'I love medical dramas. Recommend the best Korean hospital/doctor dramas.' },
];

export default function RecommendPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMoods, setShowMoods] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowMoods(false);
    setIsLoading(true);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6), // Keep last 6 for context
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([]);
    setShowMoods(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className={styles.title}>할류봇 <span className={styles.titleSub}>HallyuBot</span></h1>
            <p className={styles.subtitle}>Your AI K-Drama Concierge · Powered by Google Gemini</p>
          </div>
          {messages.length > 0 && (
            <button className={styles.resetBtn} onClick={resetChat} title="Start over">
              <RefreshCw size={18} />
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          {/* Welcome State */}
          {showMoods && (
            <div className={styles.welcome}>
              <p className={styles.welcomeText}>
                안녕하세요! 💜 Tell me what you&apos;re in the mood for, or pick a vibe below:
              </p>
              <div className={styles.moodGrid}>
                {moodCards.map(mood => (
                  <button
                    key={mood.label}
                    className={styles.moodCard}
                    onClick={() => sendMessage(mood.prompt)}
                  >
                    <span className={styles.moodEmoji}>{mood.emoji}</span>
                    <span className={styles.moodLabel}>{mood.label}</span>
                    <span className={styles.moodSub}>{mood.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
              <div className={styles.messageAvatar}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.messageBubble}>
                {msg.role === 'assistant' ? (
                  <div className={styles.markdownContent} dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.messageAvatar}><Bot size={16} /></div>
              <div className={styles.messageBubble}>
                <div className={styles.typingIndicator}>
                  <Loader2 size={16} className={styles.spin} />
                  <span>할류봇 is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form className={styles.inputBar} onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything about K-dramas... 어떤 드라마를 볼까요?"
            className={styles.input}
            disabled={isLoading}
          />
          <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n/g, '<br/>');
}
