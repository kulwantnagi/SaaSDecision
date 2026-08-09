import AuditForm from './AuditForm';

export const metadata = {
  title: 'SaaS Stack Audit: Alternatives and Open Source SaaS Solutions',
  description: 'Audit your complete software subscription stack. Detect redundant SaaS overlaps, calculate annual savings, and discover verified open source SaaS alternatives.',
  keywords: [
    'SaaS stack audit',
    'open source SaaS alternatives',
    'SaaS cost optimization',
    'open source SaaS solutions',
    'self-hosted software audit',
  ],
};

export default function AuditPage() {
  return (
    <div className="py-6">
      <AuditForm />
    </div>
  );
}
