import {getRequestConfig} from 'next-intl/server';
import { notFound } from "next/navigation";

// Локали должны соответствовать i18n.ts
const locales = ["en", "ru"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Валидация входящего параметра locale
  if (!locales.includes(locale as Locale)) notFound();

  const validLocale = locale as Locale;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  };
});
