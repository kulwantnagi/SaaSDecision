import { INITIAL_25_PRODUCTS, VerifiedProductSeed } from './seed-data';
export type { VerifiedProductSeed };
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

// Pre-indexed Map by category slug for O(1) lookups
const categoryMap = new Map<string, VerifiedProductSeed[]>();
for (const prod of ALL_SOFTWARE_PRODUCTS) {
  const catSlug = (prod.categorySlug || '').toLowerCase().trim();
  const catNameSlug = (prod.categoryName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  if (catSlug) {
    if (!categoryMap.has(catSlug)) categoryMap.set(catSlug, []);
    categoryMap.get(catSlug)!.push(prod);
  }
  if (catNameSlug && catNameSlug !== catSlug) {
    if (!categoryMap.has(catNameSlug)) categoryMap.set(catNameSlug, []);
    categoryMap.get(catNameSlug)!.push(prod);
  }
}

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
 * Retrieves software products belonging to a given category slug in O(1) time
 */
export function getSoftwareByCategory(categorySlug: string): VerifiedProductSeed[] {
  const targetCat = categorySlug.toLowerCase().trim();
  return categoryMap.get(targetCat) || [];
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
    if (!p) return false;
    const matchName = p.name ? p.name.toLowerCase().includes(q) : false;
    const matchSlug = p.slug ? p.slug.toLowerCase().includes(q) : false;
    const matchCat = p.categoryName ? p.categoryName.toLowerCase().includes(q) : false;
    const matchDesc = p.shortDescription ? p.shortDescription.toLowerCase().includes(q) : false;
    const matchSummary = p.summary ? p.summary.toLowerCase().includes(q) : false;
    const matchAlias = Array.isArray(p.aliases) ? p.aliases.some((a) => typeof a === 'string' && a.toLowerCase().includes(q)) : false;
    return matchName || matchSlug || matchCat || matchDesc || matchSummary || matchAlias;
  }).slice(0, limit);
}

/**
 * Retrieves related software products based on category, excluding specified product slugs
 */
export function getRelatedSoftwareByCategory(
  categorySlug: string,
  categoryName?: string,
  excludeSlugs: string[] = [],
  limit = 6
): VerifiedProductSeed[] {
  const targetCatSlug = (categorySlug || '').toLowerCase().trim();
  const targetCatName = (categoryName || '').toLowerCase().trim();
  const targetCatNameSlug = targetCatName.replace(/[^a-z0-9]+/g, '-');
  const excludeSet = new Set(excludeSlugs.map((s) => s.toLowerCase().trim()));

  // 1. Filter products matching categorySlug or categoryName
  const directMatches = ALL_SOFTWARE_PRODUCTS.filter((p) => {
    if (!p || excludeSet.has(p.slug.toLowerCase())) return false;
    const pCatSlug = (p.categorySlug || '').toLowerCase();
    const pCatName = (p.categoryName || '').toLowerCase();
    const pCatNameSlug = pCatName.replace(/[^a-z0-9]+/g, '-');

    return (
      (targetCatSlug && pCatSlug === targetCatSlug) ||
      (targetCatName && pCatName === targetCatName) ||
      (targetCatNameSlug && pCatNameSlug === targetCatNameSlug)
    );
  });

  if (directMatches.length >= limit) {
    return directMatches.slice(0, limit);
  }

  // 2. Secondary search for partial category keyword matches
  const addedSlugs = new Set(directMatches.map((p) => p.slug));
  const keywordMatches = ALL_SOFTWARE_PRODUCTS.filter((p) => {
    if (!p || excludeSet.has(p.slug.toLowerCase()) || addedSlugs.has(p.slug)) return false;
    const pCatName = (p.categoryName || '').toLowerCase();
    const pCatSlug = (p.categorySlug || '').toLowerCase();
    return (
      (targetCatName && (pCatName.includes(targetCatName) || targetCatName.includes(pCatName))) ||
      (targetCatSlug && (pCatSlug.includes(targetCatSlug) || targetCatSlug.includes(pCatSlug)))
    );
  });

  const combined = [...directMatches, ...keywordMatches];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // 3. Fallback to top catalog products to guarantee complete list
  for (const p of ALL_SOFTWARE_PRODUCTS) {
    if (combined.length >= limit) break;
    if (!excludeSet.has(p.slug.toLowerCase()) && !combined.some((item) => item.slug === p.slug)) {
      combined.push(p);
    }
  }

  return combined.slice(0, limit);
}

export interface AppProsCons {
  pros: string[];
  cons: string[];
}

/**
 * Computes highly specific Pros and Cons for a given software product based on its traits, summary, category, pricing, and decision assessment scores.
 */
