import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { locales, type Locale } from "@/i18n.config";
import {
  getCanonicalUrl,
  getAlternateLanguages,
  getMetadataForLocale,
  getOGImageUrl,
  toOGLocale,
} from "@/lib/seo";
import { generateSchemaGraph } from "@/lib/schema";
import { StructuredData } from "@/components/StructuredData";
import "@/app/globals.scss";

export const dynamic = 'auto';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get SEO content for current locale
  const { title, description, keywords } = getMetadataForLocale(locale as Locale);
  const currentUrl = getCanonicalUrl(locale as Locale);
  const alternateLanguages = getAlternateLanguages(locale as Locale);
  const ogImageUrl = getOGImageUrl(locale as Locale);

  // Generate structured data for rich snippets and SEO
  const schemaGraph = generateSchemaGraph(locale as Locale);

  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: [{ name: "Systemly" }],
    creator: "Systemly",
    publisher: "Systemly",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    openGraph: {
      title: title,
      description: description,
      url: currentUrl,
      siteName: "Systemly",
      locale: toOGLocale(locale as Locale),
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    themeColor: '#000000',
    other: {
      'application-ld+json': JSON.stringify(schemaGraph),
    },
  };
}

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
  params,
}: LayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Manually import messages for the current locale
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
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
        <StructuredData schema={generateSchemaGraph(locale as Locale)} id="schema-graph" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
