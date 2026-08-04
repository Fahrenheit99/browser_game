# Browser Platformer

A small 2D platformer built with React Native and Expo. The project includes a simple playable scene with a moving character, jumping, ducking, and basic on-screen controls, and runs on Android, iOS, and web from a single codebase.

## Features

- Simple player movement with on-screen left/right buttons
- Jump and duck mechanics via on-screen buttons
- Animated slime sprite (idle/walk/duck states) built from sprite sheets
- Runs natively on Android/iOS and in the browser via Expo's web support

## Controls

- ◀ / ▶ buttons: move left / right
- JUMP button: jump
- DUCK button: duck

## Project structure

- App.js: main game logic, game loop, and UI
- app.json: Expo app configuration
- babel.config.js: Babel config (babel-preset-expo)
- src/assets/sprites: player sprite sheets

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

   Then choose a platform from the Expo CLI, or run one of:
   ```bash
   npm run android
   npm run ios
   npm run web
   ```

3. Use Expo Go (Android/iOS) or your browser to open the app, depending on the platform chosen.

## Next ideas

You can expand this project by adding:

- enemy sprites and collisions
- coins or collectibles
- multiple levels
- sound effects and music
- score and lives

