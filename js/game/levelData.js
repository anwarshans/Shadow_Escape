/* ==========================================================================
   Shadow Escape - Hardened & Extended 5 Level Layouts
   ========================================================================== */

const LEVELS = [
    // --------------------------------------------------------------------------
    // LEVEL 1: GREEN VALLEY OUTSKIRTS (Peaceful Countryside Village)
    // --------------------------------------------------------------------------
    {
        id: 1,
        title: "Level 1: Green Valley Outskirts",
        subtitle: "Peaceful Countryside Village: Defeat Fighters on the staircases & cross security gaps to reach the outpost tower!",
        worldWidth: 3000,
        worldHeight: 850,
        spawn: { x: 80, y: 548 }, // 548 + 72 = 620
        platforms: [
            // Ground sectors
            { x: 0, y: 620, width: 500, height: 230 },
            { x: 620, y: 620, width: 550, height: 230 },
            { x: 1300, y: 620, width: 600, height: 230 },
            { x: 2050, y: 620, width: 950, height: 230 },

            // Security Staircase 1
            { x: 260, y: 530, width: 120, height: 28 },
            { x: 360, y: 460, width: 120, height: 28 },
            { x: 460, y: 390, width: 120, height: 28 },
            { x: 560, y: 320, width: 120, height: 28 },

            // Village Bridge Tower Staircase 2
            { x: 760, y: 530, width: 120, height: 28 },
            { x: 860, y: 450, width: 130, height: 28 },
            { x: 970, y: 370, width: 130, height: 28 },
            { x: 1080, y: 290, width: 140, height: 28 },

            // Outpost Security Staircase 3
            { x: 1480, y: 520, width: 130, height: 28 },
            { x: 1600, y: 440, width: 130, height: 28 },
            { x: 1720, y: 360, width: 130, height: 28 },

            // Outpost Watchtower Key Platform
            { x: 2150, y: 260, width: 200, height: 28 },
            { x: 2500, y: 480, width: 180, height: 28 }
        ],
        hazards: [
            { x: 500, y: 770, width: 120, height: 80 },
            { x: 1170, y: 770, width: 130, height: 80 },
            { x: 1900, y: 770, width: 150, height: 80 }
        ],
        lasers: [
            { x1: 460, y1: 200, x2: 460, y2: 390, interval: 1.6, duration: 1.0 },
            { x1: 860, y1: 250, x2: 860, y2: 450, interval: 1.5, duration: 1.0 },
            { x1: 1600, y1: 240, x2: 1600, y2: 440, interval: 1.5, duration: 1.0 },
            { x1: 2150, y1: 100, x2: 2150, y2: 260, interval: 1.4, duration: 0.9 }
        ],
        enemies: [
            { type: 'fighter', x: 460, y: 314, rangeLeft: 460, rangeRight: 560, hp: 65 },      // Fighter on Staircase 1 Step 3
            { type: 'fighter', x: 860, y: 374, rangeLeft: 860, rangeRight: 970, hp: 70 },      // Fighter on Bridge Staircase
            { type: 'fighter', x: 1600, y: 364, rangeLeft: 1600, rangeRight: 1720, hp: 70 },   // Fighter on Outpost Staircase
            { type: 'fighter', x: 2180, y: 184, rangeLeft: 2150, rangeRight: 2320, hp: 75 },   // Fighter on Watchtower Platform
            { type: 'patrol', x: 670, y: 550, rangeLeft: 630, rangeRight: 920 },
            { type: 'patrol', x: 2120, y: 550, rangeLeft: 2080, rangeRight: 2450 },
            { type: 'flighter', x: 380, y: 380, rangeY: 35, speed: 1.0, pattern: 'vertical' },
            { type: 'flighter', x: 1020, y: 220, rangeY: 40, speed: 1.1, pattern: 'sine', rangeX: 80 },
            { type: 'flighter', x: 1750, y: 280, rangeY: 45, speed: 1.1, pattern: 'vertical' },
            { type: 'flighter', x: 2400, y: 380, rangeY: 40, speed: 1.2, pattern: 'sine', rangeX: 90 }
        ],
        crystals: [
            { x: 280, y: 480 },
            { x: 380, y: 410 },
            { x: 480, y: 340 },
            { x: 880, y: 400 },
            { x: 990, y: 320 },
            { x: 1100, y: 240 },
            { x: 1510, y: 470 },
            { x: 1630, y: 390 },
            { x: 2210, y: 210 },
            { x: 2270, y: 210 },
            { x: 2550, y: 430 },
            { x: 2750, y: 560 }
        ],
        key: { x: 2250, y: 210 },
        door: { x: 2850, y: 538 },
        checkpoint: { x: 1400, y: 574 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 2: METRO SKYLINE DISTRICT (Futuristic Metropolitan City)
    // --------------------------------------------------------------------------
    {
        id: 2,
        title: "Level 2: Metro Skyline District",
        subtitle: "Futuristic Metropolitan City: Defeat Fighters guarding cargo staircases & cross monorail abysses!",
        worldWidth: 3600,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 380, height: 230 },
            { x: 480, y: 650, width: 350, height: 300 },
            { x: 950, y: 580, width: 400, height: 370 },
            { x: 1480, y: 650, width: 450, height: 300 },
            { x: 2050, y: 580, width: 400, height: 370 },
            { x: 2580, y: 720, width: 1020, height: 230 },

            // Cargo Staircase 1
            { x: 240, y: 560, width: 110, height: 26 },
            { x: 330, y: 480, width: 110, height: 26 },
            { x: 420, y: 400, width: 110, height: 26 },
            { x: 510, y: 320, width: 110, height: 26 },

            // Cargo Staircase 2
            { x: 850, y: 480, width: 120, height: 26 },
            { x: 950, y: 400, width: 120, height: 26 },
            { x: 1050, y: 320, width: 120, height: 26 },

            // Skybridge Cargo Staircase 3
            { x: 1600, y: 530, width: 120, height: 26 },
            { x: 1710, y: 450, width: 120, height: 26 },
            { x: 1820, y: 370, width: 120, height: 26 },

            // Monorail Tower Staircase 4
            { x: 2200, y: 480, width: 120, height: 26 },
            { x: 2310, y: 400, width: 120, height: 26 },
            { x: 2420, y: 320, width: 120, height: 26 },

            // High Key Alcove Platforms
            { x: 2550, y: 230, width: 200, height: 26 },
            { x: 2900, y: 480, width: 180, height: 26 }
        ],
        hazards: [
            { x: 380, y: 890, width: 100, height: 60 },
            { x: 830, y: 890, width: 120, height: 60 },
            { x: 1350, y: 890, width: 130, height: 60 },
            { x: 1930, y: 890, width: 120, height: 60 },
            { x: 2450, y: 890, width: 130, height: 60 }
        ],
        lasers: [
            { x1: 330, y1: 300, x2: 330, y2: 480, interval: 1.5, duration: 1.0 },
            { x1: 950, y1: 220, x2: 950, y2: 400, interval: 1.4, duration: 1.0 },
            { x1: 1480, y1: 450, x2: 1480, y2: 650, interval: 1.3, duration: 1.1 },
            { x1: 1820, y1: 200, x2: 1820, y2: 370, interval: 1.4, duration: 1.0 },
            { x1: 2310, y1: 220, x2: 2310, y2: 400, interval: 1.3, duration: 1.0 },
            { x1: 2900, y1: 300, x2: 2900, y2: 480, interval: 1.2, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 330, y: 404, rangeLeft: 330, rangeRight: 420, hp: 70 },      // Fighter Cargo Stair 1
            { type: 'fighter', x: 950, y: 324, rangeLeft: 950, rangeRight: 1050, hp: 75 },     // Fighter Cargo Stair 2
            { type: 'fighter', x: 1710, y: 374, rangeLeft: 1710, rangeRight: 1820, hp: 75 },   // Fighter Cargo Stair 3
            { type: 'fighter', x: 2310, y: 324, rangeLeft: 2310, rangeRight: 2420, hp: 75 },   // Fighter Cargo Stair 4
            { type: 'fighter', x: 2580, y: 154, rangeLeft: 2550, rangeRight: 2720, hp: 80 },   // Monorail Key Fighter
            { type: 'patrol', x: 520, y: 580, rangeLeft: 490, rangeRight: 780 },
            { type: 'patrol', x: 1000, y: 510, rangeLeft: 960, rangeRight: 1300 },
            { type: 'patrol', x: 2650, y: 650, rangeLeft: 2600, rangeRight: 3100 },
            { type: 'flighter', x: 350, y: 400, rangeY: 35, speed: 1.1, pattern: 'horizontal', rangeX: 100 },
            { type: 'flighter', x: 970, y: 240, rangeY: 40, speed: 1.2, pattern: 'vertical' },
            { type: 'flighter', x: 1550, y: 300, rangeY: 45, speed: 1.2, pattern: 'sine', rangeX: 90 },
            { type: 'flighter', x: 2100, y: 220, rangeY: 40, speed: 1.3, pattern: 'hunter' },
            { type: 'flighter', x: 2950, y: 380, rangeY: 40, speed: 1.2, pattern: 'sine', rangeX: 100 }
        ],
        crystals: [
            { x: 260, y: 510 },
            { x: 350, y: 430 },
            { x: 440, y: 350 },
            { x: 880, y: 430 },
            { x: 980, y: 350 },
            { x: 1630, y: 480 },
            { x: 1740, y: 400 },
            { x: 2230, y: 430 },
            { x: 2340, y: 350 },
            { x: 2600, y: 180 },
            { x: 2700, y: 180 },
            { x: 2950, y: 430 },
            { x: 3200, y: 660 },
            { x: 3350, y: 660 }
        ],
        key: { x: 2650, y: 180 },
        door: { x: 3400, y: 638 },
        checkpoint: { x: 1750, y: 584 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 3: INDUSTRIAL POWER ZONE (Factories and Industrial Area)
    // --------------------------------------------------------------------------
    {
        id: 3,
        title: "Level 3: Industrial Power Zone",
        subtitle: "Factories and Industrial Area: Clear vertical lab stairs to reach the high chemical containment peak!",
        worldWidth: 3400,
        worldHeight: 1400,
        spawn: { x: 80, y: 1208 },
        platforms: [
            { x: 0, y: 1280, width: 450, height: 120 },
            { x: 550, y: 1180, width: 400, height: 220 },
            { x: 1050, y: 1280, width: 450, height: 120 },
            { x: 1600, y: 1180, width: 450, height: 220 },
            { x: 2150, y: 1280, width: 1250, height: 120 },

            // Vertical Lab Staircase Shaft 1
            { x: 150, y: 1120, width: 130, height: 28 },
            { x: 280, y: 1010, width: 130, height: 28 },
            { x: 150, y: 890, width: 130, height: 28 },
            { x: 280, y: 770, width: 130, height: 28 },
            { x: 430, y: 650, width: 140, height: 28 },
            { x: 620, y: 530, width: 140, height: 28 },

            // Vertical Lab Staircase Shaft 2
            { x: 1250, y: 1120, width: 130, height: 28 },
            { x: 1380, y: 1010, width: 130, height: 28 },
            { x: 1250, y: 890, width: 130, height: 28 },
            { x: 1380, y: 770, width: 130, height: 28 },
            { x: 1530, y: 650, width: 140, height: 28 },
            { x: 1720, y: 530, width: 140, height: 28 },

            // Peak Chemical Vault Platforms
            { x: 2350, y: 270, width: 220, height: 28 },
            { x: 2650, y: 450, width: 180, height: 28 },
            { x: 2900, y: 680, width: 180, height: 28 },
            { x: 2700, y: 920, width: 180, height: 28 }
        ],
        hazards: [
            { x: 450, y: 1340, width: 100, height: 60, isReactorFluid: false },
            { x: 950, y: 1340, width: 100, height: 60, isReactorFluid: false },
            { x: 1500, y: 1340, width: 100, height: 60, isReactorFluid: true },
            { x: 2050, y: 1340, width: 100, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 280, y1: 820, x2: 280, y2: 1010, interval: 1.6, duration: 1.0 },
            { x1: 620, y1: 560, x2: 620, y2: 880, interval: 1.4, duration: 1.1 },
            { x1: 1380, y1: 820, x2: 1380, y2: 1010, interval: 1.5, duration: 1.0 },
            { x1: 1720, y1: 560, x2: 1720, y2: 880, interval: 1.3, duration: 1.1 },
            { x1: 2350, y1: 120, x2: 2350, y2: 270, interval: 1.2, duration: 1.0 },
            { x1: 2650, y1: 300, x2: 2650, y2: 450, interval: 1.1, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 280, y: 934, rangeLeft: 280, rangeRight: 390, hp: 75 },      // Lab Stair 1 Step 2
            { type: 'fighter', x: 430, y: 574, rangeLeft: 430, rangeRight: 550, hp: 75 },      // Lab Stair 1 Step 5
            { type: 'fighter', x: 1380, y: 934, rangeLeft: 1380, rangeRight: 1490, hp: 75 },   // Lab Stair 2 Step 2
            { type: 'fighter', x: 1530, y: 574, rangeLeft: 1530, rangeRight: 1650, hp: 80 },   // Lab Stair 2 Step 5
            { type: 'fighter', x: 2380, y: 194, rangeLeft: 2350, rangeRight: 2530, hp: 85 },   // Chemical Vault Guard
            { type: 'patrol', x: 600, y: 1110, rangeLeft: 560, rangeRight: 900 },
            { type: 'patrol', x: 1650, y: 1110, rangeLeft: 1610, rangeRight: 2000 },
            { type: 'patrol', x: 2300, y: 1210, rangeLeft: 2200, rangeRight: 2800 },
            { type: 'flighter', x: 200, y: 1040, rangeY: 35, speed: 1.0, pattern: 'horizontal', rangeX: 90 },
            { type: 'flighter', x: 200, y: 810, rangeY: 40, speed: 1.1, pattern: 'vertical' },
            { type: 'flighter', x: 1300, y: 1040, rangeY: 35, speed: 1.1, pattern: 'horizontal', rangeX: 90 },
            { type: 'flighter', x: 1600, y: 570, rangeY: 45, speed: 1.2, pattern: 'sine', rangeX: 100 },
            { type: 'flighter', x: 2400, y: 190, rangeY: 45, speed: 1.4, pattern: 'hunter' },
            { type: 'flighter', x: 2800, y: 600, rangeY: 40, speed: 1.3, pattern: 'hunter' }
        ],
        crystals: [
            { x: 180, y: 1070 },
            { x: 310, y: 960 },
            { x: 180, y: 840 },
            { x: 310, y: 720 },
            { x: 460, y: 600 },
            { x: 1280, y: 1070 },
            { x: 1410, y: 960 },
            { x: 1280, y: 840 },
            { x: 1410, y: 720 },
            { x: 1560, y: 600 },
            { x: 2400, y: 220 },
            { x: 2500, y: 220 },
            { x: 2700, y: 400 },
            { x: 2950, y: 630 },
            { x: 3100, y: 1220 }
        ],
        key: { x: 2450, y: 220 },
        door: { x: 3200, y: 1198 },
        checkpoint: { x: 1650, y: 584 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 4: RESEARCH FACILITY CORE (High-Tech Laboratory)
    // --------------------------------------------------------------------------
    {
        id: 4,
        title: "Level 4: Research Facility Core",
        subtitle: "High-Tech Laboratory: Plasma abyss staircases guarded by aggressive Elite Fighters!",
        worldWidth: 4000,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 320, height: 230 },
            { x: 420, y: 620, width: 220, height: 330 },
            { x: 740, y: 520, width: 240, height: 430 },
            { x: 1080, y: 420, width: 280, height: 530 },
            { x: 1500, y: 550, width: 250, height: 400 },
            { x: 1900, y: 420, width: 300, height: 530 },
            { x: 2350, y: 550, width: 250, height: 400 },
            { x: 2750, y: 720, width: 1250, height: 230 },

            // Floating Plasma Staircase 1
            { x: 280, y: 520, width: 100, height: 24 },
            { x: 370, y: 440, width: 100, height: 24 },
            { x: 460, y: 360, width: 100, height: 24 },
            { x: 590, y: 290, width: 110, height: 24 },

            // Floating Plasma Staircase 2
            { x: 1300, y: 360, width: 110, height: 24 },
            { x: 1410, y: 280, width: 110, height: 24 },

            // Floating Plasma Staircase 3
            { x: 2150, y: 360, width: 110, height: 24 },
            { x: 2260, y: 280, width: 110, height: 24 },

            // High Suspended Alcove Key Platforms
            { x: 2700, y: 230, width: 180, height: 24 },
            { x: 3000, y: 440, width: 140, height: 24 }
        ],
        hazards: [
            { x: 320, y: 890, width: 1580, height: 60, isReactorFluid: true },
            { x: 2200, y: 890, width: 550, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 370, y1: 200, x2: 370, y2: 440, interval: 1.3, duration: 1.0 },
            { x1: 740, y1: 150, x2: 740, y2: 520, interval: 1.2, duration: 1.0 },
            { x1: 1080, y1: 100, x2: 1080, y2: 420, interval: 1.1, duration: 1.0 },
            { x1: 1500, y1: 150, x2: 1500, y2: 550, interval: 1.3, duration: 1.0 },
            { x1: 1900, y1: 100, x2: 1900, y2: 420, interval: 1.1, duration: 1.0 },
            { x1: 2350, y1: 150, x2: 2350, y2: 550, interval: 1.2, duration: 1.0 },
            { x1: 2700, y1: 80, x2: 2700, y2: 230, interval: 1.0, duration: 0.9 },
            { x1: 3000, y1: 250, x2: 3000, y2: 440, interval: 1.1, duration: 1.0 }
        ],
        enemies: [
            { type: 'fighter', x: 370, y: 364, rangeLeft: 370, rangeRight: 450, hp: 80 },      // Fighter Plasma Stair 1
            { type: 'fighter', x: 590, y: 214, rangeLeft: 590, rangeRight: 680, hp: 80 },      // Fighter Plasma Stair Top
            { type: 'fighter', x: 1300, y: 284, rangeLeft: 1300, rangeRight: 1400, hp: 85 },   // Fighter Plasma Stair 2
            { type: 'fighter', x: 2150, y: 284, rangeLeft: 2150, rangeRight: 2250, hp: 85 },   // Fighter Plasma Stair 3
            { type: 'fighter', x: 2730, y: 154, rangeLeft: 2700, rangeRight: 2850, hp: 90 },   // Elite Vault Guard
            { type: 'fighter', x: 3000, y: 364, rangeLeft: 3000, rangeRight: 3120, hp: 85 },   // Vault Ramp Guard
            { type: 'patrol', x: 440, y: 550, rangeLeft: 430, rangeRight: 600 },
            { type: 'patrol', x: 760, y: 450, rangeLeft: 750, rangeRight: 950 },
            { type: 'patrol', x: 1920, y: 350, rangeLeft: 1910, rangeRight: 2150 },
            { type: 'patrol', x: 2800, y: 650, rangeLeft: 2760, rangeRight: 3200 },
            { type: 'flighter', x: 390, y: 360, rangeY: 35, speed: 1.2, pattern: 'vertical' },
            { type: 'flighter', x: 600, y: 210, rangeY: 45, speed: 1.2, pattern: 'sine', rangeX: 90 },
            { type: 'flighter', x: 1150, y: 170, rangeY: 40, speed: 1.4, pattern: 'hunter' },
            { type: 'flighter', x: 1580, y: 300, rangeY: 35, speed: 1.2, pattern: 'vertical' },
            { type: 'flighter', x: 2200, y: 180, rangeY: 45, speed: 1.4, pattern: 'hunter' },
            { type: 'flighter', x: 2800, y: 160, rangeY: 40, speed: 1.3, pattern: 'sine', rangeX: 100 }
        ],
        crystals: [
            { x: 300, y: 470 },
            { x: 390, y: 390 },
            { x: 480, y: 310 },
            { x: 1150, y: 190 },
            { x: 1340, y: 310 },
            { x: 1440, y: 230 },
            { x: 2180, y: 310 },
            { x: 2280, y: 230 },
            { x: 2750, y: 180 },
            { x: 2830, y: 180 },
            { x: 3040, y: 390 },
            { x: 3200, y: 660 },
            { x: 3400, y: 660 },
            { x: 3600, y: 660 },
            { x: 3750, y: 660 }
        ],
        key: { x: 2800, y: 180 },
        door: { x: 3800, y: 638 },
        checkpoint: { x: 1920, y: 374 }
    },

    // --------------------------------------------------------------------------
    // LEVEL 5: SHADOW NEXUS (Reactor Core / Final Escape)
    // --------------------------------------------------------------------------
    {
        id: 5,
        title: "Level 5: Shadow Nexus",
        subtitle: "Reactor Core & Final Escape: Grand Citadel staircases guarded by supreme Elite Fighters!",
        worldWidth: 4800,
        worldHeight: 950,
        spawn: { x: 80, y: 648 },
        platforms: [
            { x: 0, y: 720, width: 380, height: 230 },
            { x: 480, y: 620, width: 280, height: 330 },
            { x: 860, y: 500, width: 320, height: 450 },
            { x: 1280, y: 400, width: 300, height: 550 },
            { x: 1750, y: 580, width: 280, height: 370 },
            { x: 2150, y: 450, width: 320, height: 500 },
            { x: 2600, y: 320, width: 350, height: 630 },
            { x: 3100, y: 520, width: 300, height: 430 },
            { x: 3550, y: 720, width: 1250, height: 230 },

            // Grand Citadel Staircase 1
            { x: 340, y: 540, width: 100, height: 24 },
            { x: 430, y: 460, width: 100, height: 24 },
            { x: 520, y: 380, width: 100, height: 24 },

            // Grand Citadel Staircase 2
            { x: 700, y: 420, width: 100, height: 24 },
            { x: 790, y: 340, width: 100, height: 24 },
            { x: 880, y: 260, width: 100, height: 24 },

            // Citadel Spire Staircase 3
            { x: 1900, y: 480, width: 100, height: 24 },
            { x: 2000, y: 390, width: 100, height: 24 },

            // Citadel High Peak Staircase 4
            { x: 2450, y: 360, width: 100, height: 24 },
            { x: 2540, y: 260, width: 100, height: 24 },

            // High Citadel Core Apex Key Platform
            { x: 3200, y: 200, width: 200, height: 24 },
            { x: 3450, y: 400, width: 150, height: 24 }
        ],
        hazards: [
            { x: 380, y: 890, width: 100, height: 60, isReactorFluid: true },
            { x: 760, y: 890, width: 100, height: 60, isReactorFluid: true },
            { x: 1180, y: 890, width: 100, height: 60, isReactorFluid: true },
            { x: 1580, y: 890, width: 170, height: 60, isReactorFluid: true },
            { x: 2030, y: 890, width: 120, height: 60, isReactorFluid: true },
            { x: 2470, y: 890, width: 130, height: 60, isReactorFluid: true },
            { x: 2950, y: 890, width: 150, height: 60, isReactorFluid: true },
            { x: 3400, y: 890, width: 150, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 430, y1: 200, x2: 430, y2: 460, interval: 1.0, duration: 0.9 },
            { x1: 790, y1: 150, x2: 790, y2: 340, interval: 0.9, duration: 0.9 },
            { x1: 1280, y1: 100, x2: 1280, y2: 400, interval: 0.8, duration: 0.8 },
            { x1: 1750, y1: 150, x2: 1750, y2: 580, interval: 1.0, duration: 1.0 },
            { x1: 2150, y1: 100, x2: 2150, y2: 450, interval: 0.8, duration: 0.8 },
            { x1: 2600, y1: 80, x2: 2600, y2: 320, interval: 0.7, duration: 0.8 },
            { x1: 3100, y1: 150, x2: 3100, y2: 520, interval: 0.9, duration: 0.9 },
            { x1: 3200, y1: 80, x2: 3200, y2: 200, interval: 0.7, duration: 0.8 },
            { x1: 3450, y1: 220, x2: 3450, y2: 400, interval: 0.8, duration: 0.8 },
            { x1: 3800, y1: 500, x2: 3800, y2: 720, interval: 0.9, duration: 0.9 }
        ],
        enemies: [
            { type: 'fighter', x: 430, y: 384, rangeLeft: 430, rangeRight: 510, hp: 80 },      // Fighter Citadel Stair 1
            { type: 'fighter', x: 790, y: 264, rangeLeft: 790, rangeRight: 870, hp: 85 },      // Fighter Citadel Stair 2
            { type: 'fighter', x: 1900, y: 404, rangeLeft: 1900, rangeRight: 1990, hp: 85 },   // Fighter Citadel Spire Stair 3
            { type: 'fighter', x: 2450, y: 284, rangeLeft: 2450, rangeRight: 2530, hp: 90 },   // Fighter Citadel Peak Stair 4
            { type: 'fighter', x: 3200, y: 124, rangeLeft: 3200, rangeRight: 3380, hp: 100 },  // Supreme Citadel Apex Guard
            { type: 'fighter', x: 3450, y: 324, rangeLeft: 3450, rangeRight: 3580, hp: 90 },   // Escape Ramp Gatekeeper
            { type: 'patrol', x: 900, y: 430, rangeLeft: 870, rangeRight: 1140 },
            { type: 'patrol', x: 2200, y: 380, rangeLeft: 2160, rangeRight: 2420 },
            { type: 'patrol', x: 2650, y: 250, rangeLeft: 2610, rangeRight: 2900 },
            { type: 'patrol', x: 3650, y: 650, rangeLeft: 3600, rangeRight: 4100 },
            { type: 'flighter', x: 360, y: 460, rangeY: 35, speed: 1.2, pattern: 'horizontal', rangeX: 80 },
            { type: 'flighter', x: 530, y: 300, rangeY: 40, speed: 1.3, pattern: 'vertical' },
            { type: 'flighter', x: 820, y: 260, rangeY: 40, speed: 1.3, pattern: 'sine', rangeX: 90 },
            { type: 'flighter', x: 1320, y: 150, rangeY: 40, speed: 1.4, pattern: 'hunter' },
            { type: 'flighter', x: 1800, y: 280, rangeY: 45, speed: 1.3, pattern: 'hunter' },
            { type: 'flighter', x: 2220, y: 220, rangeY: 40, speed: 1.4, pattern: 'sine', rangeX: 100 },
            { type: 'flighter', x: 2700, y: 140, rangeY: 45, speed: 1.5, pattern: 'hunter' },
            { type: 'flighter', x: 3250, y: 100, rangeY: 40, speed: 1.5, pattern: 'hunter' },
            { type: 'flighter', x: 3500, y: 260, rangeY: 45, speed: 1.3, pattern: 'sine', rangeX: 110 },
            { type: 'flighter', x: 4200, y: 550, rangeY: 40, speed: 1.4, pattern: 'hunter' }
        ],
        crystals: [
            { x: 360, y: 490 },
            { x: 450, y: 410 },
            { x: 540, y: 330 },
            { x: 820, y: 290 },
            { x: 1920, y: 430 },
            { x: 2020, y: 340 },
            { x: 2470, y: 310 },
            { x: 2560, y: 210 },
            { x: 3240, y: 150 },
            { x: 3340, y: 150 },
            { x: 3500, y: 350 },
            { x: 3700, y: 660 },
            { x: 3900, y: 660 },
            { x: 4100, y: 660 },
            { x: 4300, y: 660 },
            { x: 4500, y: 660 }
        ],
        key: { x: 3250, y: 150 },
        door: { x: 4550, y: 638 },
        checkpoint: { x: 2350, y: 454 }
    }
];

window.LEVELS = LEVELS;
