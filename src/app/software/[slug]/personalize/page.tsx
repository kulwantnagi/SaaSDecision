import { notFound } from 'next/navigation';
import { getSoftwareBySlug } from '@/domain/catalog-service';
import PersonalizeForm from './PersonalizeForm';

export default async function PersonalizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) notFound();

  return (
    <div className="py-6">
      <PersonalizeForm assessment={prod.assessment} softwareName={prod.name} />
    </div>
  );
}
