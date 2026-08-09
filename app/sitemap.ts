import { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';
import { getCanonicalUrl, type Locale } from '@/lib/seo';

/**
 * Root sitemap.ts - generates sitemap for all locales
 * Serves at http://domain.com/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: getCanonicalUrl(locale as Locale),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));
}
