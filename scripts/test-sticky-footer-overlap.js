const { chromium } = require('@playwright/test');

async function testFooterOverlap() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Sticky Recommended VPS Hosting Widget at Footer Scroll...\n');

  await page.goto('http://localhost:3000/software/dokploy', { waitUntil: 'networkidle' });

  // Scroll all the way to the bottom of the page (footer)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const debug = await page.evaluate(() => {
    const widget = document.querySelector('aside.fixed');
    const footer = document.querySelector('footer');
    if (!widget || !footer) return null;

    const wRect = widget.getBoundingClientRect();
    const fRect = footer.getBoundingClientRect();

    const wStyle = window.getComputedStyle(widget);
    const fStyle = window.getComputedStyle(footer);

    return {
      widgetZIndex: wStyle.zIndex,
      footerZIndex: fStyle.zIndex,
      widgetTop: wRect.top,
      widgetBottom: wRect.bottom,
      footerTop: fRect.top,
      windowHeight: window.innerHeight,
    };
  });

  console.log('Viewport Debug Output at Bottom of Page:\n', debug);

  const isVisibleAboveFooter = debug && parseInt(debug.widgetZIndex) > parseInt(debug.footerZIndex) && debug.widgetBottom <= debug.windowHeight;
  console.log(`\nSticky Widget Floats Completely ABOVE Footer (z-index ${debug.widgetZIndex} > ${debug.footerZIndex}): ${isVisibleAboveFooter ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testFooterOverlap().catch((err) => {
  console.error(err);
  process.exit(1);
});
