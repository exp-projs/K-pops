import { createClient } from '@/utils/supabase/server';

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  board_id: string;
  title: string;
  body: string;
  type: 'discussion' | 'fan_art' | 'review' | 'question';
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  _count?: {
    comments: number;
    reactions: number;
  };
}

export const communityApi = {
  async getBoards(): Promise<Board[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching boards:', error);
      return [];
    }
    return data || [];
  },

  async getPosts(boardSlug?: string): Promise<Post[]> {
    const supabase = await createClient();
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles (username, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (boardSlug) {
      const { data: board } = await supabase
        .from('boards')
        .select('id')
        .eq('slug', boardSlug)
        .single();
      
      if (board) {
        query = query.eq('board_id', board.id);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    return data || [];
  }
};
