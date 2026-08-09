import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expert SaaS Audit: Alternatives and Open Source SaaS Solutions',
  description: 'Get a 1-on-1 expert human SaaS architecture review. Migrate off expensive subscription tools to verified open source SaaS alternatives and custom software.',
  keywords: [
    'expert SaaS audit',
    'open source SaaS solutions',
    'SaaS migration review',
    'open source SaaS alternatives',
  ],
};

export default function ExpertAuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
