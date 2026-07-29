/* ==========================================================================
   Shadow Escape - Complete 5 Level Layouts & Perfectly Aligned Entity Positions
   ========================================================================== */

const LEVELS = [
    // --------------------------------------------------------------------------
    // LEVEL 1: TUTORIAL (Facility Security Entrance)
    // --------------------------------------------------------------------------
    {
        id: 1,
        title: "Level 1: Facility Security Entrance",
        subtitle: "Learn the basics: Move, Jump, Double Jump, Collect Key & Escape",
        worldWidth: 1600,
        worldHeight: 800,
        spawn: { x: 80, y: 548 }, // Player height 72 => 548 + 72 = 620 platform top
        platforms: [
            // Base floor sections
            { x: 0, y: 620, width: 500, height: 180 },
            { x: 600, y: 620, width: 450, height: 180 },
            { x: 1150, y: 620, width: 450, height: 180 },

            // Stepping platforms
            { x: 250, y: 500, width: 140, height: 30 },
            { x: 440, y: 410, width: 140, height: 30 },
            { x: 700, y: 490, width: 160, height: 30 },
            { x: 920, y: 380, width: 140, height: 30 },
            { x: 1250, y: 480, width: 180, height: 30 }
        ],
        hazards: [
            { x: 500, y: 720, width: 100, height: 80 },
            { x: 1050, y: 720, width: 100, height: 80 }
        ],
        lasers: [],
        enemies: [
            { type: 'patrol', x: 700, y: 550, rangeLeft: 620, rangeRight: 950 } // Guard height 70 => 550 + 70 = 620
        ],
        crystals: [
            { x: 290, y: 450 },
            { x: 480, y: 360 },
            { x: 770, y: 440 },
            { x: 970, y: 330 },
            { x: 1300, y: 430 }
        ],
        key: { x: 960, y: 330 },
        door: { x: 1450, y: 538 }, // Door height 82 => 538 + 82 = 620
        checkpoint: { x: 650, y: 574 } // Checkpoint height 46 => 574 + 46 = 620
    },

    // --------------------------------------------------------------------------
    // LEVEL 2: STORAGE ROOM (Cargo Bay & Timed Lasers)
    // --------------------------------------------------------------------------
    {
        id: 2,
        title: "Level 2: Cargo Storage Room",
        subtitle: "Timing is key: Timed laser gates & patrolling human security",
        worldWidth: 1800,
        worldHeight: 900,
        spawn: { x: 80, y: 648 }, // 648 + 72 = 720 platform top
        platforms: [
            { x: 0, y: 720, width: 350, height: 180 },
            { x: 420, y: 650, width: 300, height: 250 },
            { x: 800, y: 580, width: 300, height: 320 },
            { x: 1200, y: 720, width: 600, height: 180 },

            // Floating cargo platforms
            { x: 220, y: 520, width: 120, height: 26 },
            { x: 380, y: 390, width: 140, height: 26 },
            { x: 600, y: 320, width: 150, height: 26 },
            { x: 850, y: 420, width: 120, height: 26 },
            { x: 1050, y: 300, width: 140, height: 26 },
            { x: 1320, y: 500, width: 150, height: 26 }
        ],
        hazards: [
            { x: 350, y: 840, width: 70, height: 60 },
            { x: 720, y: 840, width: 80, height: 60 },
            { x: 1100, y: 840, width: 100, height: 60 }
        ],
        lasers: [
            { x1: 380, y1: 420, x2: 380, y2: 650, interval: 2.0, duration: 1.2 },
            { x1: 850, y1: 450, x2: 850, y2: 580, interval: 1.8, duration: 1.0 },
            { x1: 1200, y1: 520, x2: 1200, y2: 720, interval: 1.5, duration: 1.5 }
        ],
        enemies: [
            { type: 'patrol', x: 450, y: 580, rangeLeft: 430, rangeRight: 680 }, // 580 + 70 = 650
            { type: 'patrol', x: 820, y: 510, rangeLeft: 810, rangeRight: 1060 }, // 510 + 70 = 580
            { type: 'drone', x: 650, y: 200, rangeY: 30 }
        ],
        crystals: [
            { x: 260, y: 470 },
            { x: 420, y: 340 },
            { x: 650, y: 270 },
            { x: 890, y: 370 },
            { x: 1100, y: 250 },
            { x: 1370, y: 450 }
        ],
        key: { x: 1090, y: 250 },
        door: { x: 1650, y: 638 }, // 638 + 82 = 720
        checkpoint: { x: 820, y: 534 } // 534 + 46 = 580
    },

    // --------------------------------------------------------------------------
    // LEVEL 3: RESEARCH LABORATORY (Vertical Chambers & Drone Swarms)
    // --------------------------------------------------------------------------
    {
        id: 3,
        title: "Level 3: Research Laboratory",
        subtitle: "Vertical climbing chambers & floating drone sentinels",
        worldWidth: 1600,
        worldHeight: 1200,
        spawn: { x: 80, y: 1008 }, // 1008 + 72 = 1080
        platforms: [
            { x: 0, y: 1080, width: 400, height: 120 },
            { x: 500, y: 980, width: 300, height: 220 },
            { x: 900, y: 1080, width: 700, height: 120 },

            // Vertical climbing layout
            { x: 150, y: 920, width: 140, height: 28 },
            { x: 320, y: 800, width: 140, height: 28 },
            { x: 160, y: 660, width: 150, height: 28 },
            { x: 380, y: 540, width: 160, height: 28 },
            { x: 620, y: 420, width: 150, height: 28 },
            { x: 850, y: 320, width: 180, height: 28 },
            { x: 1100, y: 450, width: 150, height: 28 },
            { x: 1300, y: 600, width: 180, height: 28 },
            { x: 1150, y: 800, width: 160, height: 28 }
        ],
        hazards: [
            { x: 400, y: 1140, width: 100, height: 60, isReactorFluid: false },
            { x: 800, y: 1140, width: 100, height: 60, isReactorFluid: false }
        ],
        lasers: [
            { x1: 320, y1: 830, x2: 320, y2: 980, interval: 2.2, duration: 1.0 },
            { x1: 620, y1: 450, x2: 620, y2: 700, interval: 1.6, duration: 1.2 }
        ],
        enemies: [
            { type: 'drone', x: 250, y: 720, rangeY: 35 },
            { type: 'drone', x: 500, y: 460, rangeY: 45 },
            { type: 'drone', x: 950, y: 240, rangeY: 40 },
            { type: 'patrol', x: 920, y: 1010, rangeLeft: 910, rangeRight: 1400 } // 1010 + 70 = 1080
        ],
        crystals: [
            { x: 190, y: 870 },
            { x: 360, y: 750 },
            { x: 200, y: 610 },
            { x: 420, y: 490 },
            { x: 670, y: 370 },
            { x: 900, y: 270 },
            { x: 1350, y: 550 }
        ],
        key: { x: 900, y: 270 },
        door: { x: 1450, y: 998 }, // 998 + 82 = 1080
        checkpoint: { x: 650, y: 374 } // 374 + 46 = 420
    },

    // --------------------------------------------------------------------------
    // LEVEL 4: REACTOR CORE (Unstable Plasma & Pulsing Grids)
    // --------------------------------------------------------------------------
    {
        id: 4,
        title: "Level 4: Unstable Reactor Core",
        subtitle: "Hazard Warning: Toxic reactor plasma & rapid laser grids",
        worldWidth: 2000,
        worldHeight: 900,
        spawn: { x: 80, y: 648 }, // 648 + 72 = 720
        platforms: [
            { x: 0, y: 720, width: 300, height: 180 },
            { x: 380, y: 620, width: 200, height: 280 },
            { x: 680, y: 520, width: 220, height: 380 },
            { x: 1000, y: 420, width: 250, height: 480 },
            { x: 1350, y: 550, width: 200, height: 350 },
            { x: 1650, y: 720, width: 350, height: 180 },

            // High precision platforms
            { x: 280, y: 480, width: 100, height: 24 },
            { x: 570, y: 380, width: 110, height: 24 },
            { x: 900, y: 300, width: 120, height: 24 },
            { x: 1250, y: 360, width: 110, height: 24 },
            { x: 1520, y: 440, width: 120, height: 24 }
        ],
        hazards: [
            { x: 300, y: 840, width: 1350, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 380, y1: 200, x2: 380, y2: 620, interval: 1.5, duration: 1.0 },
            { x1: 680, y1: 150, x2: 680, y2: 520, interval: 1.4, duration: 1.0 },
            { x1: 1000, y1: 100, x2: 1000, y2: 420, interval: 1.2, duration: 1.2 },
            { x1: 1350, y1: 150, x2: 1350, y2: 550, interval: 1.5, duration: 1.0 }
        ],
        enemies: [
            { type: 'patrol', x: 400, y: 550, rangeLeft: 390, rangeRight: 550 }, // 550 + 70 = 620
            { type: 'patrol', x: 700, y: 450, rangeLeft: 690, rangeRight: 870 }, // 450 + 70 = 520
            { type: 'drone', x: 1100, y: 220, rangeY: 40 },
            { type: 'drone', x: 1420, y: 300, rangeY: 35 }
        ],
        crystals: [
            { x: 310, y: 430 },
            { x: 610, y: 330 },
            { x: 940, y: 250 },
            { x: 1290, y: 310 },
            { x: 1560, y: 390 }
        ],
        key: { x: 940, y: 250 },
        door: { x: 1850, y: 638 }, // 638 + 82 = 720
        checkpoint: { x: 1020, y: 374 } // 374 + 46 = 420
    },

    // --------------------------------------------------------------------------
    // LEVEL 5: FINAL ESCAPE (Security Lockdown Swarm)
    // --------------------------------------------------------------------------
    {
        id: 5,
        title: "Level 5: Final Escape Portal",
        subtitle: "Maximum Lockdown: Dash through drone swarms & active security grids!",
        worldWidth: 2200,
        worldHeight: 900,
        spawn: { x: 80, y: 648 }, // 648 + 72 = 720
        platforms: [
            { x: 0, y: 720, width: 350, height: 180 },
            { x: 450, y: 620, width: 250, height: 280 },
            { x: 800, y: 500, width: 300, height: 400 },
            { x: 1200, y: 400, width: 280, height: 500 },
            { x: 1600, y: 580, width: 250, height: 320 },
            { x: 1900, y: 720, width: 300, height: 180 },

            // Precision dash platforms
            { x: 340, y: 500, width: 100, height: 24 },
            { x: 700, y: 380, width: 100, height: 24 },
            { x: 1100, y: 280, width: 100, height: 24 },
            { x: 1490, y: 440, width: 100, height: 24 }
        ],
        hazards: [
            { x: 350, y: 840, width: 1550, height: 60, isReactorFluid: true }
        ],
        lasers: [
            { x1: 450, y1: 200, x2: 450, y2: 620, interval: 1.2, duration: 1.0 },
            { x1: 800, y1: 150, x2: 800, y2: 500, interval: 1.0, duration: 1.0 },
            { x1: 1200, y1: 100, x2: 1200, y2: 400, interval: 0.9, duration: 0.9 },
            { x1: 1600, y1: 150, x2: 1600, y2: 580, interval: 1.1, duration: 1.0 }
        ],
        enemies: [
            { type: 'drone', x: 380, y: 320, rangeY: 40 },
            { type: 'drone', x: 750, y: 220, rangeY: 45 },
            { type: 'drone', x: 1150, y: 160, rangeY: 40 },
            { type: 'drone', x: 1540, y: 280, rangeY: 45 },
            { type: 'patrol', x: 820, y: 430, rangeLeft: 810, rangeRight: 1060 } // 430 + 70 = 500
        ],
        crystals: [
            { x: 370, y: 450 },
            { x: 730, y: 330 },
            { x: 1130, y: 230 },
            { x: 1520, y: 390 }
        ],
        key: { x: 1130, y: 230 },
        door: { x: 2050, y: 638 }, // 638 + 82 = 720
        checkpoint: { x: 850, y: 454 } // 454 + 46 = 500
    }
];

window.LEVELS = LEVELS;
