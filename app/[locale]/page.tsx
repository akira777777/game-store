import { CategoriesSection } from '@/components/layout/categories-section';
import { CtaSection } from '@/components/layout/cta-section';
import { HeroSection } from '@/components/layout/hero-section';
import { ValuePropsSection } from '@/components/layout/value-props-section';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { GameGrid } from '@/components/game/game-grid';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
export const runtime = 'nodejs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    en: 'Game Store - Buy Video Games Online',
    ru: 'Game Store - Покупайте видеоигры онлайн',
  };
  
  const descriptions: Record<string, string> = {
    en: 'Modern online store with the best games for all platforms. Exclusive discounts and instant delivery of digital copies.',
    ru: 'Современный интернет-магазин с лучшими играми для всех платформ. Эксклюзивные скидки и мгновенная доставка цифровых копий.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ValuePropsSection />

      {/* Featured Games Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {locale === 'ru' ? 'Избранные игры' : 'Featured Games'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {locale === 'ru'
                ? 'Ознакомьтесь с нашими бестселлерами и самыми популярными играми'
                : "Check out our best-selling and most popular games"}
            </p>
          </div>
          <Link href={`/${locale}/games`}>
            <Button variant="outline" size="lg">
              {locale === 'ru' ? 'Все игры' : 'View All Games'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <ErrorBoundary fallback={<div className="text-center text-red-500">{locale === 'ru' ? 'Ошибка загрузки игр' : 'Error loading games'}</div>}>
          <GameGrid />
        </ErrorBoundary>
      </section>

      <CategoriesSection />
      <CtaSection />
    </main>
  );
}
