import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://keepswitchbuild.com';

  const softwareUrls = ALL_SOFTWARE_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/software/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...softwareUrls,
  ];
}
