# Shadow Escape ⚡ (2.5D Cyber Platformer Game)

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-purple.svg)]()
[![Rendering](https://img.shields.io/badge/Engine-2.5D%20Canvas%20Renderer-ff007f.svg)]()

**Shadow Escape** is a polished, high-performance 2.5D browser platformer adventure game built strictly with **HTML5 Canvas, CSS3, and Vanilla JavaScript (ES6+)**—with zero external game engines (No Phaser, Unity, or Godot). Designed specifically to showcase high-level software engineering, custom canvas rendering, physics systems, Web Audio API synthesis, and responsive mobile/laptop UX for developer portfolios hosted on GitHub and Vercel.

---

## 🌟 Game Story

You wake up inside Sector 7 of an abandoned subterranean research laboratory after a quantum experiment containment breach. Facility security protocols are active, automated sentry drones and patrol bots roam the sectors, laser grids block corridors, and the reactor core is critical. You must utilize your suit's high-speed thrusters to double jump, dash through laser barriers, collect energy crystals, acquire security keycards, and unlock escape portals through 5 increasingly intense levels.

---

## 🎮 Game Features

- **2.5D Pseudo-3D Graphics**: Custom block projection rendering with top, front, and shaded side faces, drop shadows, dynamic neon light emission, and multi-layer depth parallax grid.
- **Fluid Movement Mechanics**: Smooth horizontal acceleration, variable jump height, double jump thrusters, and invulnerable dash with neon ghosting trails.
- **Dynamic Laser & Hazard Systems**: Pulsing laser gates, moving laser grids, spikes, and toxic reactor plasma basins.
- **AI Enemies**: Ground Patrol Sentries with red laser vision cones and Flying Security Drones with hover sine animations.
- **5 Complete Stages**:
  1. *Tutorial (Facility Security Entrance)*
  2. *Storage Room (Cargo Bay & Timed Lasers)*
  3. *Research Laboratory (Drone Chambers & Vertical Platforming)*
  4. *Reactor Core (Reactor Pulse & Moving Lasers)*
  5. *Final Escape (Security Lockdown Swarm & Rapid Dash)*
- **Audio Synthesizer**: Pure Web Audio API sound generator producing retro sci-fi SFX (Jump, Dash, Crystal Collect, Laser Hum, Hurt, Explosion, Gate Unlock) and ambient synthwave background loops.
- **Dual Input System**: Full laptop/desktop keyboard controls alongside an automatic responsive mobile touch control overlay (Virtual D-Pad & Touch Action Buttons).
- **LocalStorage State**: High scores, total energy crystals, speedrun stage times, and level unlock progression saved automatically.

---

## ⌨️ Controls

| Action | Laptop / Desktop | Mobile / Tablet Touch |
| :--- | :--- | :--- |
| **Move Left / Right** | `A` / `D` or `Left` / `Right` Arrow | Touch **◄** / **►** Buttons |
| **Jump / Double Jump**| `W` / `Up Arrow` / `Spacebar` | Touch **▲** Jump Button |
| **Invulnerable Dash** | `Left Shift` / `Right Shift` / `K` | Touch **⚡** Dash Button |
| **Pause Game** | `P` / `Escape` | Pause Menu Button |

---

## 📁 Project Architecture & Folder Structure

```text
shadow-escape/
│
├── index.html            # Main Menu & Cyber Landing Page
├── play.html             # Main Game Canvas & HUD Viewport
├── about.html            # Story, Controls & Tech Overview
├── leaderboard.html      # Local High Scores & Speedrun Records
├── contact.html          # Portfolio Contact Form
│
├── css/
│   ├── main.css          # Core Design System, Palette & Variables
│   ├── components.css    # Cyber Buttons, Modals, Stat Cards
│   └── game.css          # Canvas Layout, HUD Overlay & Touch Controls
│
├── js/
│   ├── storage.js        # LocalStorage Manager
│   ├── engine/
│   │   ├── audio.js      # Web Audio API Synth (SFX & Ambient BGM)
│   │   ├── camera.js     # Smooth Lerp Camera & 3D Screen Shake
│   │   ├── input.js      # Keyboard & Mobile Touch Listener
│   │   ├── physics.js    # AABB Collisions & Raycast Line Detection
│   │   └── particles.js  # Jump Dust, Dash Ghosting & Explosion FX
│   ├── game/
│   │   ├── renderer2D3D.js # 2.5D Pseudo-3D Platform Block Extruder
│   │   ├── player.js       # Player Physics, Abilities & Rendering
│   │   ├── enemy.js        # Patrol Bots & Flying Drones AI
│   │   ├── traps.js        # Timed Lasers & Plasma Hazards
│   │   ├── collectibles.js # 3D Crystals, Keycards & Exit Doors
│   │   ├── levelData.js    # Map Layouts for 5 Complete Stages
│   │   └── gameEngine.js   # 60 FPS Core Game Loop & State Handler
│   └── ui/
│       └── uiManager.js    # In-Game HUD Sync & Modal Controllers
│
├── robots.txt            # Search Engine Directives
├── sitemap.xml           # XML Sitemap
├── manifest.json         # PWA Web Application Manifest
└── README.md             # Developer Portfolio Documentation
```

---

## 🚀 Installation & Local Execution

No build step or external package manager required!

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/shadow-escape.git
   ```
2. Open `index.html` or `play.html` directly in any web browser, or serve using WAMP/XAMPP/Live Server:
   - **Local Web Server**: Serve from `http://localhost/shadow-escape/` or run `npx serve .`

---

## 🛠️ Technology Highlights & Optimization

- **Zero Asset Latency**: Built-in Web Audio API synth means sound effects play instantly without standard external `.mp3`/`.wav` network request delay or CORS issues.
- **Fixed Delta Time**: Smooth 60 FPS update loop handles varying monitor refresh rates (60Hz, 120Hz, 144Hz) consistently.
- **High-DPI Canvas**: Automatically scales canvas display rendering crisp text and neon visual effects on retina displays.

---

## 👤 Author & Portfolio Showcase

- **Developer**: Professional Software Engineer
- **Deployment Ready**: Optimized for hosting on GitHub Pages, Vercel, and Netlify.
