/**
 * SEO Utilities for Systemly
 * Centralized functions for canonical URLs, hreflang generation, and metadata helpers
 */

import { locales, type Locale } from '@/i18n.config';

export type { Locale };

/**
 * Get base URL from environment or fallback to localhost
 * Production: Must set NEXT_PUBLIC_BASE_URL environment variable
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
}

/**
 * Build canonical URL for a given locale and optional path
 * @param locale - The locale (e.g., 'en', 'pt')
 * @param path - Optional path after locale (e.g., '/challenges/url-shortener')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(locale: Locale, path: string = ''): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`.replace(/\/$/, '') || `${baseUrl}/${locale}`;
}

/**
 * Generate hreflang alternate links for all locales
 * @param currentLocale - The current locale
 * @param path - Optional path (should be consistent across locales)
 * @returns Record of locale to canonical URL for hreflang
 */
export function getAlternateLanguages(
  currentLocale: Locale,
  path: string = ''
): Record<Locale, string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    alternates[locale] = getCanonicalUrl(locale as Locale, path);
  }

  return alternates as Record<Locale, string>;
}

/**
 * SEO content for different locales
 */
export const seoContent = {
  en: {
    title: 'Systemly — System Design Training',
    description:
      'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
    keywords:
      'system design, architecture diagram, system design interview, distributed systems, AWS training, cloud architecture, microservices, database design, load balancing, scalability, software architecture, technical interview',
  },
  pt: {
    title: 'Systemly — Treino de System Design',
    description:
      'Monte diagramas de arquitetura arrastando componentes, conecte-os e exporte como PNG. Treine system design de forma visual.',
    keywords:
      'system design, diagrama de arquitetura, entrevista system design, sistemas distribuídos, treinamento AWS, arquitetura cloud, microsserviços, design de banco de dados, balanceamento de carga, escalabilidade, arquitetura de software, entrevista técnica',
  },
};

/**
 * Get metadata content for a specific locale
 */
export function getMetadataForLocale(locale: Locale) {
  return seoContent[locale] || seoContent.en;
}

/**
 * OpenGraph image path builder
 * @param _locale - The locale
 * @returns OG image URL
 */
export function getOGImageUrl(_locale: Locale): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/og-image.png`;
}

/**
 * Build hreflang entries for a given path
 * Useful for structured data or sitemap generation
 */
export function buildHrefLangAlternates(path: string = '') {
  const alternates: Array<{ rel: string; hrefLang: string; href: string }> = [];

  for (const locale of locales) {
    alternates.push({
      rel: 'alternate',
      hrefLang: locale === 'pt' ? 'pt-BR' : locale,
      href: getCanonicalUrl(locale as Locale, path),
    });
  }

  return alternates;
}

/**
 * Metadata base URL as Next.js URL object
 */
export function getMetadataBase() {
  return new URL(getBaseUrl());
}

/**
 * OpenGraph locale format converter
 * pt -> pt_BR, en -> en (OpenGraph standard)
 */
export function toOGLocale(locale: Locale): string {
  return locale === 'pt' ? 'pt_BR' : 'en';
}
