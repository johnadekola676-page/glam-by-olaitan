# Skill: Self-Extension

## When to Create a New Skill
- You figured out something non-obvious while working
- You used a new tool or API for the first time
- You fetched a pattern from GitHub and it's reusable
- The user says "remember how to do this"
- You completed something complex and want to save the approach

## How to Write a Skill File

Create .agent/SKILLS/[descriptive-kebab-name].md with this structure:

```markdown
# Skill: [Name]

## When to Use This
[One clear sentence on when this applies]

## Steps / Commands
[Exact commands, code snippets, or process steps — be specific and complete]

## Gotchas
[Things that go wrong and how to handle them — be honest about edge cases]

## Example
[A real working example from this project or the repo you learned from]
```

Then add to _SKILL_INDEX.md:

```markdown
| [filename].md | [What it covers — one line] |
```

Confirm the file is written and indexed before continuing.

## How to Add a New MCP Tool

When the user wants a new MCP integration (e.g., Linear, Slack, Stripe, custom tool):

1. Read .agent/MCP/mcp-config.json to understand current format
2. Find the MCP server package for the new tool (search npm or GitHub)
3. Add it to mcp-config.json following existing entries
4. Add auth instructions to [mcp-setup-guide.md](http://mcp-setup-guide.md/)
5. Add to TOOL_REGISTRY.md
6. Tell the user exactly what token/credential to get and where

## How to Add a New CLI Tool

When the user wants support for a new CLI tool (Vercel, [Fly.io](http://fly.io/), Stripe CLI, etc.):

1. Check if installed: `which [tool-name]`
2. If not: find the install command from official docs
3. Install it
4. Write a skill file for it
5. Add auth instructions to AUTH_STATUS.md
6. Add to TOOL_REGISTRY.md
7. Confirm to user it’s ready

## How to Add Support for a New Database/Service

When the user wants to use a new database or external service:

1. Find the official client library
2. Install it
3. Write a skill file with: connection setup, common operations, gotchas, examples
4. Save any useful repos to _SAVED_REPOS.md
5. Add to TOOL_REGISTRY.md
