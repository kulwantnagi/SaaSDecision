const { chromium } = require('@playwright/test');

async function testKitPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Kit Page Light Theme & Brand Colors...\n');

  await page.goto('http://localhost:3000/kits/calendly-kit', { waitUntil: 'networkidle' });
  const content = await page.content();

  const hasTitle = content.includes('Calendly Replacement Kit');
  const hasLightBg = content.includes('bg-white');
  const hasBrandBlue = content.includes('#2b00d9');

  console.log(`Kit Title Rendered: ${hasTitle ? 'YES ✅' : 'NO ❌'}`);
  console.log(`Light Theme Background: ${hasLightBg ? 'YES ✅' : 'NO ❌'}`);
  console.log(`Brand Indigo Color (#2b00d9): ${hasBrandBlue ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testKitPage().catch((err) => {
  console.error(err);
  process.exit(1);
});