export function getSoftwareProsAndCons(prod: VerifiedProductSeed): AppProsCons {
  if (Array.isArray(prod.pros) && prod.pros.length >= 3 && Array.isArray(prod.cons) && prod.cons.length >= 3) {
    return { pros: prod.pros.slice(0, 3), cons: prod.cons.slice(0, 3) };
  }

  const name = prod.name || 'Software';
  const category = prod.categoryName || 'SaaS Solution';
  const a = prod.assessment || {};
  const pricing = prod.pricing || [];
  const starter = pricing[0];
  const hasFreeTier = pricing.some((p) => p.freeTier || p.basePrice === 0);
  const basePrice = starter ? (starter.freeTier ? 0 : starter.basePrice) : 0;
  const perSeatPrice = starter?.pricePerSeat ?? 0;
  const ossAlts = prod.openSourceAlternatives || [];
  const topOSS = ossAlts[0]?.name;

  const pros: string[] = [];
  const cons: string[] = [];

  // --- SPECIFIC PROS ---
  // 1. Core Value / Functionality
  if (prod.summary && prod.summary.length > 20) {
    let text = prod.summary.trim();
    if (!text.endsWith('.')) text += '.';
    pros.push(text);
  } else if (prod.shortDescription && prod.shortDescription.length > 15) {
    let text = prod.shortDescription.trim();
    if (!text.endsWith('.')) text += '.';
    pros.push(text);
  } else {
    pros.push(`Specialized ${category} platform designed to boost operational productivity and streamline team workflows.`);
  }

  // 2. Technical Capabilities & Integrations
  if (a.apiAvailability && a.apiAvailability >= 4) {
    pros.push(`High API accessibility (${a.apiAvailability}/5 score) supporting programmatic automation, custom webhooks, and third-party integrations.`);
  } else if (a.openSourceMaturity && a.openSourceMaturity >= 4 && topOSS) {
    pros.push(`Strong open-source ecosystem with mature self-hostable replacements like ${topOSS} available.`);
  } else if (a.dataPortability && a.dataPortability >= 4) {
    pros.push(`Excellent data portability (${a.dataPortability}/5 score) allowing seamless data export and low lock-in risk.`);
  } else if (a.realtimeCollaboration && a.realtimeCollaboration >= 4) {
    pros.push(`Real-time multi-user collaboration (${a.realtimeCollaboration}/5 score) built for synchronized team operations.`);
  } else {
    pros.push(`Proven reliability and core feature set matching modern enterprise standard benchmarks in ${category}.`);
  }

  // 3. Pricing / Community / Setup
  if (hasFreeTier) {
    pros.push(`Generous free plan tier available, enabling zero-risk onboarding and evaluation for ${name}.`);
  } else if (basePrice > 0) {
    pros.push(`Transparent tier pricing starting from $${basePrice}/mo with scalable feature packages.`);
  } else if (topOSS) {
    pros.push(`Complemented by verified self-hosted replacement ${topOSS} to eliminate recurring subscription fees.`);
  } else {
    pros.push(`Straightforward setup process with minimal initial deployment overhead for ${category} teams.`);
  }

  // --- SPECIFIC CONS ---
  // 1. Pricing / Seat Scaling
  if (!hasFreeTier && basePrice > 0) {
    cons.push(`No permanent free tier available; commercial plans for ${name} start at $${basePrice}/mo.`);
  } else if (perSeatPrice > 0) {
    cons.push(`Per-seat billing ($${perSeatPrice}/user/mo) can significantly inflate monthly spend as team size scales.`);
  } else if (a.vendorLockIn && a.vendorLockIn >= 4) {
    cons.push(`High vendor lock-in risk (${a.vendorLockIn}/5 score) due to proprietary data formats in ${name}.`);
  } else {
    cons.push(`Unused tier features may pad monthly billing if team requirements are minimal.`);
  }

  // 2. Lock-in & Migration Complexity
  if (a.migrationComplexity && a.migrationComplexity >= 4) {
    cons.push(`High migration complexity (${a.migrationComplexity}/5 score) when transitioning workflows away from ${name}.`);
  } else if (a.vendorLockIn && a.vendorLockIn >= 3 && !cons.some((c) => c.includes('vendor lock-in'))) {
    cons.push(`Moderate lock-in accumulates over time as historical data and custom configurations build within ${name}.`);
  } else if (a.infrastructureComplexity && a.infrastructureComplexity >= 4) {
    cons.push(`High infrastructure complexity (${a.infrastructureComplexity}/5 score) for complex enterprise deployments.`);
  } else {
    cons.push(`Custom administrative controls and governance require higher-tier enterprise subscriptions.`);
  }

  // 3. API & Customization Limitations
  if (a.apiAvailability && a.apiAvailability <= 2) {
    cons.push(`Restricted public API coverage (${a.apiAvailability}/5 score) limiting custom external integrations.`);
  } else if (a.buildComplexity && a.buildComplexity >= 4) {
    cons.push(`High internal build complexity (${a.buildComplexity}/5 score) makes building a custom replacement resource-intensive.`);
  } else {
    cons.push(`Advanced customization options may require third-party middleware or dedicated developer setup.`);
  }

  return {
    pros: pros.slice(0, 3),
    cons: cons.slice(0, 3),
  };
}

