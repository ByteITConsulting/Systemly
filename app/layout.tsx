import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/i18n.config';
import {
  getCanonicalUrl,
  getAlternateLanguages,
  getOGImageUrl,
  getMetadataForLocale,
  toOGLocale,
} from '@/lib/seo';
import { generateSchemaGraph } from '@/lib/schema';
import { StructuredData } from '@/components/StructuredData';
import '@/app/globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(`https://daniel-iel.github.io/Systemly`),
};

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#000000',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Manually import messages for the default locale
  const messages = (await import(`@/messages/${defaultLocale}.json`)).default;

  return (
    <html lang={defaultLocale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <StructuredData schema={generateSchemaGraph(defaultLocale as any)} id="schema-graph" />
      </head>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
