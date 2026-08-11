import { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';
import { getCanonicalUrl, type Locale } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * Root sitemap.ts - generates sitemap for landing page + all locale pages
 * Serves at http://domain.com/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://daniel-iel.github.io/Systemly';

  // Landing page entry
  const landingEntry: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  // Locale-specific pages
  const localeEntries = locales.map((locale) => ({
    url: getCanonicalUrl(locale as Locale),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...landingEntry, ...localeEntries];
}
