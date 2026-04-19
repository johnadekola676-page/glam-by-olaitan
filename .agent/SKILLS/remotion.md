# Skill: Remotion — Video Generation

## What Is Remotion
Remotion lets you build videos using React. You write React components,
and Remotion renders them into real .mp4 video files.
Useful for: automated video ads, data visualizations, social media content.

## Status in This Workspace
⏸ STUBBED — not active in current project.
This skill is here and ready. When video generation is needed for the system ads,
come back to this file and follow the setup steps.

## When You Need This
Tell the agent: "Set up Remotion for video generation"
It will follow this skill to get everything running.

## Quick Start
```bash
npx create-video@latest
# Follow the prompts — creates a new Remotion project
cd my-video
npm install
npm start   # opens the Remotion Studio in your browser
```

## Core Concepts

- **Composition**: A React component that is your video (or a scene in your video)
- **FPS**: Frames per second (usually 30 or 60)
- **durationInFrames**: Length of the video in frames (30fps × 10 seconds = 300 frames)
- **useCurrentFrame()**: Hook that returns the current frame number — used to animate

## Basic Composition Example

```jsx
// src/MyVideo.jsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

export const MyVideo = () => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 30], [0, 1])  // fade in over 30 frames

  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white', fontSize: 80, opacity }}>Hello World</h1>
    </AbsoluteFill>
  )
}
```

## Register Compositions

```jsx
// src/index.jsx
import { Composition } from 'remotion'
import { MyVideo } from './MyVideo'

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}  // 5 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
)
```

## Render to MP4

```bash
npx remotion render MyVideo output.mp4
```

## Render Programmatically (from Node.js)

```jsx
const { renderMedia, selectComposition } = require('@remotion/renderer')

const composition = await selectComposition({
  serveUrl: '<http://localhost:3000>',
  id: 'MyVideo'
})

await renderMedia({
  composition,
  serveUrl: '<http://localhost:3000>',
  codec: 'h264',
  outputLocation: 'output.mp4'
})
```

## Useful Repos (for reference when building)

- https://github.com/remotion-dev/remotion — official repo
- https://github.com/remotion-dev/template-still — still image template
- https://github.com/remotion-dev/template-hello-world — starter template
