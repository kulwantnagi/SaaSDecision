import fs from 'fs';
import path from 'path';

interface Product {
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  shortDescription: string;
  summary: string;
  aliases?: string[];
  openSourceAlternatives?: Array<any>;
  [key: string]: any;
}

interface SearchIndexItem {
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  shortDescription: string;
  aliases: string[];
  openSourceCount: number;
}

const PUBLIC_CATALOG_PATH = path.join(process.cwd(), 'public', 'catalog.json');
const PUBLIC_SEARCH_INDEX_PATH = path.join(process.cwd(), 'public', 'search-index.json');
const OG_SCORES_PATH = path.join(process.cwd(), 'src', 'data', 'og-scores.json');
const SRC_CATALOG_DIR = path.join(process.cwd(), 'src', 'data', 'catalog');

function compileCatalog() {
  if (!fs.existsSync(SRC_CATALOG_DIR)) {
    console.error(`Error: Catalog source directory ${SRC_CATALOG_DIR} does not exist.`);
    process.exit(1);
  }

  const allProducts: Product[] = [];
  const searchIndex: SearchIndexItem[] = [];
  const categories = fs.readdirSync(SRC_CATALOG_DIR);

  for (const catFolder of categories) {
    const catFolderPath = path.join(SRC_CATALOG_DIR, catFolder);
    if (!fs.statSync(catFolderPath).isDirectory()) continue;

    const files = fs.readdirSync(catFolderPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(catFolderPath, file);
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const item: Product = JSON.parse(raw);
          if (item && item.slug) {
            allProducts.push(item);
            
            // Build lightweight search index entry (~60KB total vs 2.9MB)
            searchIndex.push({
              name: item.name,
              slug: item.slug,
              categoryName: item.categoryName || 'General',
              categorySlug: item.categorySlug || 'general',
              shortDescription: item.shortDescription || item.summary || '',
              aliases: Array.isArray(item.aliases) ? item.aliases : [],
              openSourceCount: Array.isArray(item.openSourceAlternatives) ? item.openSourceAlternatives.length : 0,
            });
          }
        } catch (err) {
          console.error(`Error reading ${filePath}:`, err);
        }
      }
    }
  }

  // Sort alphabetically by product name for consistent output
  allProducts.sort((a, b) => a.name.localeCompare(b.name));
  searchIndex.sort((a, b) => a.name.localeCompare(b.name));

  // Write out public/catalog.json
  fs.writeFileSync(PUBLIC_CATALOG_PATH, JSON.stringify(allProducts, null, 2), 'utf-8');
  console.log(`Successfully compiled ${allProducts.length} full software tools into ${PUBLIC_CATALOG_PATH}`);

  // Write out minified public/search-index.json
  fs.writeFileSync(PUBLIC_SEARCH_INDEX_PATH, JSON.stringify(searchIndex), 'utf-8');
  console.log(`Successfully generated lightweight search index in ${PUBLIC_SEARCH_INDEX_PATH}`);

  // Precompute OG image scores so the edge function (api/og) doesn't bundle the 2.9MB catalog.
  // Mirrors catalog-service.ts: hand-tuned seed products override catalog entries.
  const { evaluateSoftware } = require('../src/domain/decision-engine');
  const { INITIAL_25_PRODUCTS } = require('../src/domain/seed-data');
  const merged = new Map<string, Product>();
  for (const prod of allProducts) merged.set(prod.slug, prod);
  for (const prod of INITIAL_25_PRODUCTS as Product[]) merged.set(prod.slug, prod);

  const ogScores: Record<string, [string, string, number, number, number, number, number]> = {};
  let ogSkipped = 0;
  for (const prod of merged.values()) {
    try {
      const r = evaluateSoftware(prod.assessment);
      ogScores[prod.slug] = [
        prod.name,
        prod.categoryName || 'General',
        r.keepScore, r.switchScore, r.selfHostScore, r.automateScore, r.buildScore,
      ];
    } catch {
      ogSkipped++;
    }
  }
  fs.writeFileSync(OG_SCORES_PATH, JSON.stringify(ogScores), 'utf-8');
  console.log(`Successfully precomputed OG scores for ${Object.keys(ogScores).length} tools into ${OG_SCORES_PATH}${ogSkipped ? ` (${ogSkipped} skipped: no valid assessment)` : ''}`);
}

compileCatalog();
