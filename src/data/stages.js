// Stage definitions for the Stages menu. Each unlocked stage recolors the
// arena/floor to give a visually distinct setting; the underlying gameplay
// (physics, sprite, controls) is shared across stages.

export const STAGES = [
  {
    id: 'grassland',
    name: 'Grassland',
    description: 'The original arena. Flat ground, clear skies.',
    locked: false,
    arenaBg: '#ffffff',
    floorColor: '#111827',
  },
  {
    id: 'desert',
    name: 'Desert',
    description: 'Same challenge, sun-baked color palette.',
    locked: false,
    arenaBg: '#fef3c7',
    floorColor: '#92400e',
  },
  {
    id: 'cave',
    name: 'Cave',
    description: 'A darker, moodier arena.',
    locked: false,
    arenaBg: '#1f2937',
    floorColor: '#000000',
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    description: 'More stages are on the way.',
    locked: true,
    arenaBg: '#e5e7eb',
    floorColor: '#9ca3af',
  },
];
