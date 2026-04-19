# Skill: Deploy to Railway

## What Railway Does
Railway hosts your backend/frontend, runs it 24/7, and connects to GitHub for auto-deploy.
Free trial gives $5 credit. Starter plan is $5/month. Predictable pricing.

## Pre-Deploy Checklist
- [ ] All tests pass locally
- [ ] Environment variables noted (you will set these in Railway, not commit them)
- [ ] A start command exists in package.json or Procfile
- [ ] Code is pushed to GitHub

## Initial Setup (one time per project)
```bash
npm install -g @railway/cli
railway login          # browser auth
railway init           # creates a Railway project, links to current folder
railway link           # if project already exists in Railway dashboard
```

## Set Environment Variables

```bash
railway variables set DATABASE_URL=postgresql://...
railway variables set PORT=3000
railway variables set NODE_ENV=production
# Or set from a .env file (exclude secrets you don't want):
railway variables set < .env
```

## Connect GitHub for Auto-Deploy

1. Go to [https://railway.app](https://railway.app/) → your project → Settings → GitHub
2. Connect your repo
3. Set the branch to deploy (usually `main`)
4. Railway will now auto-deploy every time you push

## Deploy Manually

```bash
railway up   # deploys current code without needing a GitHub push
```

## Monitor GitHub Actions (if you have CI)

```bash
gh run list --limit 5           # see recent runs
gh run watch                    # live watch the current run
gh run view [run-id] --log      # read full logs
gh run view [run-id] --log-failed  # only failed steps
```

## Monitor Railway Deployment

```bash
railway logs --tail    # live streaming logs
railway status         # current deployment status
railway open           # opens your app in browser
```

## Get Your Live URL

```bash
railway domain         # shows the assigned domain
```

## Debugging Loop — Follow This Every Time

1. Check `gh run watch` — did Actions pass?
2. If Actions failed → `gh run view --log-failed` → read the error → fix → push
3. If Actions passed but app is down → `railway logs --tail` → read the error → fix → redeploy
4. If app is up but behaving wrong → use Playwright or curl to test endpoints
5. Fix → push → repeat until fully working
6. Update PROJECT_STATUS.md with ✅ and live URL

## Verify Live App

```bash
curl -I <https://your-app.railway.app>
# Should return HTTP/2 200

# Test a specific endpoint:
curl <https://your-app.railway.app/api/health>
```

## Common Railway Errors and Fixes

| Error | Fix |
| --- | --- |
| “No start command” | Add `"start": "node index.js"` to package.json scripts |
| “Port in use” | Make sure app uses `process.env.PORT`, not a hardcoded port |
| Build fails | Check Node/Python version matches what Railway expects — set in railway.toml |
| Env var missing | `railway variables set KEY=value` |
| App crashes on start | `railway logs --tail` to see the real error |

## railway.toml Example (optional but useful)

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node dist/index.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```
