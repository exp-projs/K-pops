import { Drama, CastMember, Episode } from '@/types/drama';

const BASE_URL = 'https://api.tvmaze.com';

/**
 * TVmaze Show Object Interface (subset)
 */
interface TVmazeShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: { time: string; days: string[] };
  rating: { average: number | null };
  weight: number;
  network: { id: number; name: string; country: { name: string; code: string; timezone: string } } | null;
  webChannel: { id: number; name: string; country: { name: string; code: string; timezone: string } | null } | null;
  externals: { tvrage: number | null; thetvdb: number | null; imdb: string | null };
  image: { medium: string; original: string } | null;
  summary: string | null;
  updated: number;
}

interface TVmazeCast {
  person: { id: number; url: string; name: string; image: { medium: string; original: string } | null };
  character: { id: number; url: string; name: string; image: { medium: string; original: string } | null };
  self: boolean;
  voice: boolean;
}

interface TVmazeEpisode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string | null;
}

/**
 * Mapper: TVmaze Show -> HALLYU.WORLD Drama
 */
function mapShowToDrama(show: TVmazeShow): Drama {
  return {
    id: show.id,
    slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: show.name,
    overview: show.summary ? show.summary.replace(/<[^>]*>/g, '') : '', // Strip HTML tags
    posterPath: show.image?.original || show.image?.medium || null,
    backdropPath: show.image?.original || null,
    firstAirDate: show.premiered || '',
    lastAirDate: show.ended || undefined,
    status: show.status,
    numberOfEpisodes: 0, // Need to fetch episodes separately or use metadata if available
    genres: show.genres,
    voteAverage: show.rating.average || 0,
    popularity: show.weight,
    networks: show.network ? [{ id: show.network.id, name: show.network.name, logoPath: null, originCountry: show.network.country.code }] : [],
    inProduction: show.status !== 'Ended',
    type: show.type,
  };
}

/**
 * Mapper: TVmaze Cast -> HALLYU.WORLD CastMember
 */
function mapCastToMember(c: TVmazeCast, index: number): CastMember {
  return {
    id: c.person.id,
    name: c.person.name,
    character: c.character.name,
    profilePath: c.person.image?.medium || null,
    order: index,
    knownForDepartment: 'Acting',
  };
}

/**
 * Mapper: TVmaze Episode -> HALLYU.WORLD Episode
 */
function mapEpisode(e: TVmazeEpisode): Episode {
  return {
    id: e.id,
    name: e.name,
    overview: e.summary ? e.summary.replace(/<[^>]*>/g, '') : '',
    episodeNumber: e.number,
    seasonNumber: e.season,
    airDate: e.airdate,
    stillPath: e.image?.medium || null,
    voteAverage: e.rating.average || 0,
    runtime: e.runtime,
  };
}

/**
 * API Wrapper Functions
 */

export const tvmaze = {
  /**
   * Search for dramas by query
   */
  async searchDramas(query: string): Promise<Drama[]> {
    const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch dramas');
    const data: { score: number; show: TVmazeShow }[] = await res.json();
    return data.map(item => mapShowToDrama(item.show));
  },

  /**
   * Get trending and popular dramas (Maximum Discovery)
   */
  async getTrendingDramas(): Promise<Drama[]> {
    // Search a massive set of terms to build a huge library of unique dramas
    const searchTerms = [
      'Korean', 'K-Drama', 'South Korea', 'Seoul',
      'tvN', 'Netflix Korean', 'JTBC', 'KBS World', 'SBS Drama', 'MBC Drama', 'ENA',
      'Romance Korean', 'Thriller Korean', 'Action Korean', 'Comedy Korean', 'Fantasy Korean'
    ];
    
    try {
      const allResults = await Promise.all(
        searchTerms.map(term => 
          fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(term)}`)
            .then(res => res.json())
            .catch(() => []) // Handle individual failures
        )
      );

      const showsMap = new Map<number, Drama>();
      
      allResults.flat().forEach((item: any) => {
        if (!item || !item.show) return;
        const show = item.show;

        // Verify it's actually Korean (language, origin country, or keywords in summary)
        const isKorean = 
          show.language === 'Korean' || 
          show.network?.country?.code === 'KR' || 
          show.webChannel?.country?.code === 'KR' ||
          show.name.toLowerCase().includes('korean') ||
          show.summary?.toLowerCase().includes('south korea') ||
          show.summary?.toLowerCase().includes('k-drama');

        if (isKorean && !showsMap.has(show.id)) {
          showsMap.set(show.id, mapShowToDrama(show));
        }
      });
      
      return Array.from(showsMap.values())
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } catch (error) {
      console.error('Failed to fetch trending dramas:', error);
      return [];
    }
  },

  /**
   * Get currently airing dramas in Korea (for the current date)
   */
  async getCurrentlyAiring(): Promise<Drama[]> {
    try {
      const res = await fetch(`${BASE_URL}/schedule?country=KR`);
      if (!res.ok) throw new Error('Failed to fetch schedule');
      const data: any[] = await res.json();
      
      // Schedule returns episodes, we want unique shows
      const showsMap = new Map<number, Drama>();
      data.forEach(item => {
        if (item.show && !showsMap.has(item.show.id)) {
          showsMap.set(item.show.id, mapShowToDrama(item.show));
        }
      });
      
      return Array.from(showsMap.values());
    } catch (error) {
      console.error('Failed to fetch currently airing:', error);
      return [];
    }
  },

  /**
   * Get full drama details including episodes and cast
   */
  async getDramaDetails(id: number): Promise<Drama & { episodes: Episode[]; cast: CastMember[] }> {
    const [showRes, episodesRes, castRes] = await Promise.all([
      fetch(`${BASE_URL}/shows/${id}`),
      fetch(`${BASE_URL}/shows/${id}/episodes`),
      fetch(`${BASE_URL}/shows/${id}/cast`)
    ]);

    if (!showRes.ok) throw new Error('Failed to fetch drama details');

    const showData: TVmazeShow = await showRes.json();
    const episodesData: TVmazeEpisode[] = await episodesRes.json();
    const castData: TVmazeCast[] = await castRes.json();

    const drama = mapShowToDrama(showData);
    drama.numberOfEpisodes = episodesData.length;
    
    return {
      ...drama,
      episodes: episodesData.map(mapEpisode),
      cast: castData.map((c, i) => mapCastToMember(c, i)),
    };
  },

  /**
   * Get drama by slug/title using singlesearch
   */
  async getDramaBySlug(slug: string): Promise<Drama & { episodes: Episode[]; cast: CastMember[] }> {
    const query = slug.replace(/-/g, ' ');
    const res = await fetch(`${BASE_URL}/singlesearch/shows?q=${encodeURIComponent(query)}&embed[]=episodes&embed[]=cast`);
    
    if (!res.ok) throw new Error('Drama not found');
    
    const data = await res.json();
    const drama = mapShowToDrama(data);
    
    const episodes = data._embedded?.episodes?.map(mapEpisode) || [];
    const cast = data._embedded?.cast?.map((c: any, i: number) => mapCastToMember(c, i)) || [];
    
    drama.numberOfEpisodes = episodes.length;
    
    return {
      ...drama,
      episodes,
      cast,
    };
  },

  /**
   * Get dramas by genre
   */
  async getDramasByGenre(genre: string): Promise<Drama[]> {
    // TVmaze doesn't have a direct genre endpoint, so we search and filter
    const dramas = await this.getTrendingDramas();
    return dramas.filter(d => d.genres.includes(genre));
  },
};
