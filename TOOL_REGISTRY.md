# Tool Registry

Master list of every tool in this workspace.
Add new tools here when they're set up. Agents check this to know what's available.

| Tool | Type | What It Does | How Auth Works | Status |
|------|------|-------------|---------------|--------|
| GitHub CLI (`gh`) | CLI | Repos, Actions, PRs, code search, clone | `gh auth login` | ⬜ |
| Railway CLI | CLI | Deploy, logs, env vars, status | `railway login` | ⬜ |
| Neon.tech | Cloud DB | Free PostgreSQL hosting | Connection string in .env | ⬜ |
| Git | CLI | Version control | Configured via `git config` | ⬜ |
| Node.js / npm | Runtime | JS/TS packages, scripts | Pre-installed | ⬜ |
| Python3 / pip | Runtime | Python scripts, tooling | Pre-installed | ⬜ |
| Playwright | Library + CLI | Browser automation, visual verify, scraping | `npx playwright install` | ⬜ |
| Figma API | API | Read design files, extract components | API token in .env | ⬜ |
| Notion MCP | MCP | Read/write Notion pages and databases | API token in mcp-config.json | ⬜ |
| GitHub MCP | MCP | Deep GitHub management via MCP | PAT in mcp-config.json | ⬜ |
| Playwright MCP | MCP | Browser automation via MCP protocol | No auth needed | ⬜ |
| Obsidian MCP (mcpvault) | MCP | Long-term memory across all projects and sessions | No auth — just vault path in config | ⬜ |
| Railway MCP (optional) | MCP | Railway management via MCP | Railway token | ⬜ |

## Adding a New Tool
Tell the agent: "Add [tool name] to the workspace"
It will: install it → write a skill file → add auth instructions → register it here
