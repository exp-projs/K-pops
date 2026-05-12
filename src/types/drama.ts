export interface Drama {
  id: number;
  slug: string;
  title: string;
  originalTitle?: string;
  koreanTitle?: string;
  overview: string;
  posterPath: string | null;
  backdropPath?: string | null;
  firstAirDate: string;
  lastAirDate?: string;
  status: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  episodeRunTime?: number[];
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  genres: string[];
  networks?: Network[];
  productionCompanies?: ProductionCompany[];
  originCountry?: string[];
  originalLanguage?: string;
  tagline?: string;
  homepage?: string;
  inProduction: boolean;
  type: string;
  streamingPlatforms?: StreamingPlatform[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Network {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface StreamingPlatform {
  name: string;
  url: string;
  logoPath?: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  airDate: string;
  stillPath: string | null;
  voteAverage: number;
  runtime: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  seasonNumber: number;
  episodeCount: number;
  airDate: string;
  episodes?: Episode[];
}

export interface CastMember {
  id: number;
  name: string;
  koreanName?: string;
  character: string;
  profilePath: string | null;
  order: number;
  knownForDepartment: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface DramaCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt: string;
}

export interface DramaImage {
  filePath: string;
  width: number;
  height: number;
  aspectRatio: number;
  voteAverage: number;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  showId: number;
  rating: number;
  title: string;
  body: string;
  containsSpoilers: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface WatchlistEntry {
  id: string;
  userId: string;
  showId: number;
  contentType: 'drama' | 'movie';
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
  episodesWatched: number;
  rating: number | null;
  notes: string | null;
  addedAt: string;
  updatedAt: string;
  drama?: Drama;
}

export type DramaSortOption =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | 'name.asc';

export interface DramaFilters {
  genres: number[];
  year?: number;
  network?: string;
  status?: string;
  ratingMin?: number;
  ratingMax?: number;
  sortBy: DramaSortOption;
}

// --- MyDramaList (MDL) Unofficial API Interfaces ---

export interface MDLSearchResult {
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  url: string;
}

export interface MDLTitle {
  title: string;
  slug: string;
  synopsis: string;
  episodes: number;
  rating: number;
  genres: string[];
  network: string;
  type: string;
  language: string;
  images: {
    thumb: string;
    medium: string;
    poster: string;
  };
}

export interface MDLEpisode {
  episode_number: string;
  title: string;
  air_date: string;
  rating?: string;
  description?: string;
  image?: string;
  season?: string;
}

export interface MDLCastMember {
  name: string;
  role: string;
  image: string;
  profile_url: string;
}

export interface MDLRecommendation {
  title: string;
  slug: string;
  year: string;
  rating: string;
  image: string;
  reasons: string[];
}

