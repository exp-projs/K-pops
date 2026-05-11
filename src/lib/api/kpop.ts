/**
 * iTunes Search API Interface
 */
interface iTunesResult {
  wrapperType: string;
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  discCount: number;
  discNumber: number;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  isStreamable: boolean;
}

export interface KPopTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string;
  releaseDate: string;
}

export interface KPopArtist {
  id: number;
  name: string;
  artwork: string;
  genre: string;
}

const BASE_URL = 'https://itunes.apple.com';

/**
 * Mapper: iTunes -> KPopTrack
 */
function mapTrack(item: iTunesResult): KPopTrack {
  return {
    id: item.trackId,
    title: item.trackName,
    artist: item.artistName,
    album: item.collectionName,
    artwork: item.artworkUrl100.replace('100x100bb', '600x600bb'), // High res hack
    previewUrl: item.previewUrl,
    releaseDate: item.releaseDate,
  };
}

/**
 * API Wrapper Functions
 */
export const kpopApi = {
  /**
   * Get trending K-Pop tracks
   */
  async getTrendingTracks(limit = 10): Promise<KPopTrack[]> {
    const res = await fetch(`${BASE_URL}/search?term=k-pop&media=music&entity=song&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch K-Pop tracks');
    const data = await res.json();
    return data.results.map(mapTrack);
  },

  /**
   * Search for K-Pop tracks or artists
   */
  async search(query: string, limit = 20): Promise<KPopTrack[]> {
    const res = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to search K-Pop');
    const data = await res.json();
    return data.results.map(mapTrack);
  },

  /**
   * Get tracks by a specific artist
   */
  async getArtistTracks(artistName: string, limit = 5): Promise<KPopTrack[]> {
    const res = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(artistName)}&media=music&entity=song&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch artist tracks');
    const data = await res.json();
    return data.results.map(mapTrack);
  },

  /**
   * Get K-Pop artists (simulated by searching and getting unique artists)
   */
  async getFeaturedArtists(): Promise<KPopArtist[]> {
    const groups = [
      'BTS', 'BLACKPINK', 'NewJeans', 'TWICE', 'Stray Kids', 'IVE', 'LE SSERAFIM', 'SEVENTEEN',
      'ATEEZ', 'ITZY', 'ENHYPEN', 'aespa', '(G)I-DLE', 'TXT', 'NCT 127', 'Red Velvet',
      'EXO', 'SHINee', 'MAMAMOO', 'BTOB', 'THE BOYZ', 'STAYC', 'BABYMONSTER'
    ];
    
    // Fetch one song from each group to get artwork
    const results = await Promise.all(
      groups.map(group => 
        fetch(`${BASE_URL}/search?term=${encodeURIComponent(group)}&media=music&entity=song&limit=1`)
          .then(r => r.json())
      )
    );

    return results.map((data, i) => {
      const item = data.results[0];
      return {
        id: item?.artistId || i,
        name: groups[i],
        artwork: item?.artworkUrl100.replace('100x100bb', '600x600bb') || '',
        genre: 'K-Pop'
      };
    }).filter(a => a.artwork);
  },

  /**
   * Get basic artist info
   */
  async getArtistInfo(artistName: string): Promise<KPopArtist | null> {
    try {
      const res = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(artistName)}&media=music&entity=musicArtist&limit=1`);
      if (!res.ok) return null;
      const data = await res.json();
      const artist = data.results[0];
      
      if (!artist) {
        // Fallback to song search if artist search fails
        const songRes = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(artistName)}&media=music&entity=song&limit=1`);
        const songData = await songRes.json();
        const song = songData.results[0];
        if (!song) return null;
        return {
          id: song.artistId,
          name: song.artistName,
          artwork: song.artworkUrl100.replace('100x100bb', '600x600bb'),
          genre: song.primaryGenreName
        };
      }

      return {
        id: artist.artistId,
        name: artist.artistName,
        artwork: '', // Artist entity doesn't have artwork in iTunes API usually
        genre: artist.primaryGenreName
      };
    } catch (error) {
      return null;
    }
  }
};
