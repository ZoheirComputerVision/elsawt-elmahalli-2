import EditorialTopBar from "@/components/layout/EditorialTopBar";
import NewspaperMasthead from "@/components/layout/NewspaperMasthead";
import NewspaperNav from "@/components/layout/NewspaperNav";
import BannerAd from "@/components/features/BannerAd";
import HeroSection from "@/components/features/HeroSection";
import HeadlinesSection from "@/components/features/HeadlinesSection";
import LocalSection from "@/components/features/LocalSection";
import NationalSection from "@/components/features/NationalSection";
import EconomySection from "@/components/features/EconomySection";
import OpinionSection from "@/components/features/OpinionSection";
import SpecializedSection from "@/components/features/SpecializedSection";
import EconomicDirectoryPreview from "@/components/features/EconomicDirectoryPreview";
import LatestNewsGrid from "@/components/features/LatestNewsGrid";
import Footer from "@/components/layout/Footer";
import { getPublishedNews, getNewsByCategory, getNewsByRegion, getHeroNews } from "@/features/news/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allNews = await getPublishedNews(20);
  const hero = await getHeroNews();
  const nationalNews = await getNewsByCategory("nation", 4);
  const economyNews = await getNewsByCategory("economy", 8);
  const opinionNews = await getNewsByCategory("opinion", 3);
  const specializedNews = await getNewsByCategory("specialized", 5);
  const tiaretNews = await getNewsByRegion("tiaret", 5);
  const tissemsiltNews = await getNewsByRegion("tissemsilt", 5);
  const ksarNews = await getNewsByRegion("ksar-chellala", 5);

  return (
    <>
      <EditorialTopBar />
      <NewspaperMasthead />
      <NewspaperNav />

      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <BannerAd />
        </div>

        <section className="bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <HeroSection main={hero.main} secondary={hero.secondary} />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4">
          <div className="my-8">
            <HeadlinesSection news={allNews.slice(0, 5)} />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <LocalSection
              tiaretNews={tiaretNews}
              tissemsiltNews={tissemsiltNews}
              ksarNews={ksarNews}
            />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <NationalSection news={nationalNews} />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <EconomySection news={economyNews} />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <OpinionSection news={opinionNews} />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <SpecializedSection news={specializedNews} />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <EconomicDirectoryPreview />
          </div>

          <div className="newspaper-separator" />

          <div className="mb-8">
            <LatestNewsGrid news={allNews} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
