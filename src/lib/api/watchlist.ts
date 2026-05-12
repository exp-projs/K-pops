import { createClient } from '@/utils/supabase/server';
import { mdlApi } from './mdl';
import type { Drama } from '@/types/drama';

export interface WatchlistEntry {
  id: string;
  user_id: string;
  tmdb_id: number;
  content_type: 'drama' | 'movie';
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
  episodes_watched: number;
  rating: number | null;
  notes: string | null;
  added_at: string;
  updated_at: string;
  drama?: Drama; // Enriched data
}

export const watchlistApi = {
  async getWatchlist(): Promise<WatchlistEntry[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('watchlist_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }

    // Enrich with MDL data
    // In a real app, you'd probably batch these or cache them
    const enriched = await Promise.all((data || []).map(async (entry) => {
      // Use the tmdb_id as the slug if stored that way, or map it
      // For now, let's assume we have the slug or can find it
      // This is a simplified enrichment
      return { ...entry };
    }));

    return enriched;
  },

  async addToWatchlist(tmdbId: number, status: WatchlistEntry['status'] = 'plan_to_watch') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('watchlist_entries')
      .upsert({
        user_id: user.id,
        tmdb_id: tmdbId,
        content_type: 'drama',
        status,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
