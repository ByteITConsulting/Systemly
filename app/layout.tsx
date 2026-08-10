import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://daniel-iel.github.io/Systemly'),
};

// Minimal root layout with html/body tags for root page redirect
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
