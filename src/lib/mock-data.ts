import type { Drama, CastMember, Episode } from '@/types/drama';
import type { NewsArticle } from '@/types/news';
import type { Artist, ArtistMember } from '@/types/artist';

// --- Featured Dramas for Hero ---
export const featuredDramas: Drama[] = [
  {
    id: 1, slug: 'queen-of-tears', title: 'Queen of Tears', originalTitle: 'Queen of Tears',
    koreanTitle: '눈물의 여왕', overview: 'The queen of a department store and her chaebol husband navigate the treacherous waters of love, ambition, and family secrets in this gripping romantic drama that took the world by storm.',
    posterPath: '/queen-of-tears-poster.jpg', backdropPath: '/queen-of-tears-bg.jpg',
    firstAirDate: '2024-03-09', lastAirDate: '2024-05-12', status: 'Ended',
    numberOfSeasons: 1, numberOfEpisodes: 16, episodeRunTime: [70], voteAverage: 8.7,
    voteCount: 3420, popularity: 95.2, genres: ['Drama', 'Romance'],
    networks: [{ id: 1, name: 'tvN', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted',
    tagline: 'Love never dies, even when everything else does.'
  },
  {
    id: 2, slug: 'lovely-runner', title: 'Lovely Runner', originalTitle: 'Lovely Runner',
    koreanTitle: '선재 업고 튀어', overview: 'A devoted fangirl gets a chance to travel back in time to save her favorite idol from a tragic fate, only to discover that changing the past has unexpected consequences.',
    posterPath: '/lovely-runner-poster.jpg', backdropPath: '/lovely-runner-bg.jpg',
    firstAirDate: '2024-04-08', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 16,
    episodeRunTime: [65], voteAverage: 8.9, voteCount: 2800, popularity: 92.1,
    genres: ['Romance', 'Sci-Fi & Fantasy'],
    networks: [{ id: 1, name: 'tvN', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted',
    tagline: 'Would you rewrite destiny for the one you love?'
  },
  {
    id: 3, slug: 'moving', title: 'Moving', originalTitle: 'Moving',
    koreanTitle: '무빙', overview: 'Children of superpowered parents discover their hidden abilities while their families try to protect dark secrets from the past in this epic superhero saga.',
    posterPath: '/moving-poster.jpg', backdropPath: '/moving-bg.jpg',
    firstAirDate: '2023-08-09', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 20,
    episodeRunTime: [55], voteAverage: 8.6, voteCount: 1950, popularity: 88.7,
    genres: ['Action & Adventure', 'Sci-Fi & Fantasy'],
    networks: [{ id: 2, name: 'Disney+', logoPath: null, originCountry: 'US' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
];

// --- Trending Dramas ---
export const trendingDramas: Drama[] = [
  ...featuredDramas,
  {
    id: 4, slug: 'business-proposal', title: 'Business Proposal', originalTitle: 'Business Proposal',
    koreanTitle: '사내맞선', overview: 'A woman goes on a blind date in place of her friend, only to find out her date is her company\'s CEO.',
    posterPath: '/biz-proposal.jpg', backdropPath: '/biz-proposal-bg.jpg',
    firstAirDate: '2022-02-28', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 12,
    episodeRunTime: [60], voteAverage: 8.5, voteCount: 5200, popularity: 85.3,
    genres: ['Comedy', 'Romance'],
    networks: [{ id: 1, name: 'SBS', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
  {
    id: 5, slug: 'my-love-from-the-star', title: 'My Love from the Star', originalTitle: 'My Love from the Star',
    koreanTitle: '별에서 온 그대', overview: 'An alien who landed on Earth 400 years ago falls in love with a top actress in the modern era.',
    posterPath: '/my-love-star.jpg', backdropPath: '/my-love-star-bg.jpg',
    firstAirDate: '2013-12-18', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 21,
    episodeRunTime: [60], voteAverage: 8.4, voteCount: 4100, popularity: 80.5,
    genres: ['Romance', 'Sci-Fi & Fantasy'],
    networks: [{ id: 1, name: 'SBS', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
  {
    id: 6, slug: 'vincenzo', title: 'Vincenzo', originalTitle: 'Vincenzo',
    koreanTitle: '빈센조', overview: 'A Korean-Italian mafia lawyer returns to Seoul and uses his unconventional methods to take down villains who cannot be punished by the law.',
    posterPath: '/vincenzo.jpg', backdropPath: '/vincenzo-bg.jpg',
    firstAirDate: '2021-02-20', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 20,
    episodeRunTime: [80], voteAverage: 8.8, voteCount: 6300, popularity: 91.0,
    genres: ['Drama', 'Crime'],
    networks: [{ id: 1, name: 'tvN', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
  {
    id: 7, slug: 'crash-landing-on-you', title: 'Crash Landing on You', originalTitle: 'Crash Landing on You',
    koreanTitle: '사랑의 불시착', overview: 'A South Korean heiress crash-lands in North Korea and falls in love with a North Korean officer who helps her hide.',
    posterPath: '/cloy.jpg', backdropPath: '/cloy-bg.jpg',
    firstAirDate: '2019-12-14', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 16,
    episodeRunTime: [70], voteAverage: 8.9, voteCount: 8200, popularity: 93.4,
    genres: ['Romance', 'Drama'],
    networks: [{ id: 1, name: 'tvN', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
  {
    id: 8, slug: 'goblin', title: 'Goblin', originalTitle: 'Guardian: The Lonely and Great God',
    koreanTitle: '쓸쓸하고 찬란하神-도깨비', overview: 'An immortal goblin seeks his bride who can pull out the sword embedded in him and end his cursed immortality.',
    posterPath: '/goblin.jpg', backdropPath: '/goblin-bg.jpg',
    firstAirDate: '2016-12-02', status: 'Ended', numberOfSeasons: 1, numberOfEpisodes: 16,
    episodeRunTime: [70], voteAverage: 9.0, voteCount: 7500, popularity: 89.1,
    genres: ['Romance', 'Sci-Fi & Fantasy'],
    networks: [{ id: 1, name: 'tvN', logoPath: null, originCountry: 'KR' }],
    productionCompanies: [], originCountry: ['KR'], originalLanguage: 'ko', inProduction: false, type: 'Scripted'
  },
];

// --- Mock Episodes ---
export const mockEpisodes: Episode[] = Array.from({ length: 16 }, (_, i) => ({
  id: 100 + i, name: `Episode ${i + 1}`, overview: `The story continues with new revelations and emotional confrontations in episode ${i + 1}.`,
  episodeNumber: i + 1, seasonNumber: 1, airDate: `2024-03-${String(9 + i).padStart(2, '0')}`,
  stillPath: null, voteAverage: 8.2 + Math.random() * 0.8, runtime: 65 + Math.floor(Math.random() * 15),
}));

// --- Mock Cast ---
export const mockCast: CastMember[] = [
  { id: 1, name: 'Kim Soo-hyun', koreanName: '김수현', character: 'Baek Hyun-woo', profilePath: null, order: 0, knownForDepartment: 'Acting' },
  { id: 2, name: 'Kim Ji-won', koreanName: '김지원', character: 'Hong Hae-in', profilePath: null, order: 1, knownForDepartment: 'Acting' },
  { id: 3, name: 'Park Sung-hoon', koreanName: '박성훈', character: 'Yoon Eun-seong', profilePath: null, order: 2, knownForDepartment: 'Acting' },
  { id: 4, name: 'Kwak Dong-yeon', koreanName: '곽동연', character: 'Hong Su-cheol', profilePath: null, order: 3, knownForDepartment: 'Acting' },
  { id: 5, name: 'Lee Joo-bin', koreanName: '이주빈', character: 'Cheon Da-hye', profilePath: null, order: 4, knownForDepartment: 'Acting' },
  { id: 6, name: 'Jeon Bae-su', koreanName: '전배수', character: 'Hong Man-dae', profilePath: null, order: 5, knownForDepartment: 'Acting' },
];

// --- Mock News ---
export const mockNews: NewsArticle[] = [
  { id: '1', source: 'Soompi', title: 'BTS\'s Jimin Tops Billboard Hot 100 With New Solo Single', excerpt: 'Jimin has achieved a remarkable milestone with his latest solo release...', url: '#', thumbnailUrl: null, category: 'K-Pop', publishedAt: '2026-05-11T08:00:00Z', fetchedAt: '2026-05-11T08:15:00Z' },
  { id: '2', source: 'Allkpop', title: 'Song Joong-ki Confirms Lead Role in New tvN Drama', excerpt: 'The acclaimed actor will star in a historical romance set during the Joseon dynasty...', url: '#', thumbnailUrl: null, category: 'Drama', publishedAt: '2026-05-11T07:30:00Z', fetchedAt: '2026-05-11T07:45:00Z' },
  { id: '3', source: 'Koreaboo', title: 'BLACKPINK Announces World Tour 2026 Dates', excerpt: 'The global K-Pop group has revealed dates for their highly anticipated comeback tour...', url: '#', thumbnailUrl: null, category: 'K-Pop', publishedAt: '2026-05-11T06:00:00Z', fetchedAt: '2026-05-11T06:15:00Z' },
  { id: '4', source: 'Soompi', title: 'Netflix K-Drama "The Heir" Breaks Viewing Records', excerpt: 'The latest Netflix original Korean drama has shattered previous streaming records...', url: '#', thumbnailUrl: null, category: 'Drama', publishedAt: '2026-05-10T22:00:00Z', fetchedAt: '2026-05-10T22:15:00Z' },
  { id: '5', source: 'Dramabeans', title: 'Park Eun-bin Wins Best Actress at Baeksang Arts Awards', excerpt: 'The versatile actress was recognized for her outstanding performance...', url: '#', thumbnailUrl: null, category: 'Celebrity', publishedAt: '2026-05-10T20:00:00Z', fetchedAt: '2026-05-10T20:15:00Z' },
  { id: '6', source: 'Allkpop', title: 'Stray Kids Break Their Own Album Sales Record', excerpt: 'The JYP Entertainment group has surpassed 5 million copies sold in the first week...', url: '#', thumbnailUrl: null, category: 'K-Pop', publishedAt: '2026-05-10T18:00:00Z', fetchedAt: '2026-05-10T18:15:00Z' },
];

// --- BTS Members ---
export const btsMembers: ArtistMember[] = [
  { name: 'RM', koreanName: '알엠', color: '#B0C4DE', role: 'Leader, Rapper', birthDate: '1994-09-12', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-06-10', branch: 'Army' } },
  { name: 'Jin', koreanName: '진', color: '#FFB6C1', role: 'Vocalist', birthDate: '1992-12-04', isActive: true, militaryStatus: { status: 'completed', completedDate: '2024-06-12', branch: 'Army' } },
  { name: 'Suga', koreanName: '슈가', color: '#A9A9A9', role: 'Rapper, Producer', birthDate: '1993-03-09', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-06-21', branch: 'Social Service' } },
  { name: 'J-Hope', koreanName: '제이홉', color: '#FFD700', role: 'Rapper, Dancer', birthDate: '1994-02-18', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-10-17', branch: 'Army' } },
  { name: 'Jimin', koreanName: '지민', color: '#FFC0CB', role: 'Vocalist, Dancer', birthDate: '1995-10-13', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-06-11', branch: 'Army' } },
  { name: 'V', koreanName: '뷔', color: '#98FF98', role: 'Vocalist', birthDate: '1995-12-30', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-06-11', branch: 'Special Forces' } },
  { name: 'Jungkook', koreanName: '정국', color: '#89CFF0', role: 'Vocalist, Dancer', birthDate: '1997-09-01', isActive: true, militaryStatus: { status: 'completed', completedDate: '2025-12-20', branch: 'Army' } },
];

export const btsArtist: Artist = {
  id: 'bts-001', name: 'BTS', koreanName: '방탄소년단', slug: 'bts',
  type: 'boy_group', debutDate: '2013-06-13', agency: 'BIGHIT MUSIC (HYBE)',
  spotifyId: '3Nrfpe0tUJi4K4DXYWgMUX', fandomName: 'ARMY',
  color: '#8B5CF6', members: btsMembers, isActive: true,
  imageUrl: '/bts-group.jpg', monthlyListeners: 42500000, followers: 78000000,
};

// --- Color map for genres ---
export const genreColorMap: Record<string, string> = {
  'Romance': 'genre-romance', 'Thriller': 'genre-thriller', 'Comedy': 'genre-comedy',
  'Fantasy': 'genre-fantasy', 'Sci-Fi & Fantasy': 'genre-fantasy',
  'Action & Adventure': 'genre-action', 'Drama': 'genre-drama',
  'Mystery': 'genre-mystery', 'Science Fiction': 'genre-sci-fi',
  'Crime': 'genre-crime', 'War & Politics': 'genre-war',
  'Family': 'genre-family', 'Music': 'genre-music',
};

// --- Poster gradient colors (fallback when no image) ---
export const posterGradients = [
  'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
  'linear-gradient(135deg, #0a1628 0%, #1a2940 50%, #0a1628 100%)',
  'linear-gradient(135deg, #2a0a1e 0%, #3d1b2e 50%, #2a0a1e 100%)',
  'linear-gradient(135deg, #0a2818 0%, #1b3d28 50%, #0a2818 100%)',
  'linear-gradient(135deg, #28200a 0%, #3d321b 50%, #28200a 100%)',
];
