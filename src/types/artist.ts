export interface Artist {
  id: string;
  name: string;
  koreanName: string;
  slug: string;
  type: 'boy_group' | 'girl_group' | 'solo_male' | 'solo_female' | 'sub_unit';
  debutDate: string;
  agency: string;
  spotifyId?: string;
  youtubeChannelId?: string;
  fandomName?: string;
  color: string;
  members?: ArtistMember[];
  isActive: boolean;
  imageUrl: string;
  monthlyListeners?: number;
  followers?: number;
}

export interface ArtistMember {
  name: string;
  koreanName: string;
  color: string;
  role: string;
  birthDate?: string;
  imageUrl?: string;
  spotifyId?: string;
  isActive: boolean;
  militaryStatus?: MilitaryStatus;
}

export interface MilitaryStatus {
  status: 'active_duty' | 'completed' | 'not_enlisted' | 'exempt';
  enlistmentDate?: string;
  expectedDischargeDate?: string;
  branch?: string;
  completedDate?: string;
}

export interface Album {
  id: string;
  name: string;
  type: 'album' | 'single' | 'compilation' | 'ep';
  releaseDate: string;
  totalTracks: number;
  imageUrl: string;
  spotifyUrl?: string;
  tracks?: Track[];
}

export interface Track {
  id: string;
  name: string;
  trackNumber: number;
  durationMs: number;
  previewUrl: string | null;
  popularity: number;
  spotifyUrl?: string;
}

export interface MusicVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  artistId: string;
  artistName: string;
}

export interface ComebackEvent {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  type: 'album' | 'single' | 'concert' | 'event';
  date: string;
  imageUrl?: string;
  description?: string;
  isConfirmed: boolean;
}
