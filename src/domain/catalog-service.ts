import { INITIAL_25_PRODUCTS, VerifiedProductSeed } from './seed-data';
import { CATALOG_PRODUCTS } from './catalog-data';

// Merge initial high-touch seeds with the complete 980-tool dataset
const productMap = new Map<string, VerifiedProductSeed>();

// 1. Load general catalog products
for (const prod of CATALOG_PRODUCTS) {
  productMap.set(prod.slug, prod);
}

// 2. Override with custom hand-tuned seed data
for (const prod of INITIAL_25_PRODUCTS) {
  productMap.set(prod.slug, prod);
}

export const ALL_SOFTWARE_PRODUCTS: VerifiedProductSeed[] = Array.from(productMap.values());

/**
 * Retrieves all software products in the catalog
 */
export function getAllSoftware(): VerifiedProductSeed[] {
  return ALL_SOFTWARE_PRODUCTS;
}

/**
 * Retrieves a single software product by its slug
 */
export function getSoftwareBySlug(slug: string): VerifiedProductSeed | undefined {
  return productMap.get(slug.toLowerCase().trim());
}

/**
 * Retrieves software products belonging to a given category slug
 */
export function getSoftwareByCategory(categorySlug: string): VerifiedProductSeed[] {
  const targetCat = categorySlug.toLowerCase().trim();
  return ALL_SOFTWARE_PRODUCTS.filter(
    (p) => p.categorySlug.toLowerCase() === targetCat || p.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetCat
  );
}

/**
 * Resolves a comparison slug pair (e.g. "notion-vs-obsidian") into two verified products
 */
export function getComparePair(slugPair: string): { prodA: VerifiedProductSeed; prodB: VerifiedProductSeed } | null {
  const parts = slugPair.split('-vs-');
  if (parts.length !== 2) return null;

  const prodA = getSoftwareBySlug(parts[0]);
  const prodB = getSoftwareBySlug(parts[1]);

  if (!prodA || !prodB) return null;
  return { prodA, prodB };
}

/**
 * Performs fast search query across names, descriptions, categories, and aliases
 */
export function searchCatalog(query: string, limit = 20): VerifiedProductSeed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return ALL_SOFTWARE_PRODUCTS.filter((p) => {
    const matchName = p.name.toLowerCase().includes(q);
    const matchSlug = p.slug.toLowerCase().includes(q);
    const matchCat = p.categoryName.toLowerCase().includes(q);
    const matchDesc = p.shortDescription.toLowerCase().includes(q);
    const matchAlias = p.aliases.some((a) => a.toLowerCase().includes(q));
    return matchName || matchSlug || matchCat || matchDesc || matchAlias;
  }).slice(0, limit);
}
