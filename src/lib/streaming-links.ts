/**
 * Streaming Platform Link Generator
 * Maps drama network/channel data to streaming platform URLs
 * These are deeplinks — swap in your affiliate IDs when you sign up
 */

export interface StreamingLink {
  platform: string;
  url: string;
  color: string;
  icon: string;
}

const PLATFORM_CONFIG: Record<string, { color: string; icon: string; baseUrl: string }> = {
  netflix: {
    color: '#E50914',
    icon: '🎬',
    baseUrl: 'https://www.netflix.com/search?q=',
  },
  viki: {
    color: '#1CBDCC',
    icon: '📺',
    baseUrl: 'https://www.viki.com/search?q=',
  },
  'disney+': {
    color: '#113CCF',
    icon: '✨',
    baseUrl: 'https://www.disneyplus.com/search?q=',
  },
  kocowa: {
    color: '#FF6B35',
    icon: '🇰🇷',
    baseUrl: 'https://www.kocowa.com/en_us/search?q=',
  },
  wetv: {
    color: '#00C8FF',
    icon: '🌏',
    baseUrl: 'https://wetv.vip/en/search?q=',
  },
  'apple tv+': {
    color: '#000000',
    icon: '🍎',
    baseUrl: 'https://tv.apple.com/search?q=',
  },
  youtube: {
    color: '#FF0000',
    icon: '▶️',
    baseUrl: 'https://www.youtube.com/results?search_query=',
  },
};

// Map network names from TVmaze to streaming platforms
const NETWORK_TO_PLATFORM: Record<string, string[]> = {
  'Netflix': ['netflix'],
  'tvN': ['viki', 'netflix', 'kocowa'],
  'JTBC': ['viki', 'netflix', 'kocowa'],
  'SBS': ['viki', 'kocowa'],
  'KBS2': ['viki', 'kocowa'],
  'KBS1': ['viki', 'kocowa'],
  'MBC': ['viki', 'kocowa'],
  'OCN': ['viki', 'kocowa'],
  'ENA': ['viki'],
  'Disney+': ['disney+'],
  'Channel A': ['viki'],
  'TV Chosun': ['viki'],
  'TVING': ['viki'],
  'Wavve': ['viki'],
};

export function getStreamingLinks(dramaTitle: string, networkName?: string): StreamingLink[] {
  const encodedTitle = encodeURIComponent(dramaTitle);
  
  // Get platforms based on network
  let platformKeys = ['viki', 'netflix']; // Default fallback
  
  if (networkName && NETWORK_TO_PLATFORM[networkName]) {
    platformKeys = NETWORK_TO_PLATFORM[networkName];
  }

  // Always add YouTube as a trailer source
  platformKeys = [...new Set([...platformKeys, 'youtube'])];

  return platformKeys
    .filter(key => PLATFORM_CONFIG[key])
    .map(key => {
      const config = PLATFORM_CONFIG[key];
      return {
        platform: key.charAt(0).toUpperCase() + key.slice(1),
        url: `${config.baseUrl}${encodedTitle}`,
        color: config.color,
        icon: config.icon,
      };
    });
}
