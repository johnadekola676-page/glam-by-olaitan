# Skill: Browser Automation with Playwright

## Install
```bash
npm install playwright
npx playwright install chromium
```

## Verify a Live App After Deployment

```jsx
// scripts/verify-live.js
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto('<https://your-app.railway.app>')
  const title = await page.title()
  console.log('Title:', title)

  const body = await page.textContent('body')
  if (body.includes('expected text')) {
    console.log('✅ App verified and working')
  } else {
    console.log('❌ Content check failed')
    process.exit(1)
  }

  await browser.close()
})()
```

## Bypass Bot Detection

```jsx
const browser = await chromium.launch({
  headless: false,
  args: ['--disable-blink-features=AutomationControlled']
})
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 720 },
  locale: 'en-US'
})
const page = await context.newPage()
```

## Take Screenshots for Debugging

```jsx
await page.screenshot({ path: '/tmp/debug.png', fullPage: true })
```

## Fill Forms and Click Buttons

```jsx
await page.fill('#email', 'test@example.com')
await page.fill('#password', 'securepassword')
await page.click('button[type="submit"]')
await page.waitForURL('**/dashboard')
console.log('Login successful')
```

## Scrape Data From a Page

```jsx
const items = await page.$$eval('.product-card', cards =>
  cards.map(card => ({
    name: card.querySelector('.name').textContent,
    price: card.querySelector('.price').textContent
  }))
)
console.log(items)
```

## Test an API Endpoint Visually

```jsx
const response = await page.evaluate(async () => {
  const res = await fetch('/api/health')
  return res.json()
})
console.log(response)
```
