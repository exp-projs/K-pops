export interface NewsArticle {
  id: string;
  source: NewsSource;
  title: string;
  excerpt: string;
  url: string;
  thumbnailUrl: string | null;
  category: NewsCategory;
  publishedAt: string;
  fetchedAt: string;
}

export type NewsSource = 'Soompi' | 'Allkpop' | 'Koreaboo' | 'Dramabeans';

export type NewsCategory = 'Drama' | 'K-Pop' | 'Celebrity' | 'Industry' | 'BTS';

export interface NewsFeed {
  articles: NewsArticle[];
  lastUpdated: string;
  totalCount: number;
}
