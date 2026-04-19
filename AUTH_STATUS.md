# Tool Authentication Status

Update this every time you authenticate or verify a tool.
The next agent reads this to know what's already set up and skip re-doing it.

| Tool | Status | Verify Command | Notes |
|------|--------|---------------|-------|
| GitHub CLI (`gh`) | ⬜ NOT CHECKED | `gh auth status` | |
| Railway CLI | ✅ AUTHENTICATED | `railway whoami` | |
| Neon CLI (optional) | ⬜ NOT CHECKED | `neonctl me` | DB managed via connection string, CLI optional |
| Git | ⬜ NOT CHECKED | `git config user.email` | |
| Playwright | ⬜ NOT CHECKED | `npx playwright --version` | |
| Notion MCP | ⬜ NOT CHECKED | Check mcp-config.json | Needs token |
| GitHub MCP | ⬜ NOT CHECKED | Check mcp-config.json | Needs PAT |
| Obsidian MCP (mcpvault) | ⬜ NOT CHECKED | Ask agent: "List files in my Obsidian vault" | No token needed — just needs vault path set |

## Authentication Instructions

### GitHub CLI
```bash
gh auth login
# Choose: GitHub.com → HTTPS → Login with browser
# Browser opens → authorize → token saved automatically
# Verify: gh auth status
```

### Railway

```bash
npm install -g @railway/cli   # if not installed
railway login
# Browser opens → authorize → session saved
# Verify: railway whoami
```

### Neon (Database — no CLI auth needed for basic use)

```
The database is accessed via a connection string stored in your .env file:
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

Get this from: <https://console.neon.tech> → your project → Connection Details
No CLI login required. Just paste the string into your .env file.
```

### Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
# For GitHub auth via HTTPS, gh auth login handles this automatically
```

### MCP Tools

See .agent/MCP/mcp-setup-guide.md for Notion and GitHub MCP token setup.
