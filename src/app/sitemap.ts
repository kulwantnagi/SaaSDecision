import { ALL_SOFTWARE_PRODUCTS, getAllUniqueOpenSourceTools, getTopComparisonPairs } from '@/domain/catalog-service';
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
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/open-source`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/lead`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Category pages
  const categoryUrls = CATEGORY_TREE.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dedicated Open-Source Tool Directory pages
  const ossTools = getAllUniqueOpenSourceTools();
  const ossUrls = ossTools.map((os) => ({
    url: `${baseUrl}/open-source/${os.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
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

  // Top high-intent comparison pairs
  const topPairs = getTopComparisonPairs(3);
  const compareUrls = topPairs.map((pair) => ({
    url: `${baseUrl}/compare/${pair.slugPair}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryUrls, ...ossUrls, ...softwareUrls, ...compareUrls];
}
