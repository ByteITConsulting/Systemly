import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/i18n.config";
import "@/app/globals.scss";

export const dynamic = 'force-dynamic';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: LayoutProps): Promise<Metadata> {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const titles: Record<string, string> = {
    en: "Systemly — System Design Training",
    pt: "Systemly — Treino de System Design",
  };

  const descriptions: Record<string, string> = {
    en: "Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.",
    pt: "Monte diagramas de arquitetura arrastando componentes, conecte-os e exporte como PNG. Treine system design de forma visual.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  if (!locales.includes(locale as any)) {
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
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
