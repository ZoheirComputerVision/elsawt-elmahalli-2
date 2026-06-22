import EditorialTopBar from "@/components/layout/EditorialTopBar";
import NewspaperMasthead from "@/components/layout/NewspaperMasthead";
import NewspaperNav from "@/components/layout/NewspaperNav";
import EditorialTrustLayer from "@/components/features/EditorialTrustLayer";
import BannerAd from "@/components/features/BannerAd";
import SmartInfoBar from "@/components/features/SmartInfoBar";
import LiveNewsRibbon from "@/components/features/LiveNewsRibbon";
import HeroSection from "@/components/features/HeroSection";
import WeatherModule from "@/components/features/WeatherModule";
import TrendingBar from "@/components/features/TrendingBar";
import HeadlinesSection from "@/components/features/HeadlinesSection";
import LocalServiceDashboard from "@/components/features/LocalServiceDashboard";
import LocalSection from "@/components/features/LocalSection";
import NationalSection from "@/components/features/NationalSection";
import EconomySection from "@/components/features/EconomySection";
import OpinionSection from "@/components/features/OpinionSection";
import SpecializedSection from "@/components/features/SpecializedSection";
import EconomicDirectoryPreview from "@/components/features/EconomicDirectoryPreview";
import RegionalCoverageMap from "@/components/features/RegionalCoverageMap";
import LatestNewsGrid from "@/components/features/LatestNewsGrid";
import Footer from "@/components/layout/Footer";
import { getPublishedNews, getNewsByCategory, getNewsByRegion, getHeroNews } from "@/features/news/queries";

export const dynamic = "force-dynamic";

function EditorialSeparator() {
  return <div className="h-px bg-gradient-to-r from-gold/40 via-gold to-gold/40 my-5" />;
}

export default async function Home() {
  const allNews = await getPublishedNews(20);
  const hero = await getHeroNews();
  const nationalNews = await getNewsByCategory("nation", 5);
  const economyNews = await getNewsByCategory("economy", 5);
  const opinionNews = await getNewsByCategory("opinion", 5);
  const specializedNews = await getNewsByCategory("specialized", 5);
  const tiaretNews = await getNewsByRegion("tiaret", 5);
  const tissemsiltNews = await getNewsByRegion("tissemsilt", 5);
  const ksarNews = await getNewsByRegion("ksar-chellala", 5);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayNewsCount = allNews.filter(
    (n) => n.publishedAt && new Date(n.publishedAt) >= todayStart,
  ).length;
  const latestDate = allNews.length > 0 ? allNews[0].publishedAt : null;

  function fmtDate(d: Date | null | undefined): string | null {
    if (!d) return null;
    return new Date(d).toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  }
  const regionData = [
    { name: "تيارت", slug: "tiaret", articlesCount: tiaretNews.length, latestUpdate: fmtDate(tiaretNews[0]?.publishedAt) },
    { name: "تيسمسيلت", slug: "tissemsilt", articlesCount: tissemsiltNews.length, latestUpdate: fmtDate(tissemsiltNews[0]?.publishedAt) },
    { name: "قصر الشلالة", slug: "ksar-chellala", articlesCount: ksarNews.length, latestUpdate: fmtDate(ksarNews[0]?.publishedAt) },
  ];

  return (
    <>
      <EditorialTopBar />
      <NewspaperMasthead />
      <EditorialTrustLayer />
      <NewspaperNav />

      <main className="w-full">
        <div className="max-w-[90rem] mx-auto px-4 pt-4">
          <BannerAd />
        </div>

        <SmartInfoBar
          todayNewsCount={todayNewsCount}
          latestDate={latestDate}
        />

        <LiveNewsRibbon />

        <section className="bg-white border-y border-gray-200">
          <div className="max-w-[90rem] mx-auto px-4 py-4">
            <HeroSection main={hero.main} secondary={hero.secondary} />
          </div>
        </section>

        <div className="max-w-[90rem] mx-auto px-4">
          <WeatherModule />

          <TrendingBar news={allNews.slice(0, 5)} />

          <div className="my-5">
            <HeadlinesSection news={allNews.slice(0, 5)} />
          </div>

          <LocalServiceDashboard />

          <EditorialSeparator />

          <div className="mb-5">
            <LocalSection
              tiaretNews={tiaretNews}
              tissemsiltNews={tissemsiltNews}
              ksarNews={ksarNews}
            />
          </div>

          <EditorialSeparator />

          <div className="mb-5">
            <NationalSection news={nationalNews} />
          </div>

          <EditorialSeparator />

          <div className="mb-5">
            <EconomySection news={economyNews} />
          </div>

          <EditorialSeparator />

          <div className="mb-5">
            <OpinionSection news={opinionNews} />
          </div>

          <EditorialSeparator />

          <div className="mb-5">
            <SpecializedSection news={specializedNews} />
          </div>

          <EditorialSeparator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2">
              <EconomicDirectoryPreview />
            </div>
            <div className="lg:col-span-1">
              <RegionalCoverageMap regions={regionData} />
            </div>
          </div>

          <EditorialSeparator />

          <div className="mb-5">
            <LatestNewsGrid news={allNews} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
