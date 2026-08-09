const { chromium } = require('@playwright/test');

async function testVercelAlternatives() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:3000/software/vercel', { waitUntil: 'networkidle' });
  const content = await page.content();

  const hasDokploy = content.includes('Dokploy') && content.includes('https://github.com/Dokploy/dokploy');
  const hasOpenship = content.includes('Openship') && content.includes('https://github.com/openship-org/openship');

  console.log(`Dokploy listed as Vercel OSS Alternative: ${hasDokploy ? 'YES ✅' : 'NO ❌'}`);
  console.log(`Openship listed as Vercel OSS Alternative: ${hasOpenship ? 'YES ✅' : 'NO ❌'}`);

  await browser.close();
}

testVercelAlternatives().catch((err) => {
  console.error(err);
  process.exit(1);
});
