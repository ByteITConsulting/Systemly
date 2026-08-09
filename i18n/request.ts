import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '@/i18n.config';

export default getRequestConfig(async ({ locale }) => {
  const validLocale = (locale || defaultLocale) as Locale;

  if (!locales.includes(validLocale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    locale: validLocale,
    messages: (await import(`@/messages/${validLocale}.json`)).default,
  };
});
