import { Footer } from '@/components/layout/footer';
import { Navigation } from '@/components/layout/navigation';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <div id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    </NextIntlClientProvider>
  );
}