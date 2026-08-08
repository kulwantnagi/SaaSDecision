import AuditForm from './AuditForm';

export const metadata = {
  title: 'Full SaaS Stack Audit - Analyze Total SaaS Spend & Overlaps',
  description: 'Evaluate your complete SaaS subscription stack, detect software overlaps, and compute potential annual savings.',
};

export default function AuditPage() {
  return (
    <div className="py-6">
      <AuditForm />
    </div>
  );
}
