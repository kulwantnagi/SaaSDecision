import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build or Migrate SaaS Stack: Alternatives and Open Source SaaS Solutions',
  description: 'Hire expert engineers to build or deploy custom open source SaaS solutions and replace proprietary subscription software.',
  keywords: [
    'build SaaS alternative',
    'open source SaaS solutions',
    'SaaS migration engineering',
    'open source SaaS alternatives',
  ],
};

export default function LeadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
