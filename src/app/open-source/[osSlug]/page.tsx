import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOpenSourceToolBySlug, getAllUniqueOpenSourceTools } from '@/domain/catalog-service';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ osSlug: string }>;
}): Promise<Metadata> {
  const { osSlug } = await params;
  const tool = getOpenSourceToolBySlug(osSlug);
  if (!tool) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';
  const replacedNames = tool.replacedProducts.slice(0, 3).map((p) => p.name).join(', ');

  return {
    title: `${tool.name} Review: Free Open Source Alternative to ${replacedNames || 'Commercial SaaS'}`,
    description: `Deploy and self-host ${tool.name}. Learn how ${tool.name} replaces expensive proprietary tools like ${replacedNames}. Zero monthly subscription fees, 100% data sovereignty.`,
    keywords: [
      tool.name,
      `${tool.name} open source`,
      `self-host ${tool.name}`,
      `${tool.name} docker compose`,
      `${tool.name} vs ${tool.replacedProducts[0]?.name || 'SaaS'}`,
      `open source SaaS solutions`,
    ],
    openGraph: {
      title: `${tool.name} Open Source Review & Self-Hosting Guide`,
      description: `Free, self-hostable open source replacement for ${replacedNames}. Includes Docker Compose setup and VPS deployment guide.`,
      images: [
        {
          url: '/saas-decision.webp',
          width: 1200,
          height: 630,
          alt: `${tool.name} Open Source Review`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} Open Source Review & Self-Hosting Guide`,
      description: `Free, self-hostable open source replacement for ${replacedNames}.`,
      images: [`${baseUrl}/saas-decision.webp`],
    },
  };
}

export default async function OpenSourceToolPage({
  params,
}: {
  params: Promise<{ osSlug: string }>;
}) {
  const { osSlug } = await params;
  const tool = getOpenSourceToolBySlug(osSlug);
  if (!tool) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  const dockerComposeSnippet = `version: '3.8'
services:
  ${tool.slug}:
    image: ${tool.dockerImage || `${tool.slug}:latest`}
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:secret@db:5432/${tool.slug.replace(/[^a-z0-9]+/g, '_')}
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret
volumes:
  pgdata:`;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.categoryName,
    operatingSystem: 'Linux, Docker, Self-Hosted',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `${baseUrl}/open-source/${tool.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What commercial SaaS products does ${tool.name} replace?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool.name} is a verified self-hosted replacement for ${tool.replacedProducts.map((p) => p.name).join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${tool.name} free to use and self-host?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${tool.name} is distributed under open-source licenses (${tool.license || 'Open Source'}). You can self-host it on your own server with no per-seat fees.`,
        },
      },
    ],
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[#64748b] flex items-center gap-2">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href="/open-source" className="hover:text-[#2b00d9] transition">Open Source</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{tool.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-full border border-[#9333ea]/20">
              Verified Open-Source Platform
            </span>
            <span className="text-xs font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#86efac]">
              $0 License Fees
            </span>
          </div>
          <a
            href={tool.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-2 shadow-sm"
          >
            <span>GitHub Repository</span>
            <span>↗</span>
          </a>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          {tool.name} — Open Source Intelligence & Deployment Guide
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#475569] max-w-3xl leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Commercial SaaS Replaced Section */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#2b00d9] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#2b00d9]/20">
            SaaS Cost Optimization
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Commercial SaaS Platforms Replaced by {tool.name} ({tool.replacedProducts.length})
          </h2>
          <p className="text-xs text-[#64748b] font-medium mt-1">
            Switching from these commercial platforms to self-hosted {tool.name} can eliminate 80–95% of software subscription spend.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tool.replacedProducts.map((p) => (
            <Link
              key={p.slug}
              href={`/software/${p.slug}`}
              className="bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2b00d9] p-5 rounded-2xl space-y-2 transition shadow-sm hover:bg-white group"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#0f172a] group-hover:text-[#2b00d9] transition">
                  {p.name}
                </h3>
                <span className="text-[10px] bg-[#e2e8f0] text-[#64748b] px-2 py-0.5 rounded font-semibold">
                  {p.categoryName?.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-[#64748b] font-medium line-clamp-2">
                {p.shortDescription}
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#2b00d9] flex items-center justify-between">
                <span>View SaaS Decision Report</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Docker Compose Quickstart */}
      <section className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#818cf8] tracking-wider">
              Self-Host Quickstart
            </span>
            <h2 className="text-xl font-black mt-0.5">Production Docker Compose Configuration</h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded">docker-compose.yml</span>
        </div>

        <pre className="text-xs font-mono bg-slate-900/90 p-4 rounded-2xl overflow-x-auto text-emerald-400 border border-slate-800 leading-relaxed">
          <code>{dockerComposeSnippet}</code>
        </pre>

        <p className="text-xs text-slate-400 leading-relaxed">
          Deploy this template on any modern Linux VPS (Hostinger, DigitalOcean, Hetzner) running Docker 24+ and Docker Compose v2.
        </p>
      </section>

      {/* Recommended Self-Hosting VPS Providers */}
      <section className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#f1f5f9] pb-4">
          <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#16a34a]/20">
            Infrastructure Guide
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Recommended VPS Providers for {tool.name}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#16a34a]">★ Best Value for Production</span>
              <h3 className="text-lg font-black text-[#0f172a]">Hostinger KVM VPS</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                High-performance NVMe SSDs, 1-click Docker OS template, dedicated IPv4, and 300MB/s network speed starting at $4.99/mo.
              </p>
            </div>
            <a
              href="https://hostinger.in/cloud-hosting"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-[#2b00d9] hover:bg-[#1f00a8] text-white text-center font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
            >
              Deploy on Hostinger ↗
            </a>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0069ff]">Developer Standard</span>
              <h3 className="text-lg font-black text-[#0f172a]">DigitalOcean Droplets</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                Fast developer droplet instances, 1-click Marketplace applications, floating IPs, and block storage starting at $4.00/mo.
              </p>
            </div>
            <a
              href="https://www.digitalocean.com"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-[#0069ff] hover:bg-[#0052cc] text-white text-center font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
            >
              Deploy on DigitalOcean ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
