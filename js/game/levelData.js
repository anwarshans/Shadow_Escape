/* ==========================================================================
   Shadow Escape - Hardened 5 Level Layouts (Staircase Fighters & Dynamic Themes)
   ========================================================================== */

const LEVELS = [
    // --------------------------------------------------------------------------
    // LEVEL 1: GREEN VALLEY OUTSKIRTS (Peaceful Countryside Village)
    // --------------------------------------------------------------------------
    {
        id: 1,
        title: "Level 1: Green Valley Outskirts",
        subtitle: "Peaceful Countryside Village: Defeat the Fighter on the stairs with Attack (F / Mouse Click / ⚔️) to pass!",
        worldWidth: 1800,
        worldHeight: 850,
        spawn: { x: 80, y: 548 }, // 548 + 72 = 620
        platforms: [
            // Ground floors
            { x: 0, y: 620, width: 500, height: 230 },
            { x: 600, y: 620, width: 500, height: 230 },
            { x: 1200, y: 620, width: 600, height: 230 },

            // Security Staircase ("Stares")
            { x: 260, y: 530, width: 120, height: 28 },
            { x: 360, y: 460, width: 120, height: 28 },
            { x: 460, y: 390, width: 120, height: 28 },
            { x: 560, y: 320, width: 120, height: 28 },
            { x: 740, y: 480, width: 160, height: 28 },
            { x: 920, y: 380, width: 140, height: 28 },

            // High Security Key Tower
            { x: 980, y: 260, width: 160, height: 28 },
            { x: 1300, y: 480, width: 180, height: 28 }
        ],
        hazards: [
            { x: 500, y: 770, width: 100, height: 80 },
            { x: 1100, y: 770, width: 100, height: 80 }
        ],
        lasers: [
            { x1: 460, y1: 200, x2: 460, y2: 390, interval: 2.0, duration: 1.0 },
            { x1: 740, y1: 280, x2: 740, y2: 480, interval: 2.2, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 460, y: 314, rangeLeft: 460, rangeRight: 560, hp: 60 },      // Fighter on Staircase Step 3
            { type: 'fighter', x: 750, y: 404, rangeLeft: 740, rangeRight: 880, hp: 60 },      // Fighter on Landing Staircase
            { type: 'patrol', x: 650, y: 550, rangeLeft: 610, rangeRight: 920 },
            { type: 'flighter', x: 380, y: 380, rangeY: 30, speed: 0.9, pattern: 'vertical' },
            { type: 'flighter', x: 1020, y: 190, rangeY: 35, speed: 1.0, pattern: 'vertical' }
        ],
        crystals: [
            { x: 280, y: 480 },
            { x: 380, y: 410 },
            { x: 480, y: 340 },
            { x: 780, y: 430 },
            { x: 1040, y: 210 },
            { x: 1350, y: 430 }
        ],
        key: { x: 1040, y: 210 },
        door: { x: 1650, y: 538 },
        checkpoint: { x: 650, y: 574 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 2: METRO SKYLINE DISTRICT (Futuristic Metropolitan City)
    // --------------------------------------------------------------------------
    {
        id: 2,
        title: "Level 2: Metro Skyline District",
        subtitle: "Futuristic Metropolitan City: Defeat Fighters guarding cargo staircases!",
        worldWidth: 2000,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 350, height: 230 },
            { x: 420, y: 650, width: 320, height: 300 },
            { x: 820, y: 580, width: 320, height: 370 },
            { x: 1300, y: 720, width: 700, height: 230 },

            // Cargo Staircase 1 ("Stares")
            { x: 220, y: 560, width: 110, height: 26 },
            { x: 310, y: 480, width: 110, height: 26 },
            { x: 400, y: 400, width: 110, height: 26 },
            { x: 490, y: 320, width: 110, height: 26 },

            // Cargo Staircase 2
            { x: 740, y: 480, width: 120, height: 26 },
            { x: 840, y: 400, width: 120, height: 26 },
            { x: 940, y: 320, width: 120, height: 26 },

            // High Key Alcove Platform
            { x: 1140, y: 230, width: 180, height: 26 },
            { x: 1420, y: 480, width: 160, height: 26 }
        ],
        hazards: [
            { x: 350, y: 890, width: 70, height: 60 },
            { x: 740, y: 890, width: 80, height: 60 },
            { x: 1140, y: 890, width: 160, height: 60 }
        ],
        lasers: [
            { x1: 310, y1: 300, x2: 310, y2: 480, interval: 1.8, duration: 1.0 },
            { x1: 840, y1: 220, x2: 840, y2: 400, interval: 1.6, duration: 1.0 },
            { x1: 1300, y1: 500, x2: 1300, y2: 720, interval: 1.4, duration: 1.2 }
        ],
        enemies: [
            { type: 'fighter', x: 310, y: 404, rangeLeft: 310, rangeRight: 400, hp: 60 },      // Fighter on Cargo Stair 1
            { type: 'fighter', x: 840, y: 324, rangeLeft: 840, rangeRight: 940, hp: 60 },      // Fighter on Cargo Stair 2
            { type: 'patrol', x: 450, y: 580, rangeLeft: 430, rangeRight: 700 },
            { type: 'patrol', x: 850, y: 510, rangeLeft: 830, rangeRight: 1100 },
            { type: 'flighter', x: 330, y: 400, rangeY: 35, speed: 1.0, pattern: 'horizontal', rangeX: 100 },
            { type: 'flighter', x: 860, y: 240, rangeY: 40, speed: 1.1, pattern: 'vertical' },
            { type: 'flighter', x: 1180, y: 150, rangeY: 45, speed: 1.1, pattern: 'sine', rangeX: 80 }
        ],
        crystals: [
            { x: 240, y: 510 },
            { x: 330, y: 430 },
            { x: 420, y: 350 },
            { x: 860, y: 350 },
            { x: 1210, y: 180 },
            { x: 1470, y: 430 }
        ],
        key: { x: 1210, y: 180 },
        door: { x: 1800, y: 638 },
        checkpoint: { x: 850, y: 534 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 3: INDUSTRIAL POWER ZONE (Factories and Industrial Area)
    // --------------------------------------------------------------------------
    {
        id: 3,
        title: "Level 3: Industrial Power Zone",
        subtitle: "Factories and Industrial Area: Clear vertical lab stairs to reach the top!",
        worldWidth: 1800,
        worldHeight: 1300,
        spawn: { x: 80, y: 1108 },
        platforms: [
            { x: 0, y: 1180, width: 400, height: 120 },
            { x: 500, y: 1080, width: 300, height: 220 },
            { x: 900, y: 1180, width: 900, height: 120 },

            // Vertical Staircase Shaft ("Stares")
            { x: 150, y: 1020, width: 130, height: 28 },
            { x: 280, y: 910, width: 130, height: 28 },
            { x: 150, y: 790, width: 130, height: 28 },
            { x: 280, y: 670, width: 130, height: 28 },
            { x: 430, y: 550, width: 140, height: 28 },
            { x: 620, y: 430, width: 140, height: 28 },

            // Peak Containment Tower Key Platform
            { x: 880, y: 260, width: 180, height: 28 },
            { x: 1150, y: 420, width: 150, height: 28 },
            { x: 1350, y: 620, width: 180, height: 28 },
            { x: 1200, y: 850, width: 160, height: 28 }
        ],
        hazards: [
            { x: 400, y: 1240, width: 100, height: 60, isReactorFluid: false },
            { x: 800, y: 1240, width: 100, height: 60, isReactorFluid: false }
        ],
        lasers: [
            { x1: 280, y1: 720, x2: 280, y2: 910, interval: 1.8, duration: 1.0 },
            { x1: 620, y1: 460, x2: 620, y2: 780, interval: 1.5, duration: 1.1 }
        ],
        enemies: [
            { type: 'fighter', x: 280, y: 834, rangeLeft: 280, rangeRight: 390, hp: 60 },      // Fighter on Lab Stair Step 2
            { type: 'fighter', x: 430, y: 474, rangeLeft: 430, rangeRight: 550, hp: 60 },      // Fighter on Lab Stair Step 5
            { type: 'flighter', x: 200, y: 940, rangeY: 35, speed: 0.9, pattern: 'horizontal', rangeX: 90 },
            { type: 'flighter', x: 200, y: 710, rangeY: 40, speed: 1.0, pattern: 'vertical' },
            { type: 'flighter', x: 500, y: 470, rangeY: 45, speed: 1.1, pattern: 'horizontal', rangeX: 120 },
            { type: 'flighter', x: 920, y: 190, rangeY: 45, speed: 1.3, pattern: 'hunter' },
            { type: 'patrol', x: 920, y: 1110, rangeLeft: 910, rangeRight: 1500 }
        ],
        crystals: [
            { x: 180, y: 970 },
            { x: 310, y: 860 },
            { x: 180, y: 740 },
            { x: 310, y: 620 },
            { x: 460, y: 500 },
            { x: 940, y: 210 },
            { x: 1400, y: 570 }
        ],
        key: { x: 940, y: 210 },
        door: { x: 1600, y: 1098 },
        checkpoint: { x: 650, y: 384 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 4: RESEARCH FACILITY CORE (High-Tech Laboratory)
    // --------------------------------------------------------------------------
    {
        id: 4,
        title: "Level 4: Research Facility Core",
        subtitle: "High-Tech Laboratory: Plasma abyss stairs guarded by aggressive Fighters!",
        worldWidth: 2200,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 300, height: 230 },
            { x: 380, y: 620, width: 200, height: 330 },
            { x: 680, y: 520, width: 220, height: 430 },
            { x: 1000, y: 420, width: 250, height: 530 },
            { x: 1400, y: 550, width: 200, height: 400 },
            { x: 1750, y: 720, width: 450, height: 230 },

            // Floating Reactor Staircase ("Stares")
            { x: 260, y: 520, width: 100, height: 24 },
            { x: 350, y: 440, width: 100, height: 24 },
            { x: 440, y: 360, width: 100, height: 24 },
            { x: 570, y: 290, width: 110, height: 24 },

            // High Key Suspended Platform Over Abyss
            { x: 1050, y: 240, width: 140, height: 24 },
            { x: 1280, y: 360, width: 110, height: 24 },
            { x: 1580, y: 440, width: 120, height: 24 }
        ],
        hazards: [
            { x: 300, y: 890, width: 1450, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 350, y1: 200, x2: 350, y2: 440, interval: 1.4, duration: 1.0 },
            { x1: 680, y1: 150, x2: 680, y2: 520, interval: 1.3, duration: 1.0 },
            { x1: 1000, y1: 100, x2: 1000, y2: 420, interval: 1.1, duration: 1.1 },
            { x1: 1400, y1: 150, x2: 1400, y2: 550, interval: 1.4, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 350, y: 364, rangeLeft: 350, rangeRight: 430, hp: 60 },      // Fighter on Reactor Stair 2
            { type: 'fighter', x: 570, y: 214, rangeLeft: 570, rangeRight: 660, hp: 60 },      // Fighter on Reactor Stair 4
            { type: 'patrol', x: 400, y: 550, rangeLeft: 390, rangeRight: 550 },
            { type: 'patrol', x: 700, y: 450, rangeLeft: 690, rangeRight: 870 },
            { type: 'flighter', x: 370, y: 360, rangeY: 35, speed: 1.1, pattern: 'vertical' },
            { type: 'flighter', x: 570, y: 210, rangeY: 45, speed: 1.1, pattern: 'sine', rangeX: 90 },
            { type: 'flighter', x: 1080, y: 170, rangeY: 40, speed: 1.3, pattern: 'hunter' },
            { type: 'flighter', x: 1480, y: 300, rangeY: 35, speed: 1.1, pattern: 'vertical' }
        ],
        crystals: [
            { x: 280, y: 470 },
            { x: 370, y: 390 },
            { x: 460, y: 310 },
            { x: 1100, y: 190 },
            { x: 1320, y: 310 },
            { x: 1620, y: 390 }
        ],
        key: { x: 1100, y: 190 },
        door: { x: 1950, y: 638 },
        checkpoint: { x: 1020, y: 374 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 5: SHADOW NEXUS (Reactor Core / Final Escape)
    // --------------------------------------------------------------------------
    {
        id: 5,
        title: "Level 5: Shadow Nexus",
        subtitle: "Reactor Core & Final Escape: Grand Citadel stairs guarded by Elite Fighters!",
        worldWidth: 2500,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 350, height: 230 },
            { x: 450, y: 620, width: 250, height: 330 },
            { x: 800, y: 500, width: 300, height: 450 },
            { x: 1200, y: 400, width: 280, height: 550 },
            { x: 1650, y: 580, width: 250, height: 370 },
            { x: 2050, y: 720, width: 450, height: 230 },

            // Grand Citadel Staircase ("Stares")
            { x: 320, y: 540, width: 100, height: 24 },
            { x: 410, y: 460, width: 100, height: 24 },
            { x: 500, y: 380, width: 100, height: 24 },
            { x: 680, y: 420, width: 100, height: 24 },
            { x: 770, y: 340, width: 100, height: 24 },
            { x: 860, y: 260, width: 100, height: 24 },

            // Citadel Key Room Peak
            { x: 1270, y: 220, width: 150, height: 24 },
            { x: 1540, y: 440, width: 100, height: 24 }
        ],
        hazards: [
            { x: 350, y: 890, width: 1700, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 410, y1: 200, x2: 410, y2: 460, interval: 1.1, duration: 0.9 },
            { x1: 770, y1: 150, x2: 770, y2: 340, interval: 0.9, duration: 0.9 },
            { x1: 1200, y1: 100, x2: 1200, y2: 400, interval: 0.8, duration: 0.8 },
            { x1: 1650, y1: 150, x2: 1650, y2: 580, interval: 1.0, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 410, y: 384, rangeLeft: 410, rangeRight: 490, hp: 60 },      // Fighter on Citadel Stair 2
            { type: 'fighter', x: 770, y: 264, rangeLeft: 770, rangeRight: 850, hp: 60 },      // Fighter on Citadel Stair 5
            { type: 'fighter', x: 1270, y: 144, rangeLeft: 1270, rangeRight: 1400, hp: 80 },   // Elite Fighter on Peak Citadel Key Platform
            { type: 'flighter', x: 340, y: 460, rangeY: 35, speed: 1.1, pattern: 'horizontal', rangeX: 80 },
            { type: 'flighter', x: 510, y: 300, rangeY: 40, speed: 1.2, pattern: 'vertical' },
            { type: 'flighter', x: 800, y: 260, rangeY: 40, speed: 1.3, pattern: 'sine', rangeX: 90 },
            { type: 'flighter', x: 1290, y: 150, rangeY: 40, speed: 1.4, pattern: 'hunter' },
            { type: 'flighter', x: 1720, y: 280, rangeY: 45, speed: 1.3, pattern: 'hunter' },
            { type: 'patrol', x: 820, y: 430, rangeLeft: 810, rangeRight: 1060 }
        ],
        crystals: [
            { x: 340, y: 490 },
            { x: 430, y: 410 },
            { x: 520, y: 330 },
            { x: 800, y: 290 },
            { x: 1310, y: 170 },
            { x: 1570, y: 390 }
        ],
        key: { x: 1310, y: 170 },
        door: { x: 2250, y: 638 },
        checkpoint: { x: 850, y: 454 }
    }
];

window.LEVELS = LEVELS;
