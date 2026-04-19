# Skill: GitHub Operations

## Search for Repos or Code
```bash
gh search repos "telegram bot nodejs" --sort stars --limit 10
gh search repos "postgresql express api" --sort stars --limit 5
gh search code "webhook handler fastapi" --limit 10
```

## Read a File From Any Public Repo (no clone needed)

```bash
curl -s <https://raw.githubusercontent.com/[owner]/[repo]/main/[filepath]>
# Example:
curl -s <https://raw.githubusercontent.com/telegraf/telegraf/develop/README.md> | head -80
```

## Browse a Repo’s File Tree

```bash
gh api repos/[owner]/[repo]/git/trees/main?recursive=1 | jq '.tree[].path'
```

## Clone a Repo (for full access)

```bash
git clone <https://github.com/[owner]/[repo].git> /tmp/[repo-name]
# Browse it:
ls /tmp/[repo-name]
cat /tmp/[repo-name]/src/index.js
```

## Download a Repo as Zip

```bash
curl -L <https://github.com/[owner]/[repo]/archive/refs/heads/main.zip> -o /tmp/[repo].zip
unzip /tmp/[repo].zip -d /tmp/[repo]-extracted
```

## Watch GitHub Actions

```bash
gh run list --limit 10
gh run watch                        # live watch current run
gh run view [run-id] --log          # full logs
gh run view [run-id] --log-failed   # only failed steps
```

## Manage Branches and PRs

```bash
git checkout -b feature/[name]
git add . && git commit -m "feat: [description]"
git push origin feature/[name]
gh pr create --title "feat: [title]" --body "[description]"
gh pr list
gh pr merge [number] --squash
```

## Always Save Repos You Use

After referencing or cloning any repo, add it to:
.agent/REPOS/_SAVED_REPOS.md
(See [skill-fetcher.md](http://skill-fetcher.md/) for the format)
