# Browser Platformer

A small 2D platformer built with React and Vite. The project currently includes a simple playable scene with a moving character, jumping, and basic platforms.

## Features

- Simple player movement with left/right controls
- Jump mechanic using W, Arrow Up, or Space
- Duck mechanic using S or Arrow Down
- Plain white background with a floor
- Lightweight React + Vite setup

## Controls

- A / Left Arrow: move left
- D / Right Arrow: move right
- W / Arrow Up / Space: jump
- S / Down Arrow: duck

## Project structure

- src/App.jsx: main game logic and player movement
- src/styles.css: visual styling for the game scene
- src/main.jsx: React entry point
- index.html: app shell

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite in your browser.

## Build for production

```bash
npm run build
```

## Next ideas

You can expand this project by adding:

- enemy sprites and collisions
- coins or collectibles
- multiple levels
- sound effects and music
- score and lives
