import { 
  Drama, 
  Episode, 
  CastMember, 
  MDLSearchResult, 
  MDLTitle, 
  MDLEpisode, 
  MDLCastMember, 
  MDLRecommendation 
} from '@/types/drama';

/**
 * Robust fetch wrapper for MyDramaList Unofficial API calls
 * Implements AbortController timeouts, retry policy, and swallowed errors (returns null)
 */
async function fetchMDL(path: string, timeoutMs = 8000, retries = 2): Promise<any> {
  const isClient = typeof window !== 'undefined';
  
  let url = '';
  let headers: Record<string, string> = {};

  if (isClient) {
    // Route through our exclusive local Next.js proxy endpoint to bypass CORS securely
    url = `${window.location.origin}/api/mdl?path=${encodeURIComponent(path)}`;
    headers['x-hallyu-secret'] = 'hallyu-internal-client-v1';
  } else {
    // Direct backend fetch during server-side static pre-rendering
    let baseUrl = process.env.NEXT_PUBLIC_MDL_API_BASE_URL || process.env.MDL_API_BASE_URL || 'https://my-drama-list-unofficial-api-one.vercel.app';
    baseUrl = baseUrl.replace(/\/$/, '');
    url = `${baseUrl}${path}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers,
      });
      clearTimeout(id);
      if (!res.ok) throw new Error(`MDL API error: ${res.status}`);
      return await res.json();
    } catch (err: any) {
      clearTimeout(id);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      console.error(`[MDL] Failed to fetch ${path}:`, err?.message || err);
      return null;
    }
  }
  return null;
}

/**
 * Helper to extract numeric ID from MDL slug (e.g., '40257-squid-game' -> 40257)
 */
function getIdFromSlug(slug: string): number {
  const parsed = parseInt(slug, 10);
  return isNaN(parsed) ? Math.floor(Math.random() * 900000) + 100000 : parsed;
}

/**
 * Helper to parse rating string/number into float
 */
function parseRating(rating: any): number {
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'string') {
    const match = rating.match(/^([0-9.]+)/);
    if (match) return parseFloat(match[1]);
  }
  return 0;
}

/**
 * Mappers: MDL shapes -> HALLYU.WORLD domain objects
 */
function mapSearchResultToDrama(item: MDLSearchResult): Drama {
  const poster = item.image || null;
  return {
    id: getIdFromSlug(item.slug),
    slug: item.slug,
    title: item.title,
    overview: '', // Search doesn't return synopsis
    posterPath: poster,
    backdropPath: poster,
    firstAirDate: item.year ? `${item.year}-01-01` : '',
    status: 'Ended',
    genres: [],
    voteAverage: parseRating(item.rating),
    popularity: parseRating(item.rating) * 10,
    inProduction: false,
    type: 'Scripted',
  };
}


function mapTitleToDrama(title: MDLTitle): Drama {
  const poster = title.image || title.images?.poster || title.images?.medium || title.images?.thumb || null;
  const numEpisodes = typeof title.episodes === 'string' ? parseInt(title.episodes, 10) : title.episodes;
  const networkName = title.original_network || title.network;

  // Normalize date: MDL "Sep 17, 2021" is valid for new Date()
  let airDate = '';
  if (title.aired) {
    const d = new Date(title.aired);
    if (!isNaN(d.getTime())) {
      airDate = d.toISOString().split('T')[0];
    }
  }

  return {
    id: getIdFromSlug(title.slug),
    slug: title.slug,
    title: title.title,
    koreanTitle: title.native_title,
    overview: title.synopsis || '', 
    posterPath: poster,
    backdropPath: poster, // Use poster as backdrop fallback
    firstAirDate: airDate,
    status: title.type === 'Drama' ? 'Ended' : 'Ended',
    numberOfEpisodes: numEpisodes || 0,
    genres: title.genres || [],
    voteAverage: parseRating(title.rating),
    popularity: parseRating(title.rating) * 10,
    networks: networkName ? [{ id: 1, name: networkName, logoPath: null, originCountry: 'KR' }] : [],
    inProduction: false,
    type: title.type || 'Scripted',
    originalLanguage: title.language || 'Korean',
  };
}


function mapEpisode(ep: MDLEpisode, index: number): Episode {
  const epNum = parseInt(ep.episode_number, 10);
  return {
    id: epNum || index + 1,
    name: ep.title || `Episode ${ep.episode_number}`,
    overview: ep.description || '',
    episodeNumber: epNum || index + 1,
    seasonNumber: parseInt(ep.season || '1', 10) || 1,
    airDate: ep.air_date || '',
    stillPath: ep.image || null,
    voteAverage: parseRating(ep.rating),
    runtime: 60,
  };
}

function mapCast(cast: MDLCastMember, index: number): CastMember {
  return {
    id: index + 1,
    name: cast.name,
    character: (cast as any).character || cast.role || 'Supporting Role',
    profilePath: cast.image || null,
    order: index,
    knownForDepartment: 'Acting',
  };
}

const NETWORK_DAY_MAP: Record<string, string[]> = {
  "Netflix KR": ["Saturday", "Sunday"],
  "KBS2": ["Monday", "Tuesday"],
  "MBC": ["Wednesday", "Thursday"],
  "SBS": ["Monday", "Tuesday"],
  "tvN": ["Saturday", "Sunday"],
  "JTBC": ["Friday", "Saturday"],
  "ENA": ["Wednesday", "Thursday"],
  "Disney+": ["Wednesday"],
  "Apple TV+": ["Friday"]
};

/**
 * MDL Unofficial API Exported Methods
 */
export const mdlApi = {
  /**
   * Search shows by query
   */
  async searchDramas(query: string): Promise<Drama[]> {
    if (!query.trim()) return [];
    const data = await fetchMDL(`/api/search/q/${encodeURIComponent(query)}`);
    if (!data || !Array.isArray(data.results || data)) return [];
    const items: MDLSearchResult[] = Array.isArray(data) ? data : data.results;
    return items.map(mapSearchResultToDrama);
  },

  /**
   * Get trending seasonal lineup
   */
  async getTrendingDramas(): Promise<Drama[]> {
    const data = await fetchMDL('/api/seasonal/2026/1', 8000);
    const items: any[] = Array.isArray(data) ? data : data?.dramas || data?.results || [];
    
    if (items.length === 0) {
      // Fallback to searching popular keywords if seasonal is temporarily empty
      return await this.searchDramas('love');
    }

    return items.map(item => {
      const poster = item.image || null;
      return {
        id: getIdFromSlug(item.slug),
        slug: item.slug,
        title: item.title,
        overview: '',
        posterPath: poster,
        backdropPath: poster,
        firstAirDate: item.year ? `${item.year}-01-01` : '',
        status: 'Airing',
        genres: ['Drama', 'Romance'],
        voteAverage: parseRating(item.rating),
        popularity: parseRating(item.rating) * 10,
        inProduction: true,
        type: 'Scripted',
      };
    });

  },

  /**
   * Get currently airing lineup with inferred broadcast days
   */
  async getCurrentlyAiring(): Promise<Drama[]> {
    const seasonalDramas = await this.getTrendingDramas();
    // Fetch top 8 show details in parallel to infer networks without exceeding API rates/timeouts
    const topBatch = seasonalDramas.slice(0, 8);
    
    const enriched = await Promise.all(
      topBatch.map(async drama => {
        const details = await fetchMDL(`/api/id/${drama.slug}`, 5000, 1);
        if (details) {
          const mapped = mapTitleToDrama(details);
          return {
            ...drama,
            ...mapped,
            overview: mapped.overview || drama.overview,
            posterPath: mapped.posterPath || drama.posterPath,
          };
        }
        return drama;
      })
    );

    return enriched.concat(seasonalDramas.slice(8));
  },

  /**
   * Get full drama details including episodes and cast by slug
   */
  async getDramaBySlug(slug: string): Promise<Drama & { episodes: Episode[]; cast: CastMember[] }> {
    const [titleData, episodesData, castData] = await Promise.all([
      fetchMDL(`/api/id/${slug}`),
      // Option A: Fast endpoint for basic count/details
      fetchMDL(`/api/id/${slug}/episodes`),
      fetchMDL(`/api/id/${slug}/cast`)
    ]);

    if (!titleData) {
      throw new Error(`Drama not found for slug: ${slug}`);
    }

    const drama = mapTitleToDrama(titleData);
    
    let episodes: Episode[] = [];
    if (Array.isArray(episodesData?.episodes || episodesData)) {
      const list: MDLEpisode[] = Array.isArray(episodesData) ? episodesData : episodesData.episodes;
      episodes = list.map(mapEpisode);
    }
    
    // Ensure drama.numberOfEpisodes is correct
    drama.numberOfEpisodes = drama.numberOfEpisodes || episodes.length;

    let cast: CastMember[] = [];
    if (castData?.cast) {
      const allCastObj = castData.cast;
      const flatList: MDLCastMember[] = [];
      Object.entries(allCastObj).forEach(([roleName, members]: [string, any]) => {
        if (Array.isArray(members)) {
          members.forEach(m => flatList.push({ ...m, role: m.role || roleName }));
        }
      });
      cast = flatList.map(mapCast);
    } else if (Array.isArray(castData)) {
      cast = castData.map(mapCast);
    }

    return {
      ...drama,
      episodes,
      cast,
    };
  },

  /**
   * Optional full per-episode ratings detail fetch (slow endpoint, use strictly on demand)
   */
  async getFullEpisodesWithRatings(slug: string): Promise<Episode[]> {
    const data = await fetchMDL(`/api/id/${slug}/episodes/all`, 15000);
    if (Array.isArray(data?.episodes || data)) {
      const list: MDLEpisode[] = Array.isArray(data) ? data : data.episodes;
      return list.map(mapEpisode);
    }
    return [];
  },

  /**
   * Get recommendations with reasons
   */
  async getDramaRecommendations(slug: string): Promise<MDLRecommendation[]> {
    const data = await fetchMDL(`/api/id/${slug}/recs`);
    if (Array.isArray(data?.recommendations || data)) {
      return Array.isArray(data) ? data : data.recommendations;
    }
    return [];
  }
};