export interface DecisionTriggers {
  keepTriggers: string[];
  switchTriggers: string[];
}

/**
 * Generates deterministic "When to Keep" vs. "When to Switch" decision triggers
 */
export function getDecisionTriggers(prod: VerifiedProductSeed): DecisionTriggers {
  const name = prod.name || 'Software';
  const a = prod.assessment || {};
  const pricing = prod.pricing || [];
  const starter = pricing[0];
  const hasFreeTier = pricing.some((p) => p.freeTier || p.basePrice === 0);
  const basePrice = starter ? (starter.freeTier ? 0 : starter.basePrice) : 0;
  const perSeatPrice = starter?.pricePerSeat ?? 0;
  const topOSS = prod.openSourceAlternatives?.[0]?.name;
  const topComm = prod.verifiedCommercialAlternatives?.[0]?.name;

  const keepTriggers: string[] = [];
  const switchTriggers: string[] = [];

  // --- KEEP TRIGGERS ---
  if (a.integrationDependency && a.integrationDependency >= 4) {
    keepTriggers.push(`Deep Integration Mesh: Your operational workflows rely heavily on ${name}'s webhooks, APIs, or native ecosystem.`);
  } else {
    keepTriggers.push(`Core Workflow Reliance: Your team's day-to-day productivity depends on ${name}'s specific UI or proprietary features.`);
  }

  if (a.realtimeCollaboration && a.realtimeCollaboration >= 4) {
    keepTriggers.push(`Real-time Multi-User Sync: Multiple team members collaborate simultaneously with minimal latency in ${name}.`);
  } else if (hasFreeTier) {
    keepTriggers.push(`Zero Overhead: You are operating within ${name}'s permanent free tier with no immediate need for premium add-ons.`);
  } else {
    keepTriggers.push(`Managed SLA & Support: You prefer dedicated cloud availability and vendor compliance support over self-managed servers.`);
  }

  if (a.migrationComplexity && a.migrationComplexity >= 4) {
    keepTriggers.push(`High Migration Friction: Extracting historical data, permissions, and custom settings would cause significant business downtime.`);
  } else {
    keepTriggers.push(`Minimal Admin Burden: Your engineering team lacks dedicated DevOps bandwidth to maintain and patch self-hosted infrastructure.`);
  }

  // --- SWITCH TRIGGERS ---
  if (perSeatPrice > 0 || basePrice >= 50) {
    switchTriggers.push(`Escalating Subscription Costs: Per-seat billing (${perSeatPrice > 0 ? `$${perSeatPrice}/user/mo` : `$${basePrice}/mo`}) is inflating annual spend beyond budget limits.`);
  } else if (topComm) {
    switchTriggers.push(`Superior Feature Parity Elsewhere: Alternative commercial platforms like ${topComm} offer better value or higher seat limits.`);
  } else {
    switchTriggers.push(`Underutilized Tier Limits: You are paying for top-tier features while only utilizing basic core capabilities.`);
  }

  if (topOSS) {
    switchTriggers.push(`Open-Source Self-Host Viability: Mature self-hosted replacements like ${topOSS} can eliminate recurring vendor fees entirely.`);
  } else if (a.dataPortability && a.dataPortability >= 4) {
    switchTriggers.push(`High Data Portability: ${name} supports clean data exports (JSON/CSV), making migration to lower-cost platforms fast and risk-free.`);
  } else {
    switchTriggers.push(`Data Sovereignty Needs: Strict GDPR, HIPAA, or local data privacy compliance requires hosting data on private cloud infrastructure.`);
  }

  if (a.vendorLockIn && a.vendorLockIn >= 4) {
    switchTriggers.push(`Vendor Lock-In Avoidance: You want to prevent long-term lock-in before your proprietary configuration becomes too complex to extract.`);
  } else {
    switchTriggers.push(`Limited Public API: Restricted API access is blocking automated cross-platform workflows and custom integrations.`);
  }

  return {
    keepTriggers: keepTriggers.slice(0, 3),
    switchTriggers: switchTriggers.slice(0, 3),
  };
}

