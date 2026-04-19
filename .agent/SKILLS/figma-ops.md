# Skill: Figma Operations

## What This Skill Covers
- Reading Figma design files via the Figma REST API
- Extracting components, colors, typography, and layout from a Figma file
- Converting Figma designs to code (HTML/CSS, React, Tailwind)
- Pulling Figma-related repos from GitHub
- Downloading design asset zips when needed

## Setup — Get Your Figma API Token
1. Go to <https://www.figma.com> → top left menu → Account Settings
2. Scroll to "Access tokens" → "Generate new token"
3. Give it a name → copy the token
4. Save to .env:
   FIGMA_API_TOKEN=your_token_here

## Get a Figma File Key
The file key is in the Figma URL:
<https://www.figma.com/file/[FILE_KEY]/[file-name]>
Copy the FILE_KEY part.

## Read a Figma File (Full Structure)
```bash
curl -H "X-Figma-Token: $FIGMA_API_TOKEN" \
  "<https://api.figma.com/v1/files/[FILE_KEY]>" \
  | jq '.document.children[0]' > /tmp/figma-output.json
```

## Get All Components in a File

```bash
curl -H "X-Figma-Token: $FIGMA_API_TOKEN" \
  "<https://api.figma.com/v1/files/[FILE_KEY]/components>" \
  | jq '.meta.components[] | {name: .name, key: .key, description: .description}'
```

## Get All Colors (Styles)

```bash
curl -H "X-Figma-Token: $FIGMA_API_TOKEN" \
  "<https://api.figma.com/v1/files/[FILE_KEY]/styles>" \
  | jq '.meta.styles[]'
```

## Export an Image/Asset From Figma

```bash
# First get the node ID from the file structure, then:
curl -H "X-Figma-Token: $FIGMA_API_TOKEN" \
  "<https://api.figma.com/v1/images/[FILE_KEY]?ids=[NODE_ID]&format=png&scale=2>" \
  | jq '.images'
# Returns a URL to download the image
```

## Read a Specific Page or Frame

```jsx
// figma-reader.js
const fileKey = process.env.FIGMA_FILE_KEY
const token = process.env.FIGMA_API_TOKEN

const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
  headers: { 'X-Figma-Token': token }
})
const data = await response.json()

// Get all pages
const pages = data.document.children
pages.forEach(page => {
  console.log(`Page: ${page.name}`)
  page.children?.forEach(frame => {
    console.log(`  Frame: ${frame.name} (${frame.type})`)
  })
})
```

## Convert Figma Design to HTML/CSS

After reading the file structure, use this process:

1. Extract colors → create CSS variables
2. Extract typography → create font classes
3. Extract spacing values → create spacing system
4. Extract component structure → build HTML/CSS layout
5. Extract component names → map to React components if needed

## Pull a Figma-Related GitHub Repo

If the user gives a repo link:

```bash
git clone [repo-url] /tmp/figma-ref
ls /tmp/figma-ref
cat /tmp/figma-ref/README.md
```

If the user just describes what they need:

```bash
gh search repos "figma to react converter" --sort stars --limit 5
gh search repos "figma design system tokens" --sort stars --limit 5
```

## Download a Repo as Zip

```bash
curl -L <https://github.com/[owner]/[repo]/archive/refs/heads/main.zip> \
  -o /tmp/[repo].zip
unzip /tmp/[repo].zip -d /tmp/[repo]-extracted
```

## Useful Figma Repos (also in _SAVED_REPOS.md)

- https://github.com/figma/plugin-samples — official Figma plugin examples
- https://github.com/thomas-lowry/figma-plugins-on-github — curated list of Figma plugins
- https://github.com/kazuyaseki/figma-to-code — Figma to HTML/CSS/React converter
- https://github.com/nicktron/figma-linux — Figma for Linux

## Notes

- Figma API is read-only (you cannot write to Figma via API)
- Rate limit: 3 requests/minute per file for free plans
- For heavy extraction work, cache the API response to a local JSON file first
