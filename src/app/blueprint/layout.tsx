import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI SaaS Replacement Blueprint: Alternatives and Open Source SaaS Solutions',
  description: 'Generate an automated AI replacement spec for your SaaS stack. Get tech stack recommendations, dev labor estimates, and open source SaaS alternatives.',
  keywords: [
    'SaaS replacement blueprint',
    'open source SaaS alternatives',
    'AI software build spec',
    'open source SaaS solutions',
  ],
};

export default function BlueprintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
