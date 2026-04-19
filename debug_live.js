const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('--- CHECKING LIVE DEPLOYMENT ---');
  
  // Log all console messages and network errors
  page.on('console', msg => console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text()));
  page.on('requestfailed', request => console.log('NETWORK ERROR:', request.url(), request.failure().errorText));

  try {
    const response = await page.goto('https://glambyolaitan.pages.dev/', { waitUntil: 'networkidle' });
    console.log('HTTP Status:', response.status());
    
    await page.screenshot({ path: 'live_debug_capture.png' });
    console.log('📸 Live capture saved as live_debug_capture.png');

    const content = await page.content();
    console.log('Page Title:', await page.title());
    console.log('Body length:', content.length);

  } catch (err) {
    console.error('❌ Browser Error:', err.message);
  }

  await browser.close();
})();
