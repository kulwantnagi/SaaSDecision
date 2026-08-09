const { chromium } = require('@playwright/test');
const path = require('path');

const ARTIFACT_DIR = '/Users/kulwantnagi/.gemini/antigravity-ide/brain/da49532b-1c87-462e-aea1-8205d060c10a';

async function checkMobileOverflow() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'iphone-se', title: 'iPhone SE (375x667)', width: 375, height: 667 },
    { name: 'iphone-13', title: 'iPhone 13 (390x844)', width: 390, height: 844 },
    { name: 'ipad-mini', title: 'iPad Mini (768x1024)', width: 768, height: 1024 },
  ];

  console.log('Running Playwright Mobile & Tablet Responsiveness Audit with Screenshots...\n');

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/software/superx', { waitUntil: 'networkidle' });

    const screenshotPath = path.join(ARTIFACT_DIR, `mobile-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const overflowInfo = await page.evaluate(() => {
      const windowWidth = window.innerWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowingElements = [];

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > windowWidth + 1) {
          overflowingElements.push({
            tagName: el.tagName,
            className: el.className ? el.className.toString().substring(0, 100) : '',
            rectRight: Math.round(rect.right),
            overflowAmount: Math.round(rect.right - windowWidth),
          });
        }
      }

      return {
        hasOverflow: scrollWidth > windowWidth,
        scrollWidth,
        windowWidth,
        overflowingElements,
      };
    });

    console.log(`=== ${vp.title} ===`);
    console.log(`Window Width: ${overflowInfo.windowWidth}px | Scroll Width: ${overflowInfo.scrollWidth}px`);
    console.log(`Has Horizontal Overflow: ${overflowInfo.hasOverflow ? 'YES ❌' : 'NO ✅'}`);
    console.log(`Saved screenshot: ${screenshotPath}\n`);

    await page.close();
  }

  await browser.close();
}

checkMobileOverflow().catch((err) => {
  console.error('Playwright Error:', err);
  process.exit(1);
});
