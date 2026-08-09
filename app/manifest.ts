import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

/**
 * PWA Web Manifest
 * Defines app metadata for web app installation
 * Serves at http://domain.com/manifest.json
 */
export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = getBaseUrl();

  return {
    name: 'Systemly — System Design Training',
    short_name: 'Systemly',
    description:
      'Interactive system design training platform. Build and share architecture diagrams.',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${baseUrl}/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${baseUrl}/icon-192-maskable.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${baseUrl}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${baseUrl}/icon-512-maskable.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'productivity'],
  };
}
