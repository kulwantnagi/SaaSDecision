import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kitSlug: string }>;
}): Promise<Metadata> {
  const { kitSlug } = await params;
  const kit = REPLACEMENT_KITS[kitSlug];
  if (!kit) return {};

  return {
    title: `${kit.targetSaaS} Replacement Kit: Alternatives and Open Source SaaS Solutions`,
    description: `Deploy a production-ready open source SaaS replacement for ${kit.targetSaaS}. ${kit.description}`,
    keywords: [
      `${kit.targetSaaS} replacement kit`,
      `${kit.targetSaaS} alternatives`,
      `open source ${kit.targetSaaS} alternative`,
      `open source SaaS solutions`,
      `self-hosted ${kit.targetSaaS}`,
    ],
  };
}

export interface KitDetails {
  title: string;
  targetSaaS: string;
  description: string;
  price: number;
  techStack: string[];
  featuresIncluded: string[];
  codexPrompt: string;
}

const REPLACEMENT_KITS: Record<string, KitDetails> = {
  'calendly-kit': {
    title: 'Calendly Replacement Kit',
    targetSaaS: 'Calendly',
    description: 'Production-ready Next.js 16 + Tailwind v4 + PostgreSQL scheduling kit with Google Calendar API sync and Stripe checkout.',
    price: 49,
    techStack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'PostgreSQL', 'Google Calendar API', 'Stripe'],
    featuresIncluded: ['Booking widget', 'Calendar availability sync', 'Email confirmations', 'Custom booking limits'],
    codexPrompt: 'Build a production Next.js 16 scheduling widget with Google Calendar API integration and custom booking limits.',
  },
  'typeform-kit': {
    title: 'Typeform Replacement Kit',
    targetSaaS: 'Typeform',
    description: 'Conversational form builder starter with branching logic, webhook actions, and CSV submission export.',
    price: 39,
    techStack: ['Next.js 16', 'React 19', 'Zod', 'PostgreSQL', 'Resend Email'],
    featuresIncluded: ['One-question-at-a-time form UI', 'Branching conditions', 'Webhook export', 'Submission analytics'],
    codexPrompt: 'Build a conversational form builder in Next.js 16 with conditional step navigation and Resend email alerts.',
  },
};

export default async function ReplacementKitPage({
  params,
}: {
  params: Promise<{ kitSlug: string }>;
}) {
  const { kitSlug } = await params;
  const kit = REPLACEMENT_KITS[kitSlug];

  if (!kit) notFound();

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
        <Link href="/" className="hover:text-[#2b00d9] transition">Home</Link>
        <span>»</span>
        <Link href="/kits/calendly-kit" className="hover:text-[#2b00d9] transition">Starter Kits</Link>
        <span>»</span>
        <span className="text-[#0f172a] font-bold">{kit.targetSaaS} Replacement</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#2b00d9]/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider bg-[#eef2ff] text-[#2b00d9] px-3.5 py-1 rounded-full border border-[#c7d2fe] inline-block shadow-2xs">
            Downloadable Starter Kit
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">{kit.title}</h1>
        <p className="text-sm md:text-base text-[#475569] font-medium leading-relaxed max-w-2xl mx-auto">
          {kit.description}
        </p>
      </div>

      {/* Main Kit Card */}
      <div className="bg-white border border-[#e2e8f0] p-6 sm:p-10 rounded-3xl space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#f1f5f9] pb-6 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#0f172a]">Kit Architecture Overview</h2>
            <p className="text-xs text-[#64748b] font-medium mt-1">Source Code + AI Prompt + Complete Deployment Guide</p>
          </div>
          <div className="bg-[#eef2ff] border border-[#c7d2fe] px-5 py-2 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-black text-[#2b00d9] tabular-nums">${kit.price} USD</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">Included Features</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {kit.featuresIncluded.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] p-3.5 rounded-2xl">
                <span className="w-6 h-6 rounded-full bg-[#f0fdf4] border border-[#86efac] text-[#16a34a] font-bold text-xs flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span className="text-xs font-semibold text-[#0f172a]">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">Technology Stack</h3>
          <div className="flex flex-wrap gap-2.5">
            {kit.techStack.map((tech, i) => (
              <span key={i} className="text-xs bg-[#f8fafc] text-[#334155] font-bold px-3.5 py-1.5 rounded-xl border border-[#e2e8f0] shadow-2xs">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Codex Prompt */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">Codex / AI Builder Execution Prompt</h3>
          <pre className="bg-[#f8fafc] border border-[#cbd5e1] p-4 sm:p-5 rounded-2xl text-xs text-[#1e293b] font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
            {kit.codexPrompt}
          </pre>
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-[#f1f5f9]">
          <Link
            href="/expert-audit"
            className="block text-center bg-gradient-to-r from-[#2b00d9] to-[#1f00a8] hover:from-[#1f00a8] hover:to-[#17007e] text-white font-extrabold py-4 rounded-2xl text-sm transition shadow-lg shadow-[#2b00d9]/25 hover:shadow-xl"
          >
            Get {kit.title} (${kit.price}) ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
