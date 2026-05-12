import HeroSection from '@/components/home/HeroSection';
import ContentRow from '@/components/home/ContentRow';
import NewsSection from '@/components/home/NewsSection';
import RankingsPreview from '@/components/home/RankingsPreview';
import StatsStrip from '@/components/home/StatsStrip';
import { mdlApi } from '@/lib/api/mdl';
import { kpopApi } from '@/lib/api/kpop';
import { newsApi } from '@/lib/api/news';

export default async function HomePage() {
  // Fetch data in parallel for performance
  const [trendingDramas, currentlyAiring, news, topTracks, featuredArtists] = await Promise.all([
    mdlApi.getTrendingDramas(),
    mdlApi.getCurrentlyAiring(),
    newsApi.getLatestNews(6),
    kpopApi.getTrendingTracks(5),
    kpopApi.getFeaturedArtists()
  ]);

  const topRated = [...trendingDramas]
    .sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0))
    .slice(0, 10);

  const heroDramas = trendingDramas.slice(0, 5);

  return (
    <>
      <HeroSection dramas={heroDramas} />

      <ContentRow
        title="Trending Now"
        koreanTitle="트렌딩 지금"
        subtitle="What the world is watching"
        dramas={trendingDramas}
        seeAllHref="/dramas?sort=trending"
      />

      <ContentRow
        title="On Air This Week"
        subtitle="Currently airing K-Dramas"
        dramas={currentlyAiring.slice(0, 10)}
        seeAllHref="/dramas?status=airing"
      />

      <NewsSection news={news} />

      <ContentRow
        title="Top Rated"
        koreanTitle="최고 평점"
        subtitle="The best of the best — all time favorites"
        dramas={topRated}
        seeAllHref="/rankings"
        showRank
      />

      <RankingsPreview 
        topDramas={topRated.slice(0, 5)} 
        topIdols={featuredArtists.slice(0, 5)} 
        topTracks={topTracks.slice(0, 5)} 
      />

      <StatsStrip />
    </>
  );
}
