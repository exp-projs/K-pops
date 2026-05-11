export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  countryCode: string | null;
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
  stats?: UserStats;
}

export interface UserStats {
  dramasWatched: number;
  episodesWatched: number;
  totalWatchTimeMinutes: number;
  reviewsWritten: number;
  followersCount: number;
  followingCount: number;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  conditionValue: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: string;
  achievement: Achievement;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'like' | 'follow' | 'achievement' | 'new_episode' | 'system';
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
