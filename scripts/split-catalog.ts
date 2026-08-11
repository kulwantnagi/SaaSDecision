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

function splitCatalog() {
  if (!fs.existsSync(PUBLIC_CATALOG_PATH)) {
    console.error('Error: public/catalog.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(PUBLIC_CATALOG_PATH, 'utf-8');
  const catalog: Product[] = JSON.parse(raw);

  console.log(`Splitting ${catalog.length} items from public/catalog.json into modular files...`);

  // Ensure target directory exists
  if (!fs.existsSync(SRC_CATALOG_DIR)) {
    fs.mkdirSync(SRC_CATALOG_DIR, { recursive: true });
  }

  let count = 0;
  for (const prod of catalog) {
    if (!prod.slug) continue;

    // Use categorySlug or fallback folder
    const catFolder = (prod.categorySlug || 'general').toLowerCase().trim();
    const folderPath = path.join(SRC_CATALOG_DIR, catFolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, `${prod.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(prod, null, 2), 'utf-8');
    count++;
  }

  console.log(`Successfully split ${count} software tools into ${SRC_CATALOG_DIR}!`);
}

splitCatalog();
