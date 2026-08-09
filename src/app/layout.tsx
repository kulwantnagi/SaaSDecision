import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Open Source SaaS Alternatives - SaaS Decision',
    template: '%s | SaaS Decision',
  },
  description: 'Find verified open-source alternatives to 985+ SaaS tools. Get deterministic KEEP, SWITCH, SELF-HOST, AUTOMATE & BUILD scores — no LLM hallucinations.',
  keywords: [
    'open source SaaS alternatives', 'SaaS alternatives', 'self-host software',
    'open source alternatives', 'SaaS decision engine', 'reduce SaaS costs',
    'vendor lock-in', 'software evaluation', 'keep or switch SaaS',
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
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'SaaS Decision',
    title: 'Open Source SaaS Alternatives - SaaS Decision',
    description: 'Find verified open-source alternatives to 985+ SaaS tools. Deterministic KEEP / SWITCH / SELF-HOST scores.',
    url: BASE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source SaaS Alternatives - SaaS Decision',
    description: 'Find verified open-source alternatives to 985+ SaaS tools. Deterministic KEEP / SWITCH / SELF-HOST scores.',
    creator: '@SaaSDecision',
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
        {/* Soft Modern Top Header Bar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-[#2b00d9] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#2b00d9]/25 group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#0f172a]">
                SaaS<span className="text-[#2b00d9]"> Decision</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-[#eef2ff] text-[#2b00d9] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
                v1.0
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#475569]">
              <Link href="/" className="hover:text-[#2b00d9] transition-colors">
                Software Index
              </Link>
              <Link href="/audit" className="hover:text-[#2b00d9] transition-colors">
                Stack Audit
              </Link>
              <Link href="/blueprint" className="hover:text-[#2b00d9] transition-colors">
                AI Replacement Blueprint
              </Link>
              <Link href="/expert-audit" className="hover:text-[#2b00d9] transition-colors">
                Expert Review
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/lead"
                className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#2b00d9] border border-[#2b00d9]/20 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Build for Me
              </Link>
              <Link
                href="/admin"
                className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-[#2b00d9]/25 transition"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-[#e2e8f0] bg-white py-10 text-xs text-[#64748b]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#2b00d9] flex items-center justify-center text-[10px] text-white font-bold">
                S
              </div>
              <span className="font-bold text-[#0f172a]">SaaS Decision</span>
              <span>— Open Source SaaS Alternatives</span>
            </div>
            <div className="flex gap-6 font-medium">
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
