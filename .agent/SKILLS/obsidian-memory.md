# Skill: Obsidian Long-Term Memory (mcpvault)

## What This Is
The agent has access to a central Obsidian vault that persists permanently across all projects and sessions.
It is the agent's long-term brain. Project `.agent/` files are short-term context. The vault is long-term memory.

## Vault Location
C:\Users\HP\AgentVault

## MCP Server
@bitbonsai/mcpvault — no plugin, no API key, no Obsidian app needed to be open.

## When to READ the Vault
- Start of every session — read the project overview and today's daily log
- Before debugging a bug — search Bugs-and-Fixes/ first
- Before approaching a new task type — check Skills/ for cross-project knowledge
- When architecture decisions need to be understood — read Architecture-Decisions.md

## When to WRITE to the Vault
- End of every session — always
- When a significant bug is fixed — immediately
- When a new technique is discovered — immediately
- When a pattern emerges across sessions — write it to Patterns/
- When a tool is set up — update Tools/Setup-Guides.md

## Vault Structure
```

C:\Users\HP\AgentVault/
README.md                          ← what the vault is
Index.md                           ← master index, update when adding notes

Projects/
_Projects-Overview.md            ← all projects at a glance
[project-name]/
Overview.md                    ← stack, status, live URL, current focus
Architecture-Decisions.md      ← why things are built the way they are
Bugs-Solved.md                 ← bugs fixed in this project specifically
Deployment-Log.md              ← deployment history
Lessons-Learned.md             ← what worked, what didn’t

Skills/
_Skills-Overview.md              ← index of all cross-project skills
[skill-name].md                  ← individual skills

Patterns/
_Patterns-Overview.md            ← index of all patterns
[pattern-name].md                ← individual patterns

Bugs-and-Fixes/
_Bugs-Overview.md                ← index of all bugs logged
[YYYY-MM-DD]-[description].md    ← individual bug logs

Tools/
Setup-Guides.md                  ← how to set up every tool
Tool-Comparisons.md              ← which tool for what

Daily-Log/
_Daily-Log-Overview.md           ← index of all daily logs
[YYYY-MM-DD].md                  ← individual daily logs

```
## How to Create a New Project Entry
When starting on a project that doesn't have a vault entry yet:
1. Create folder: `Projects/[project-name]/`
2. Create `Overview.md` with project description, stack, status
3. Create `Architecture-Decisions.md` (empty, add decisions as they're made)
4. Create `Bugs-Solved.md` (empty, add bugs as they're fixed)
5. Create `Deployment-Log.md` (empty, add deployments as they happen)
6. Create `Lessons-Learned.md` (empty, add as sessions progress)
7. Add entry to `Projects/_Projects-Overview.md`
8. Update `Index.md`

## How to Write a Daily Log
At the end of every session:
1. Check if `Daily-Log/[today's date].md` exists
2. If yes — patch_note to append today's updates
3. If no — write_note to create it using the format from _Daily-Log-Overview.md
4. Add link to `Daily-Log/_Daily-Log-Overview.md`

## Frontmatter to Use on Project Notes
```yaml
---
project: [project-name]
type: overview | architecture | bugs | deployment | lessons
status: active | completed | paused
last-agent: Claude | Gemini
date-updated: YYYY-MM-DD
---
```

## MCP Operations Reference

| Operation | Use When |
| --- | --- |
| `read_note` | Reading any vault note at start of session |
| `write_note` | Creating a new note or replacing one entirely |
| `patch_note` | Appending to daily log or updating part of a note |
| `search_notes` | Finding existing bugs, skills, or patterns before starting work |
| `list_notes` | Browsing what exists in a folder |
| `update_frontmatter` | Updating status or date without touching content |
| `get_vault_stats` | Quick check of how much is in the vault |

## Important

- Never store API keys, passwords, or tokens in the vault. Use `.env` files for secrets.
- Obsidian doesn’t need to be installed or running for mcpvault to work.
- If Obsidian is installed and you open the vault in it, you get a visual interface to read your agent’s notes. This is optional but very useful.
- Back up the vault with git: `cd C:\Users\HP\AgentVault && git init && git add . && git commit -m "init vault"`
