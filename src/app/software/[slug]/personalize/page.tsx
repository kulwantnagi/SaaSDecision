import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSoftwareBySlug } from '@/domain/catalog-service';
import PersonalizeForm from './PersonalizeForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prod = getSoftwareBySlug(slug);
  if (!prod) return {};

  return {
    title: `Personalize ${prod.name} Alternatives and Open Source SaaS Solutions`,
    description: `Customize team size, feature usage, and developer bandwidth to calculate personalized decision scores and optimal open source SaaS alternatives for ${prod.name}.`,
    keywords: [
      `personalize ${prod.name} decision`,
      `${prod.name} alternatives`,
      `open source ${prod.name} alternative`,
      `open source SaaS solutions`,
    ],
  };
}

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
