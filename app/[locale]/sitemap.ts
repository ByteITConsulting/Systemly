import { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));
}
