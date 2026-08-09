const { chromium } = require('@playwright/test');

async function testStickyScroll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Fixed Sticky Recommended VPS Hosting Widget on Scroll...\n');

  await page.goto('http://localhost:3000/software/dokploy', { waitUntil: 'networkidle' });

  // Scroll down 2000px
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(500);

  const rect = await page.evaluate(() => {
    const widget = document.querySelector('aside.fixed');
    if (!widget) return null;
    const r = widget.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, right: r.right, windowHeight: window.innerHeight };
  });

  console.log('Sticky Widget Viewport Coordinates after 2000px scroll:', rect);

  const isStickyInViewport = rect && rect.top >= 0 && rect.bottom <= rect.windowHeight;
  console.log(`Sticky Widget Present and Lock-in Viewport on Scroll: ${isStickyInViewport ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testStickyScroll().catch((err) => {
  console.error(err);
  process.exit(1);
});
