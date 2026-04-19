# Skill: Fetching Skills from GitHub

## When to Use This
- You need to implement something and have no skill for it
- The user says "go find how to do X from GitHub"
- You're unsure of the best implementation pattern
- User gives you a specific repo link to reference

## Step 1 — Check Saved Repos First
Before searching GitHub:
→ Read .agent/REPOS/_SAVED_REPOS.md
→ If a relevant repo is already saved, use it directly — skip to Step 3

## Step 2 — Search GitHub
```bash
gh search repos "[what you need]" --sort stars --limit 10
# Look for: most stars, recently updated, good description
```

Or if user gives you a specific repo URL — go straight to that one.

## Step 3 — Read the Repo Without Cloning (fast)

```bash
# Read README first
curl -s <https://raw.githubusercontent.com/[owner]/[repo]/main/README.md> | head -100

# Browse file structure
gh api repos/[owner]/[repo]/git/trees/main?recursive=1 | jq '.tree[].path'

# Read a specific file
curl -s <https://raw.githubusercontent.com/[owner]/[repo]/main/[filepath]>
```

## Step 4 — Clone If You Need Full Access

```bash
git clone <https://github.com/[owner]/[repo].git> /tmp/[repo-name]
# Or download as zip:
curl -L <https://github.com/[owner]/[repo]/archive/refs/heads/main.zip> -o /tmp/[repo].zip
unzip /tmp/[repo].zip -d /tmp/[repo]-unzipped
```

## Step 5 — Extract, Understand, Adapt

- Don’t copy blindly
- Read the relevant implementation
- Understand the pattern
- Adapt it to this project’s stack and structure
- Only take what you need

## Step 6 — ALWAYS Save the Repo

After using any repo, add it to .agent/REPOS/_SAVED_REPOS.md:

```markdown
## [Repo Name]
- URL: <https://github.com/[owner]/[repo]>
- Stars: [number]
- What it does: [one sentence]
- Used for: [what task in this project]
- Most useful files: [list the key files]
- Date saved: [date]
```

## Step 7 — Write a Skill File

If the pattern is reusable across projects:

1. Create .agent/SKILLS/[descriptive-name].md
2. Write it following the standard skill format
3. Add it to _SKILL_INDEX.md
4. Confirm it’s saved before moving on
