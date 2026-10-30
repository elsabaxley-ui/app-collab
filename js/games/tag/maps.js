// Modular Arena Maps for Super Tag (1280x720 coordinate space)
// Easy for Elsa & Byron to add more maps or custom obstacles!

export const TAG_MAPS = [
  {
    id: 'meadow',
    name: 'Sunny Meadow',
    subtitle: 'Trampolines & Sky Islands',
    swatch: 'linear-gradient(135deg, #38bdf8, #22c55e)',
    bgTop: '#38bdf8',
    bgBottom: '#e0f2fe',
    platformTop: '#22c55e',
    platformBody: '#15803d',
    accentColor: '#facc15',
    friction: 0.84,
    decorType: 'clouds',
    spawns: [
      { x: 180, y: 580 },
      { x: 1100, y: 580 },
      { x: 380, y: 240 },
      { x: 900, y: 240 }
    ],
    platforms: [
      // Ground floor
      { x: 40, y: 650, w: 1200, h: 42, solid: true },
      // Low side ledges
      { x: 80, y: 510, w: 250, h: 24 },
      { x: 950, y: 510, w: 250, h: 24 },
      // Center bridge
      { x: 430, y: 455, w: 420, h: 24 },
      // Mid-high outer platforms
      { x: 150, y: 335, w: 240, h: 22 },
      { x: 890, y: 335, w: 240, h: 22 },
      // Top crown island
      { x: 480, y: 215, w: 320, h: 24 },
      // High corner perches
      { x: 45, y: 175, w: 140, h: 20 },
      { x: 1095, y: 175, w: 140, h: 20 }
    ],
    jumpPads: [
      { x: 55, y: 636, w: 64, h: 14, vy: -19.5 },
      { x: 1161, y: 636, w: 64, h: 14, vy: -19.5 },
      { x: 608, y: 441, w: 64, h: 14, vy: -18.5 }
    ],
    portals: [
      {
        a: { x: 105, y: 135, color: '#a855f7' },
        b: { x: 1175, y: 605, color: '#a855f7' }
      },
      {
        a: { x: 1175, y: 135, color: '#ec4899' },
        b: { x: 105, y: 605, color: '#ec4899' }
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Neon Cyber Lab',
    subtitle: 'Warp Portals & Gravity Boosts',
    swatch: 'linear-gradient(135deg, #0f172a, #ec4899)',
    bgTop: '#090d16',
    bgBottom: '#1e1b4b',
    platformTop: '#06b6d4',
    platformBody: '#1e293b',
    accentColor: '#f43f5e',
    friction: 0.85,
    decorType: 'grid',
    spawns: [
      { x: 150, y: 580 },
      { x: 1130, y: 580 },
      { x: 260, y: 200 },
      { x: 1020, y: 200 }
    ],
    platforms: [
      // Split ground with center reactor pit (still safe floor at bottom)
      { x: 30, y: 655, w: 1220, h: 38, solid: true },
      // Symmetrical cyber decks
      { x: 60, y: 520, w: 300, h: 22 },
      { x: 920, y: 520, w: 300, h: 22 },
      // Center vertical reactor shelves
      { x: 490, y: 550, w: 300, h: 20 },
      { x: 420, y: 390, w: 440, h: 22 },
      { x: 520, y: 230, w: 240, h: 22 },
      // Upper wing decks
      { x: 120, y: 310, w: 230, h: 22 },
      { x: 930, y: 310, w: 230, h: 22 },
      { x: 200, y: 165, w: 220, h: 20 },
      { x: 860, y: 165, w: 220, h: 20 }
    ],
    jumpPads: [
      { x: 380, y: 641, w: 66, h: 14, vy: -20.5 },
      { x: 834, y: 641, w: 66, h: 14, vy: -20.5 },
      { x: 205, y: 296, w: 60, h: 14, vy: -17.5 },
      { x: 1015, y: 296, w: 60, h: 14, vy: -17.5 }
    ],
    portals: [
      {
        a: { x: 640, y: 185, color: '#22d3ee' },
        b: { x: 640, y: 610, color: '#22d3ee' }
      }
    ]
  },
  {
    id: 'glacier',
    name: 'Frosty Glacier',
    subtitle: 'Slippery Ice & Geyser Launches',
    swatch: 'linear-gradient(135deg, #bae6fd, #3b82f6)',
    bgTop: '#1d4ed8',
    bgBottom: '#dbeafe',
    platformTop: '#e0f2fe',
    platformBody: '#0284c7',
    accentColor: '#38bdf8',
    friction: 0.91, // extra slidey ice!
    decorType: 'snow',
    spawns: [
      { x: 200, y: 580 },
      { x: 1080, y: 580 },
      { x: 640, y: 300 },
      { x: 640, y: 140 }
    ],
    platforms: [
      { x: 40, y: 650, w: 1200, h: 42, solid: true },
      { x: 140, y: 515, w: 360, h: 24 },
      { x: 780, y: 515, w: 360, h: 24 },
      { x: 350, y: 375, w: 580, h: 24 },
      { x: 90, y: 265, w: 210, h: 22 },
      { x: 980, y: 265, w: 210, h: 22 },
      { x: 440, y: 195, w: 400, h: 24 }
    ],
    jumpPads: [
      { x: 605, y: 636, w: 70, h: 14, vy: -21 },
      { x: 165, y: 501, w: 62, h: 14, vy: -18.5 },
      { x: 1053, y: 501, w: 62, h: 14, vy: -18.5 }
    ],
    portals: [
      {
        a: { x: 160, y: 220, color: '#38bdf8' },
        b: { x: 1120, y: 220, color: '#38bdf8' }
      }
    ]
  },
  {
    id: 'sunset',
    name: 'Sunset Rooftops',
    subtitle: 'High-Rise Parkour & Launchers',
    swatch: 'linear-gradient(135deg, #f97316, #ec4899)',
    bgTop: '#7c2d12',
    bgBottom: '#fda4af',
    platformTop: '#fb923c',
    platformBody: '#431407',
    accentColor: '#fde047',
    friction: 0.84,
    decorType: 'city',
    spawns: [
      { x: 140, y: 580 },
      { x: 1140, y: 580 },
      { x: 460, y: 320 },
      { x: 820, y: 320 }
    ],
    platforms: [
      { x: 40, y: 650, w: 1200, h: 42, solid: true },
      // Three skyscraper towers
      { x: 100, y: 480, w: 240, h: 24 },
      { x: 130, y: 320, w: 180, h: 22 },
      { x: 500, y: 530, w: 280, h: 24 },
      { x: 460, y: 375, w: 360, h: 24 },
      { x: 530, y: 210, w: 220, h: 22 },
      { x: 940, y: 480, w: 240, h: 24 },
      { x: 970, y: 320, w: 180, h: 22 }
    ],
    jumpPads: [
      { x: 375, y: 636, w: 66, h: 14, vy: -20.5 },
      { x: 839, y: 636, w: 66, h: 14, vy: -20.5 },
      { x: 610, y: 361, w: 60, h: 14, vy: -18 }
    ],
    portals: [
      {
        a: { x: 220, y: 275, color: '#facc15' },
        b: { x: 1060, y: 275, color: '#facc15' }
      }
    ]
  }
];
