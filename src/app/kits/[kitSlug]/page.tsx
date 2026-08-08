import { notFound } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_25_PRODUCTS } from '@/domain/seed-data';

export interface KitDetails {
  title: string;
  targetSaaS: string;
  description: string;
  price: number;
  techStack: string[];
  featuresIncluded: string[];
  codexPrompt: string;
}

export const REPLACEMENT_KITS: Record<string, KitDetails> = {
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
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="border-b border-[#23252a] pb-6 space-y-2 text-center">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#141516] text-[#828fff] px-2.5 py-0.5 rounded border border-[#23252a]">
          Downloadable Starter Kit
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">{kit.title}</h1>
        <p className="text-sm text-[#8a8f98] max-w-2xl mx-auto">{kit.description}</p>
      </div>

      <div className="bg-[#0f1011] border border-[#23252a] p-8 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#23252a] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Kit Overview</h2>
            <p className="text-xs text-[#8a8f98]">Source Code + AI Prompt + Deployment Guide</p>
          </div>
          <span className="text-2xl font-black text-[#27a644]">${kit.price} USD</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Included Features</h3>
          <ul className="grid gap-2 sm:grid-cols-2 text-xs text-[#8a8f98]">
            {kit.featuresIncluded.map((feat, i) => (
              <li key={i} className="flex gap-2 items-center">
                <span className="text-[#27a644] font-bold">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {kit.techStack.map((tech, i) => (
              <span key={i} className="text-xs bg-[#141516] text-[#f7f8f8] px-3 py-1 rounded-lg border border-[#23252a]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-white">Codex / AI Builder Execution Prompt</h3>
          <pre className="bg-[#010102] border border-[#23252a] p-4 rounded-xl text-xs text-[#8a8f98] font-mono whitespace-pre-wrap">
            {kit.codexPrompt}
          </pre>
        </div>

        <div className="pt-4 border-t border-[#23252a]">
          <Link
            href="/expert-audit"
            className="block text-center bg-[#5e6ad2] hover:bg-[#828fff] text-white font-medium py-3.5 rounded-xl text-sm transition shadow-lg shadow-[#5e6ad2]/30"
          >
            Purchase {kit.title} (${kit.price}) ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
