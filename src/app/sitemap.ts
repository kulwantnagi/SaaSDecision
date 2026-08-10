import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { CATEGORY_TREE } from '@/domain/category-navigation';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  const now = new Date();

  // Static core landing pages
  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/audit`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/blueprint`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/expert-audit`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/lead`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Category pages
  const categoryUrls = CATEGORY_TREE.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Software detail, open-source, and alternatives sub-routes
  const softwareUrls = ALL_SOFTWARE_PRODUCTS.flatMap((prod) => [
    {
      url: `${baseUrl}/software/${prod.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/software/${prod.slug}/open-source`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/software/${prod.slug}/alternatives`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  return [...staticPages, ...categoryUrls, ...softwareUrls];
}
