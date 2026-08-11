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
}

compileCatalog();
