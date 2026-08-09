const { chromium } = require('@playwright/test');

async function testSidebarWidgetSticky() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Sticky Recommended VPS Hosting Sidebar Card on Scroll...\n');

  await page.goto('http://localhost:3000/software/dokploy', { waitUntil: 'networkidle' });

  // Scroll down 2500px
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(500);

  const rect = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return null;
    const card = Array.from(aside.querySelectorAll('h4')).find(h => h.textContent.includes('Recommended Hosting to Deploy Open-Source Models'))?.closest('.lg\\:sticky');
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, height: r.height, windowHeight: window.innerHeight };
  });

  console.log('Sticky VPS Sidebar Card Rect after 2500px scroll:', rect);

  const isStickyInViewport = rect && rect.top >= 0 && rect.bottom <= rect.windowHeight;
  console.log(`\nVPS Hosting Card Sticky & Locked in Viewport on Scroll: ${isStickyInViewport ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testSidebarWidgetSticky().catch((err) => {
  console.error(err);
  process.exit(1);
});
