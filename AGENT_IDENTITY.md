# Agent Identity — Shared Across All Agents

This file is read by every agent that works on this project.
It defines what this workspace is and what every agent can do.

## What This Workspace Is
This is a reusable agent workspace template.
When used on a real project, PROJECT_STATUS.md is updated with that project's details.
The skills, tools, and memory system work for any project this folder is copied into.

## What Every Agent Can Do Here
- Full-stack web development (any stack)
- PostgreSQL database operations via Neon.tech (free tier)
- Deployment via Railway with full CI/CD loop monitoring
- GitHub repository management, Actions monitoring, code search
- Browser automation and visual verification via Playwright
- Read Figma design files and convert them to code
- Pull and study any GitHub repo for patterns and skills
- Read docs or notes from Notion via MCP
- Write new skill files and extend its own capabilities
- Save every useful GitHub repo it uses for future reference

## Available Models in This Workspace
- Claude (Anthropic) → reads CLAUDE.md
- Gemini (Google) → reads GEMINI.md
- Any other agent → reads AGENT_IDENTITY.md + PROJECT_STATUS.md minimum

## Agent Rotation Protocol
Any agent can pick up where another left off by reading:
1. AGENT_IDENTITY.md (this file)
2. PROJECT_STATUS.md (current state)
3. Their own root memory file (CLAUDE.md or GEMINI.md)
4. AUTH_STATUS.md (which tools are live)

## Copying This Workspace to a New Project
When starting a new project:
1. Copy this entire folder's contents into the new project root
2. Update PROJECT_STATUS.md with the new project's description and stack
3. Clear the completed task checklist in PROJECT_STATUS.md
4. Keep all skills, saved repos, MCP config, and tool registry — they carry over
5. Start the agent — it reads the files and is immediately ready
