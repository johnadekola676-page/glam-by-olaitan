# MCP Tool Setup Guide

MCP tools extend what the agent can do beyond basic CLI commands.
Each one needs a token. Here's exactly where to get each one.

## GitHub MCP
Allows deeper GitHub operations — repo management, issue tracking, PR automation.
1. Go to <https://github.com/settings/tokens>
2. Click "Generate new token (classic)"
3. Scopes needed: `repo`, `workflow`, `read:org`, `delete_repo`
4. Copy token → paste into mcp-config.json under github.env.GITHUB_PERSONAL_ACCESS_TOKEN

## Notion MCP
Allows agent to read and write to your Notion workspace.
1. Go to <https://www.notion.so/my-integrations>
2. Click "+ New integration"
3. Name it "[project] agent"
4. Capabilities: Read content ✅, Update content ✅, Insert content ✅
5. Copy the "Internal Integration Token"
6. Paste into mcp-config.json under notion.env.NOTION_API_KEY
7. IMPORTANT: In Notion, open each page/database you want the agent to access
   → click "..." top right → "Add connections" → select your integration
   Without this step, the agent cannot see those pages.

## Neon MCP
Allows direct database operations via MCP (alternative to CLI connection string).
1. Go to <https://console.neon.tech> → Account Settings → API Keys
2. Click "Generate new API key"
3. Copy it → paste into mcp-config.json under neon.env.NEON_API_KEY

## Obsidian MCP (mcpvault) — @bitbonsai/mcpvault

MCP server: `@bitbonsai/mcpvault`
GitHub: <https://github.com/bitbonsai/mcpvault>
No API key needed. No Obsidian plugin needed. No Obsidian even needs to be open.

Vault path: C:\Users\HP\AgentVault

### For Claude Code (recommended — global scope, works across all projects)
```bash
claude mcp add-json obsidian --scope user '{"type":"stdio","command":"npx","args":["@bitbonsai/mcpvault@latest","C:\\Users\\HP\\AgentVault"]}'
```

Verify it’s registered: `claude mcp list`

### For Gemini CLI

```bash
gemini mcp add obsidian -- npx @bitbonsai/mcpvault@latest C:\Users\HP\AgentVault
```

### For Antigravity / Cursor / Windsurf

Already in `.agent/MCP/mcp-config.json` — load it from your IDE’s MCP settings.
In Antigravity: Settings → MCP Servers → point to `.agent/MCP/mcp-config.json`

### Test It Works

Ask the agent: “List the files in my Obsidian vault”
If it responds with the vault folder structure, it’s working.

### What It Can Do (14 operations)

- `read_note` — read any note in the vault
- `write_note` — create or overwrite a note
- `patch_note` — append, prepend, or update part of a note
- `delete_note` — soft delete (to trash) or permanent delete
- `move_note` — move a note to a different folder
- `list_notes` — list notes in a folder
- `search_notes` — search by content or title
- `get_vault_stats` — high-level vault statistics
- `get_notes_info` — metadata for multiple notes at once
- `update_frontmatter` — update YAML frontmatter without touching note content

### Note on Frontmatter

mcpvault preserves YAML frontmatter safely using AST-aware parsing.
You can use frontmatter to tag notes, set status, and add metadata:

```yaml
---
project: StoreFlex
status: active
tags: [deployment, railway, nodejs]
date: 2026-04-18
agent: Claude
---
```

## Playwright MCP
No token needed. Install and it works.
```bash
npx playwright install chromium
```

## Adding a New MCP Tool

Tell the agent: “Add [service] as an MCP tool”
It will:

1. Find the MCP server package for that service
2. Add it to this mcp-config.json
3. Add auth instructions to this guide
4. Register it in TOOL_REGISTRY.md
5. Tell you exactly what credential to get
