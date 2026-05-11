import Parser from 'rss-parser';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

const parser = new Parser({
  customFields: {
    item: ['category'],
  },
});

export const newsApi = {
  async getLatestNews(limit = 6): Promise<NewsArticle[]> {
    try {
      // Using Soompi RSS feed as a reliable source for K-culture news
      const feed = await parser.parseURL('https://www.soompi.com/feed');
      
      return feed.items.slice(0, limit).map((item) => ({
        id: item.guid || item.link || String(Math.random()),
        title: item.title || 'Untitled',
        excerpt: item.contentSnippet?.slice(0, 100) + '...' || '',
        url: item.link || '#',
        source: 'Soompi',
        category: item.categories?.[0] || 'News',
        publishedAt: item.isoDate || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }
};
