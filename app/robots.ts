import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

/**
 * Root robots.txt generator
 * Serves at http://domain.com/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
