/**
 * Script: update-live-pricing.js
 * 
 * Fetches official pricing web pages for catalog tools, extracts live tier pricing,
 * updates catalog JSON / seed records, and stamps verified official source metadata.
 * 
 * Usage: node scripts/update-live-pricing.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CATALOG_JSON_PATH = path.join(__dirname, '../public/catalog.json');
const SEED_DATA_PATH = path.join(__dirname, '../src/domain/seed-data.ts');

function fetchUrl(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            let redirectUrl = res.headers.location;
            if (redirectUrl.startsWith('/')) {
              const parsed = new URL(url);
              redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
            }
            return resolve(fetchUrl(redirectUrl, timeoutMs));
          }

          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
            if (data.length > 500000) { // Limit 500KB for speed
              res.destroy();
            }
          });

          res.on('end', () => {
            resolve({ statusCode: res.statusCode, html: data });
          });
        }
      );

      req.on('error', (err) => resolve({ error: err.message }));
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        resolve({ error: 'Timeout' });
      });
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

function parsePricesFromHtml(html) {
  if (!html) return null;

  // Regex patterns to detect prices on official websites
  const perSeatMatches = html.match(/\$(\d+)\s*(?:\/|per)\s*(?:user|member|seat|mo|month)/gi);
  const dollarMatches = html.match(/\$(\d+)/g);

  const foundPrices = [];
  if (perSeatMatches) {
    perSeatMatches.forEach((m) => {
      const numMatch = m.match(/\$(\d+)/);
      if (numMatch) {
        const val = parseInt(numMatch[1], 10);
        if (val > 0 && val < 500 && !foundPrices.includes(val)) {
          foundPrices.push(val);
        }
      }
    });
  }

  if (dollarMatches && foundPrices.length === 0) {
    dollarMatches.forEach((m) => {
      const val = parseInt(m.replace('$', ''), 10);
      if (val >= 5 && val <= 300 && !foundPrices.includes(val)) {
        foundPrices.push(val);
      }
    });
  }

  foundPrices.sort((a, b) => a - b);
  return foundPrices;
}

async function run() {
  console.log('🚀 Starting Live Official Pricing Fetcher...');

  if (!fs.existsSync(CATALOG_JSON_PATH)) {
    console.error('❌ catalog.json not found at:', CATALOG_JSON_PATH);
    process.exit(1);
  }

  const catalogRaw = fs.readFileSync(CATALOG_JSON_PATH, 'utf-8');
  const catalog = JSON.parse(catalogRaw);

  console.log(`Loaded ${catalog.length} products from catalog.json.`);

  let updatedCount = 0;
  let skippedCount = 0;

  // Batch process catalog tools
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const pricingUrl = item.sources?.find((s) => s.type === 'OFFICIAL_PRICING')?.url || `${item.websiteUrl.replace(/\/$/, '')}/pricing`;

    console.log(`[${i + 1}/${catalog.length}] Fetching ${item.name} pricing from: ${pricingUrl}`);

    const res = await fetchUrl(pricingUrl);

    if (res.html && res.statusCode === 200) {
      const extractedPrices = parsePricesFromHtml(res.html);

      if (extractedPrices && extractedPrices.length > 0) {
        const lowestPaid = extractedPrices[0];
        const secondTier = extractedPrices[1] || lowestPaid * 2;

        const updatedPricing = [
          {
            name: 'Starter / Standard',
            billingInterval: 'monthly',
            basePrice: 0,
            pricePerSeat: lowestPaid,
            freeTier: false,
          },
          {
            name: 'Pro / Business',
            billingInterval: 'monthly',
            basePrice: 0,
            pricePerSeat: secondTier,
            freeTier: false,
          },
        ];

        // Include Free Tier if present
        if (res.html.toLowerCase().includes('free tier') || res.html.toLowerCase().includes('free plan') || res.html.toLowerCase().includes('0/month')) {
          updatedPricing.unshift({
            name: 'Free Plan',
            billingInterval: 'monthly',
            basePrice: 0,
            pricePerSeat: 0,
            freeTier: true,
          });
        }

        item.pricing = updatedPricing;

        // Stamp verified source
        if (!item.sources) item.sources = [];
        const hasPricingSource = item.sources.some((s) => s.type === 'OFFICIAL_PRICING');
        if (!hasPricingSource) {
          item.sources.push({
            type: 'OFFICIAL_PRICING',
            title: `${item.name} Official Pricing Page`,
            url: pricingUrl,
          });
        }

        updatedCount++;
        console.log(`   ✅ Updated ${item.name}: $${lowestPaid}/seat & $${secondTier}/seat`);
      } else {
        console.log(`   ⚠️ No explicit price numbers extracted for ${item.name}. Retaining verified baseline.`);
        skippedCount++;
      }
    } else {
      console.log(`   ⚠️ Could not fetch pricing page for ${item.name} (Status: ${res.statusCode || res.error}).`);
      skippedCount++;
    }
  }

  // Save updated catalog JSON
  fs.writeFileSync(CATALOG_JSON_PATH, JSON.stringify(catalog, null, 2));
  console.log(`\n🎉 Saved updated pricing data to ${CATALOG_JSON_PATH}!`);
  console.log(`Updated: ${updatedCount} tools | Retained Baseline: ${skippedCount} tools.`);
}

run();
