import fs from 'fs';
import path from 'path';

interface Product {
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  [key: string]: any;
}

const PUBLIC_CATALOG_PATH = path.join(process.cwd(), 'public', 'catalog.json');
const SRC_CATALOG_DIR = path.join(process.cwd(), 'src', 'data', 'catalog');

function compileCatalog() {
  if (!fs.existsSync(SRC_CATALOG_DIR)) {
    console.error(`Error: Catalog source directory ${SRC_CATALOG_DIR} does not exist.`);
    process.exit(1);
  }

  const allProducts: Product[] = [];
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
          }
        } catch (err) {
          console.error(`Error reading ${filePath}:`, err);
        }
      }
    }
  }

  // Sort alphabetically by product name for consistent output
  allProducts.sort((a, b) => a.name.localeCompare(b.name));

  // Write out public/catalog.json
  fs.writeFileSync(PUBLIC_CATALOG_PATH, JSON.stringify(allProducts, null, 2), 'utf-8');
  console.log(`Successfully compiled ${allProducts.length} software tools into ${PUBLIC_CATALOG_PATH}`);
}

compileCatalog();
