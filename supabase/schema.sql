-- ============================================
-- HALLYU.WORLD — Full Supabase Database Schema
-- ============================================
-- Run this in the Supabase SQL Editor to set up all tables
-- Make sure you have the uuid-ossp extension enabled

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country_code CHAR(2),
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'New Fan')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. WATCHLIST ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS watchlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('drama', 'movie')),
  status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped')) DEFAULT 'plan_to_watch',
  episodes_watched INTEGER DEFAULT 0,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tmdb_id)
);

CREATE INDEX idx_watchlist_user_status ON watchlist_entries(user_id, status);
CREATE INDEX idx_watchlist_tmdb ON watchlist_entries(tmdb_id);

ALTER TABLE watchlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON watchlist_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON watchlist_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON watchlist_entries FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('drama', 'movie')),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  contains_spoilers BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tmdb_id)
);

CREATE INDEX idx_reviews_tmdb ON reviews(tmdb_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. COMMUNITY BOARDS
-- ============================================
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default boards
INSERT INTO boards (name, slug, description, icon, sort_order) VALUES
  ('Currently Airing', 'currently-airing', 'Discuss dramas that are currently on air', '📺', 1),
  ('Completed Dramas', 'completed-dramas', 'Reviews and discussions for completed dramas', '✅', 2),
  ('K-Pop General', 'kpop-general', 'All things K-Pop', '🎵', 3),
  ('BTS', 'bts', 'Dedicated BTS / ARMY discussion', '💜', 4),
  ('Fan Art Showcase', 'fan-art', 'Share your fan art and creative works', '🎨', 5),
  ('Recommendations', 'recommendations', 'Ask for and share drama recommendations', '💡', 6),
  ('Language Exchange', 'language-exchange', 'Learn Korean with fellow fans', '🗣️', 7),
  ('Off-Topic', 'off-topic', 'Everything else', '☕', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 5. POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  drama_id INTEGER,  -- Optional TMDB ID for drama-specific posts
  artist_id UUID,    -- Optional FK for artist-specific posts
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('discussion', 'fan_art', 'review', 'question')) DEFAULT 'discussion',
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_board_date ON posts(board_id, created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For nested replies
  body TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);
CREATE INDEX idx_comments_parent ON comments(parent_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 7. REACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'review')),
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'fire', 'cry', 'star', 'crown')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are viewable by everyone"
  ON reactions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can react"
  ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON reactions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 8. FOLLOWS
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow"
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- 9. ARTISTS (K-Pop)
-- ============================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  korean_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('boy_group', 'girl_group', 'solo_male', 'solo_female', 'sub_unit')),
  debut_date DATE,
  agency TEXT,
  spotify_id TEXT,
  youtube_channel_id TEXT,
  fandom_name TEXT,
  color TEXT,  -- Hex color for the artist/group
  members JSONB,  -- Array of member objects
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_artists_name_gin ON artists USING gin (name gin_trgm_ops);
CREATE INDEX idx_artists_type ON artists(type);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists are viewable by everyone"
  ON artists FOR SELECT USING (true);

-- ============================================
-- 10. NEWS ARTICLES
-- ============================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  url TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Drama', 'K-Pop', 'Celebrity', 'Industry', 'BTS')),
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_news_category_date ON news_articles(category, published_at DESC);
CREATE INDEX idx_news_date ON news_articles(published_at DESC);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News articles are viewable by everyone"
  ON news_articles FOR SELECT USING (true);

-- ============================================
-- 11. ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL
);

-- Seed achievements
INSERT INTO achievements (key, name, description, icon, condition_type, condition_value) VALUES
  ('drama_rookie', 'Drama Rookie', 'Add first 5 dramas to your list', '🌱', 'watchlist_count', 5),
  ('binge_queen', 'Binge Queen/King', 'Complete 20 dramas', '👑', 'completed_count', 20),
  ('army', 'ARMY', 'Post 10 times in BTS board', '💜', 'bts_posts', 10),
  ('top_reviewer', 'Top Reviewer', 'Receive 100 upvotes on reviews', '⭐', 'review_upvotes', 100),
  ('hallyu_ambassador', 'Hallyu Ambassador', 'Refer 5 friends', '🌍', 'referrals', 5),
  ('first_review', 'First Words', 'Write your first review', '✍️', 'review_count', 1),
  ('social_butterfly', 'Social Butterfly', 'Follow 20 other fans', '🦋', 'following_count', 20),
  ('drama_addict', 'Drama Addict', 'Watch 1000+ episodes total', '📺', 'episodes_watched', 1000)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 12. USER ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User achievements viewable by everyone"
  ON user_achievements FOR SELECT USING (true);

-- ============================================
-- 13. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reply', 'like', 'follow', 'achievement', 'new_episode', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- Enable Realtime on notifications for push notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications (mark read)"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 14. MATERIALIZED VIEWS
-- ============================================

-- Drama Rankings (aggregates ratings + watchlist counts)
CREATE MATERIALIZED VIEW IF NOT EXISTS drama_rankings AS
SELECT
  w.tmdb_id,
  COUNT(DISTINCT w.id) AS watchlist_count,
  COUNT(DISTINCT CASE WHEN w.status = 'completed' THEN w.id END) AS completed_count,
  COALESCE(AVG(w.rating)::NUMERIC(3,1), 0) AS avg_user_rating,
  COUNT(DISTINCT r.id) AS review_count,
  COALESCE(AVG(r.rating)::NUMERIC(3,1), 0) AS avg_review_rating
FROM watchlist_entries w
LEFT JOIN reviews r
  ON w.tmdb_id = r.tmdb_id
GROUP BY w.tmdb_id
ORDER BY watchlist_count DESC;

-- Popular Artists
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_artists AS
SELECT
  a.id,
  a.name,
  a.slug,
  a.type,
  a.image_url,
  COUNT(DISTINCT p.id) AS post_count,
  COUNT(DISTINCT r.id) AS reaction_count
FROM artists a
LEFT JOIN posts p
  ON p.artist_id = a.id
LEFT JOIN reactions r
  ON r.target_id = p.id AND r.target_type = 'post'
GROUP BY a.id
ORDER BY post_count DESC;
-- ============================================
-- 15. UTILITY FUNCTIONS
-- ============================================

-- Atomic view count increment
CREATE OR REPLACE FUNCTION increment_view_count(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON watchlist_entries;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON watchlist_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON reviews;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON posts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON comments;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON artists;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Done! Your HALLYU.WORLD database is ready 🎉
-- ============================================
