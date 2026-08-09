import { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
