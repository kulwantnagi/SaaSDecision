import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/common/Header';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Open Source SaaS Alternatives & Solutions - SaaS Decision',
    template: '%s | SaaS Decision',
  },
  description: 'Discover verified open source alternatives and self-hosted SaaS solutions to 985+ software tools. Get deterministic KEEP, SWITCH, SELF-HOST, AUTOMATE & BUILD decision scores.',
  keywords: [
    'open source SaaS alternatives',
    'open source SaaS solutions',
    'SaaS alternatives',
    'self-host software',
    'open source alternatives',
    'SaaS decision engine',
    'reduce SaaS costs',
    'vendor lock-in',
    'software evaluation',
    'keep or switch SaaS',
  ],
  authors: [{ name: 'SaaS Decision' }],
  creator: 'SaaS Decision',
  publisher: 'SaaS Decision',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'SaaS Decision',
    title: 'Open Source SaaS Alternatives & Solutions - SaaS Decision',
    description: 'Discover verified open source alternatives and self-hosted SaaS solutions to 985+ software tools. Deterministic KEEP, SWITCH & SELF-HOST scores.',
    url: BASE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/saas-decision.webp',
        width: 1200,
        height: 630,
        alt: 'SaaS Decision - Open Source SaaS Alternatives & Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source SaaS Alternatives & Solutions - SaaS Decision',
    description: 'Discover verified open source alternatives and self-hosted SaaS solutions to 985+ software tools. Deterministic KEEP, SWITCH & SELF-HOST scores.',
    creator: '@SaaSDecision',
    images: [
      `${BASE_URL}/api/og`,
      `${BASE_URL}/saas-decision.webp`,
    ],
  },
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
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f4f6fb] text-[#0f172a] antialiased">
        {/* Responsive Header with Mobile Navigation Drawer */}
        <Header />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-0 border-t border-[#e2e8f0] bg-white py-8 sm:py-10 text-xs text-[#64748b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#2b00d9] flex items-center justify-center text-[10px] text-white font-bold">
                S
              </div>
              <span className="font-bold text-[#0f172a]">SaaS Decision</span>
              <span className="hidden sm:inline">— Open Source SaaS Alternatives</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
              <Link href="/" className="hover:text-[#2b00d9] transition">Index</Link>
              <Link href="/audit" className="hover:text-[#2b00d9] transition">Audit</Link>
              <Link href="/blueprint" className="hover:text-[#2b00d9] transition">Blueprint</Link>
              <Link href="/expert-audit" className="hover:text-[#2b00d9] transition">Expert Review</Link>
            </div>
            <p>© {new Date().getFullYear()} SaaS Decision. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