const KNOWN_DOMAINS: Record<string, string> = {
  'claude': 'https://claude.ai',
  'openart': 'https://openart.ai',
  'screen-studio': 'https://screen.studio',
  'n8n': 'https://n8n.io',
  'n8n-cloud': 'https://n8n.io',
  'tally': 'https://tally.so',
  'tally-so': 'https://tally.so',
  'bento': 'https://bento.me',
  'bento-me': 'https://bento.me',
  'fathom': 'https://usefathom.com',
  'fathom-analytics': 'https://usefathom.com',
  'simple-analytics': 'https://simpleanalytics.com',
  'plausible': 'https://plausible.io',
  'umami': 'https://umami.is',
  'umami-cloud': 'https://umami.is',
  'obsidian': 'https://obsidian.md',
  'obsidian-sync': 'https://obsidian.md',
  'wispr-flow': 'https://wisprflow.ai',
  'linktree': 'https://linktr.ee',
  'linktree-pro': 'https://linktr.ee',
  'testimonial-to': 'https://testimonial.to',
  'testimonial': 'https://testimonial.to',
  'screaming-frog-seo-spider': 'https://www.screamingfrog.co.uk/seo-spider/',
  'screaming-frog': 'https://www.screamingfrog.co.uk',
  'quickbooks': 'https://quickbooks.intuit.com',
  'quickbooks-online': 'https://quickbooks.intuit.com',
  'gojiberry-ai': 'https://gojiberry.ai',
  'cronitor': 'https://cronitor.io',
  'factorial': 'https://factorialhr.com',
  'cal-com': 'https://cal.com',
  'dub': 'https://dub.co',
  'dub-co': 'https://dub.co',
  'linear': 'https://linear.app',
  'arc': 'https://arc.net',
  'midjourney': 'https://midjourney.com',
  'leonardo-ai': 'https://leonardo.ai',
  'elevenlabs': 'https://elevenlabs.io',
  'sentry': 'https://sentry.io',
  'datadog': 'https://datadoghq.com',
  'instantly': 'https://instantly.ai',
  'smartlead': 'https://smartlead.ai',
  'apollo': 'https://apollo.io',
  'apollo-io': 'https://apollo.io',
  'hunter': 'https://hunter.io',
  'hunter-io': 'https://hunter.io',
  'formbricks': 'https://formbricks.com',
  'appflowy': 'https://appflowy.io',
  'affine': 'https://affine.pro',
  'lovable': 'https://lovable.dev',
  'superwhisper': 'https://superwhisper.com',
  'postiz': 'https://postiz.com',
  'senja': 'https://senja.io',
  'feedhive': 'https://feedhive.com',
  'teleminute': 'https://teleminute.com',
  'invoice-ninja': 'https://invoiceninja.com',
  'typefully': 'https://typefully.com',
  'datafast': 'https://datafast.io',
  'dokploy': 'https://dokploy.com',
  'coolify': 'https://coolify.io',
  'hetzner': 'https://hetzner.com',
  'digitalocean': 'https://digitalocean.com',
  'hostinger': 'https://hostinger.com',
  'raycast': 'https://raycast.com',
  'lemlist': 'https://lemlist.com',
  'waalaxy': 'https://waalaxy.com',
  'phantombuster': 'https://phantombuster.com',
  'clay': 'https://clay.com',
  'acuity': 'https://acuityscheduling.com',
  'firebase': 'https://firebase.google.com',
  'mixpanel': 'https://mixpanel.com',
  'jira': 'https://atlassian.com/software/jira',
};

/**
 * Resolves the verified official website URL for a given software product.
 */
export function getVerifiedWebsiteUrl(prod: VerifiedProductSeed): string {
  if (!prod) return 'https://saasdecision.com';

  const slug = (prod.slug || '').toLowerCase().trim();

  // 1. Direct dictionary override
  if (KNOWN_DOMAINS[slug]) {
    return KNOWN_DOMAINS[slug];
  }

  // 2. Official sources array check
  if (Array.isArray(prod.sources)) {
    const officialSource = prod.sources.find((s) => s.type === 'OFFICIAL_WEBSITE');
    if (officialSource && officialSource.url) {
      const u = officialSource.url;
      if (!u.endsWith(`${slug}.com`)) {
        return u;
      }
    }
  }

  // 3. TLD extension detection from slug
  if (slug.endsWith('-ai') || slug.endsWith('-io') || slug.endsWith('-so') || slug.endsWith('-me') || slug.endsWith('-dev') || slug.endsWith('-app')) {
    const parts = slug.split('-');
    const tld = parts[parts.length - 1];
    const base = parts.slice(0, -1).join('');
    return `https://${base}.${tld}`;
  }

  return prod.websiteUrl || `https://${slug}.com`;
}



