'use client';

import { createClient } from '@/utils/supabase/client';

export interface Review {
  id: string;
  user_id: string;
  tmdb_id: number;
  content_type: string;
  rating: number;
  title: string;
  body: string;
  contains_spoilers: boolean;
  helpful_count: number;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export const reviewsApi = {
  async getReviewsForDrama(dramaId: number): Promise<Review[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('tmdb_id', dramaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return data || [];
  },

  async submitReview(review: {
    tmdb_id: number;
    content_type: string;
    rating: number;
    title: string;
    body: string;
    contains_spoilers: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, error: 'You must be logged in to submit a review.' };

    const { error } = await supabase
      .from('reviews')
      .upsert({
        ...review,
        user_id: user.id,
      }, { onConflict: 'user_id,tmdb_id' });

    if (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async markHelpful(reviewId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_helpful', { review_id: reviewId });
    if (error) console.error('Error marking helpful:', error);
  }
};
