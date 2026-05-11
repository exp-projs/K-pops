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

const RSS_SOURCES = [
  { url: 'https://www.soompi.com/feed', name: 'Soompi' },
  { url: 'https://www.koreaboo.com/feed/', name: 'Koreaboo' },
  { url: 'https://www.allkpop.com/feed', name: 'AllKPop' },
];

export const newsApi = {
  async getLatestNews(limit = 6): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];

    // Fetch from all sources in parallel, handle individual failures
    const results = await Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
        try {
          const feed = await parser.parseURL(source.url);
          return feed.items.map((item) => ({
            id: item.guid || item.link || String(Math.random()),
            title: item.title || 'Untitled',
            excerpt: item.contentSnippet?.slice(0, 120)?.replace(/\n/g, ' ') + '...' || '',
            url: item.link || '#',
            source: source.name,
            category: item.categories?.[0] || 'News',
            publishedAt: item.isoDate || new Date().toISOString(),
          }));
        } catch (error) {
          console.error(`Error fetching ${source.name} RSS:`, error);
          return [];
        }
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });

    // Sort by date (newest first) and limit
    return allArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
};
