const { chromium } = require('@playwright/test');

async function testAdminAuth() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Testing Admin Portal Authentication Flow...\n');

  // Step 1: Navigate to /admin
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  let content = await page.content();
  let isLocked = content.includes('Admin Authentication');
  console.log(`1. Navigate to /admin - Page is Locked with Auth Modal: ${isLocked ? 'YES ✅' : 'NO ❌'}`);

  // Step 2: Test Invalid Password
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  content = await page.content();
  let hasError = content.includes('Invalid username or password');
  console.log(`2. Submit Invalid Password - Displays Error Message: ${hasError ? 'YES ✅' : 'NO ❌'}`);

  // Step 3: Test Valid Credentials
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'saasdecision2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  content = await page.content();
  let isUnlocked = content.includes('Admin Operations Portal');
  console.log(`3. Submit Valid Credentials (admin / saasdecision2026) - Unlocks Admin Portal: ${isUnlocked ? 'YES ✅' : 'NO ❌'}`);

  // Step 4: Test Logout
  await page.click('button:has-text("Log Out Admin")');
  await page.waitForTimeout(1000);
  content = await page.content();
  let isLockedAgain = content.includes('Admin Authentication');
  console.log(`4. Click Log Out Admin - Locks Portal Again: ${isLockedAgain ? 'YES ✅' : 'NO ❌'}\n`);

  await browser.close();
}

testAdminAuth().catch((err) => {
  console.error('Admin Auth Test Error:', err);
  process.exit(1);
});
