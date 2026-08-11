import type { Metadata, Viewport } from 'next';
import '@/app/globals.scss';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://daniel-iel.github.io/Systemly';
const ogImageUrl = `${baseUrl}/og-image.svg`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Systemly — System Design Training',
  description:
    'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
  keywords: [
    'system design',
    'architecture diagram',
    'system design interview',
    'distributed systems',
    'cloud architecture',
    'microservices',
  ],
  applicationName: 'Systemly',
  authors: [{ name: 'Systemly' }],
  creator: 'Systemly',
  publisher: 'Systemly',
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
    type: 'website',
    locale: 'en',
    url: baseUrl,
    siteName: 'Systemly',
    title: 'Systemly — System Design Training',
    description:
      'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Systemly - System Design Training',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Systemly — System Design Training',
    description:
      'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
    images: [ogImageUrl],
  },
};

// Root layout with html/body tags for landing page
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body>{children}</body>
    </html>
  );
}
