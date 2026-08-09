import { MetadataRoute } from 'next';
import { locales } from '@/i18n.config';

interface ManifestProps {
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default function manifest({ params: { locale } }: ManifestProps): MetadataRoute.Manifest {
  const names: Record<string, { name: string; short_name: string; description: string }> = {
    en: {
      name: 'Systemly — System Design Training',
      short_name: 'Systemly',
      description: 'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
    },
    pt: {
      name: 'Systemly — Treino de System Design',
      short_name: 'Systemly',
      description: 'Monte diagramas de arquitetura arrastando componentes, conecte-os e exporte como PNG. Treine system design de forma visual.',
    },
  };

  const content = names[locale] || names.en;

  return {
    name: content.name,
    short_name: content.short_name,
    description: content.description,
    start_url: `/${locale}`,
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
