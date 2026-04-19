# Skill: Browser Automation via MCP

## What This Is
The agent has direct access to a browser through the Playwright MCP server (`@modelcontextprotocol/server-playwright`).
This allows the agent to navigate, click, and interact with web pages directly without user intervention for things like "Verify" buttons.

## When to Use This
- Authenticating services (GitHub, Railway, etc.)
- Scraped data from complex SPAs
- Verifying a live app after deployment
- Interacting with any web UI where a CLI isn't enough

## How It Works
The MCP provides several tools:
- `playwright_navigate`: Go to a URL
- `playwright_click`: Click an element
- `playwright_fill`: Fill an input
- `playwright_screenshot`: Take a screenshot for debugging
- `playwright_evaluate`: Run custom JS in the page

## Example: Automating a Login Link
1. Agent gets a link: `https://railway.app/activate?code=XXXX`
2. Agent calls `playwright_navigate` with the URL.
3. Agent calls `playwright_click` on the "Verify" or "Confirm" button.
4. Done.

## Security
- The browser runs in a separate process.
- No sensitive cookies are shared unless you explicitly log in through this tool.
