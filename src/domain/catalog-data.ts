import { VerifiedProductSeed } from './seed-data';
// Catalog data is stored as a static JSON asset to keep the Worker bundle small.
// The JSON is imported at build time by Next.js (resolveJsonModule: true).
import catalogJson from '../../public/catalog.json';

export const CATALOG_PRODUCTS: VerifiedProductSeed[] = catalogJson as VerifiedProductSeed[];
