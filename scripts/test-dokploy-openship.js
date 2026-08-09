const { chromium } = require('@playwright/test');

async function testDokployAndOpenshipPages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Dokploy and Openship Pages + Sidebar Recommended Hosting Widget...\n');

  // Test 1: Dokploy Page
  await page.goto('http://localhost:3000/software/dokploy', { waitUntil: 'networkidle' });
  let content = await page.content();
  let hasDokployTitle = content.includes('Dokploy');
  let hasDokployWidget = content.includes('Recommended VPS Hosting') && content.includes('Hostinger VPS');
  console.log(`1. /software/dokploy Page Title & Content Loaded: ${hasDokployTitle ? 'YES ✅' : 'NO ❌'}`);
  console.log(`   Sidebar Recommended Hosting Widget Present: ${hasDokployWidget ? 'YES ✅' : 'NO ❌'}`);

  // Test 2: Openship Page
  await page.goto('http://localhost:3000/software/openship', { waitUntil: 'networkidle' });
  content = await page.content();
  let hasOpenshipTitle = content.includes('Openship');
  let hasOpenshipWidget = content.includes('Recommended VPS Hosting') && content.includes('DigitalOcean');
  console.log(`2. /software/openship Page Title & Content Loaded: ${hasOpenshipTitle ? 'YES ✅' : 'NO ❌'}`);
  console.log(`   Sidebar Recommended Hosting Widget Present: ${hasOpenshipWidget ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testDokployAndOpenshipPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
