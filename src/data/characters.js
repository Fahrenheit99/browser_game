// Character catalog: the single source of truth for playable characters and
// their sprite sheets. GameScreen and the character-select UI both read from
// this file instead of hardcoding sprite imports/frame counts.
//
// To add a new character:
//   1. Drop its idle/walk/duck sprite sheets into src/assets/sprites.
//   2. Import them below and add one entry to CHARACTERS.
//   3. That's it - no changes needed in GameScreen or the select screen,
//      as long as the sheet follows the same row/frame layout described here.
//
// Sheet layout assumptions (matches the CraftPix slime sheets):
//   - Each sheet is a grid of CHARACTER_FRAME_SIZE x CHARACTER_FRAME_SIZE frames.
//   - Rows represent facing directions; CHARACTER_ROWS is the row count.
//   - `spriteRow` is the row used as the side-facing strip (mirrored for the
//     opposite direction), and `frameCount` is how many frames are in that row.
//   - `duck.frozenFrame` (0-based) is the single frame shown while ducking;
//     defaults to the last frame of the duck sheet when omitted.

import idleSheet from '../assets/sprites/Slime1_Idle_without_shadow.png';
import walkSheet from '../assets/sprites/Slime1_Walk_without_shadow.png';
import deathSheet from '../assets/sprites/Slime1_Death_without_shadow.png';

export const CHARACTER_FRAME_SIZE = 48;
export const CHARACTER_ROWS = 4;

export const CHARACTERS = [
  {
    id: 'slime1',
    name: 'Slime',
    description: 'The original green slime.',
    locked: false,
    spriteRow: 2,
    sprites: {
      idle: { sheet: idleSheet, frameCount: 6 },
      walk: { sheet: walkSheet, frameCount: 8 },
      duck: { sheet: deathSheet, frameCount: 10, frozenFrame: 9 },
    },
  },
  {
    id: 'coming-soon-1',
    name: 'Coming Soon',
    description: 'More characters are on the way.',
    locked: true,
  },
  {
    id: 'coming-soon-2',
    name: 'Coming Soon',
    description: 'More characters are on the way.',
    locked: true,
  },
];

export function getCharacterById(id) {
  return CHARACTERS.find((character) => character.id === id && !character.locked) ?? CHARACTERS[0];
}
