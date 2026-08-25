import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PL 15/16 Analytics',
  description: 'Premier League 2015/16 Player Analytics Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}