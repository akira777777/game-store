import { Locale } from './i18n';

declare module 'next-intl' {
  export function useLocale(): Locale;
}
