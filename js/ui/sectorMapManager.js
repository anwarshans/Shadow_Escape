/* ==========================================================================
   Shadow Escape - Interactive 5-Level Animated Sector Map Manager
   ========================================================================== */

class SectorMapManager {
    constructor() {
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.nodesContainer = null;
        this.runnerAvatar = null;
        
        this.animFrameId = null;
        this.isAnimating = false;
        
        this.clearedLevel = 1;
        this.targetLevel = 2;
        this.score = 0;
        this.timeSec = 0;
        this.crystals = 0;
        
        // 5 Sector Levels Configuration (Level cards directly positioned at map points)
        this.levels = [
            {
                id: 1,
                name: "GREEN VALLEY",
                title: "GREEN VALLEY OUTSKIRTS",
                diff: "EASY",
                themeColor: "#10b981",
                img: "uploads/animation img 1.png",
                cardX: 20, cardY: 34,
                wpX: 20, wpY: 34
            },
            {
                id: 2,
                name: "METRO SKYLINE",
                title: "METRO SKYLINE DISTRICT",
                diff: "NORMAL",
                themeColor: "#00f3ff",
                img: "uploads/animation img 2.png",
                cardX: 44, cardY: 28,
                wpX: 44, wpY: 28
            },
            {
                id: 3,
                name: "POWER ZONE",
                title: "INDUSTRIAL POWER ZONE",
                diff: "HARD",
                themeColor: "#fbbf24",
                img: "uploads/animation img 3.png",
                cardX: 72, cardY: 34,
                wpX: 72, wpY: 34
            },
            {
                id: 4,
                name: "RESEARCH CORE",
                title: "RESEARCH FACILITY CORE",
                diff: "VERY HARD",
                themeColor: "#a855f7",
                img: "uploads/animation img 4.png",
                cardX: 32, cardY: 72,
                wpX: 32, wpY: 72
            },
            {
                id: 5,
                name: "SHADOW NEXUS",
                title: "SHADOW NEXUS CITADEL",
                diff: "EXTREME",
                themeColor: "#ef4444",
                img: "uploads/animation img 5.png",
                cardX: 82, cardY: 72,
                wpX: 82, wpY: 72
            }
        ];

        this.particles = [];
        this.pulseRings = [];
        this.runnerProgress = 0;
        this.runnerStartPos = { x: 0, y: 0 };
        this.runnerEndPos = { x: 0, y: 0 };
        this.runnerControlPos = { x: 0, y: 0 };
        this.calculatedNodePositions = [];
        this.calculatedWaypoints = [];
    }

    init() {
        this.modal = document.getElementById('levelClearModal');
        this.canvas = document.getElementById('sectorMapCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.nodesContainer = document.getElementById('sectorNodesContainer');
        this.runnerAvatar = document.getElementById('mapRunnerAvatar');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Card hover / click listeners
        this.levels.forEach(lvl => {
            const card = document.getElementById(`sectorNode${lvl.id}`);
            if (card) {
                card.addEventListener('mouseenter', () => {
                    if (window.soundEngine) window.soundEngine.playUIHover();
                });
                card.addEventListener('click', () => {
                    if (window.soundEngine) window.soundEngine.playUIClick();
                });
            }
        });

        // Window resize & orientation change
        const handleResize = () => {
            if (this.modal && this.modal.classList.contains('active')) {
                this.resizeCanvas();
                this.updateNodePositions();
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });
    }

    showSectorMap(clearedLvlId, score = 0, timeSec = 0, crystals = 0) {
        if (!this.modal) this.init();
        
        this.clearedLevel = Math.max(1, Math.min(clearedLvlId, 5));
        this.targetLevel = Math.min(this.clearedLevel + 1, 5);
        this.score = score;
        this.timeSec = timeSec;
        this.crystals = crystals;

        // Update HUD Values
        const scoreElem = document.getElementById('levelClearScore');
        if (scoreElem) scoreElem.innerText = score.toLocaleString();

        const crysElem = document.getElementById('levelClearCrystals');
        if (crysElem) crysElem.innerText = `+${crystals}`;

        // Show Modal
        if (this.modal) this.modal.classList.add('active');

        // Play level clear celebration sound & synthesized Golden Brown x Love Story theme
        if (window.soundEngine) {
            window.soundEngine.playLevelClear();
            setTimeout(() => {
                window.soundEngine.playGoldenBrownLoveStory();
            }, 300);
        }

        // Phase 1: Initialize canvas and trigger Level Cleared Card Pop & Explosion
        setTimeout(() => {
            this.resizeCanvas();
            this.updateNodePositions();
            this.triggerCardClearSequence();
        }, 50);
    }

    triggerCardClearSequence() {
        // Reset all nodes to base states
        this.levels.forEach(lvl => {
            const card = document.getElementById(`sectorNode${lvl.id}`);
            if (!card) return;
            card.classList.remove('completed', 'target-unlocked', 'locked', 'just-cleared-pop');
            const badgeIcon = card.querySelector('.card-badge-overlay');

            if (lvl.id < this.clearedLevel) {
                card.classList.add('completed');
                if (badgeIcon) badgeIcon.innerHTML = '✓';
            } else if (lvl.id === this.clearedLevel) {
                if (badgeIcon) badgeIcon.innerHTML = '0' + lvl.id;
            } else {
                card.classList.add('locked');
                if (badgeIcon) badgeIcon.innerHTML = '🔒';
            }
        });

        // Trigger Pop Animation on the Cleared Level Card
        const clearedCard = document.getElementById(`sectorNode${this.clearedLevel}`);
        const clearedWp = this.calculatedWaypoints[this.clearedLevel];

        if (clearedCard) {
            clearedCard.classList.add('just-cleared-pop');
            const badgeIcon = clearedCard.querySelector('.card-badge-overlay');
            if (badgeIcon) badgeIcon.innerHTML = '✓';
        }

        // Set initial standing pose on cleared waypoint
        if (this.runnerAvatar) {
            const img = this.runnerAvatar.querySelector('img');
            if (img) img.src = 'uploads/player_stand.png';
            if (clearedWp) this.updateRunnerAvatarPos(clearedWp.x, clearedWp.y);
        }

        // Spawn Sparkle Burst & Shockwave Rings on cleared waypoint
        if (clearedWp) {
            for (let i = 0; i < 45; i++) {
                const angle = (Math.PI * 2 * i) / 45;
                const speed = Math.random() * 5 + 2.5;
                this.particles.push({
                    x: clearedWp.x,
                    y: clearedWp.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: Math.random() * 4.5 + 2,
                    color: i % 2 === 0 ? '#10b981' : '#34d399',
                    life: 1.0,
                    decay: Math.random() * 0.02 + 0.015
                });
            }

            this.pulseRings.push({
                x: clearedWp.x,
                y: clearedWp.y,
                radius: 10,
                maxRadius: 75,
                opacity: 1.0,
                color: '#10b981'
            });
        }

        // Phase 2: Energize path & Unlock Target Level (after 800ms pop)
        setTimeout(() => {
            if (clearedCard) {
                clearedCard.classList.remove('just-cleared-pop');
                clearedCard.classList.add('completed');
            }

            const targetCard = document.getElementById(`sectorNode${this.targetLevel}`);
            if (targetCard && this.targetLevel !== this.clearedLevel) {
                targetCard.classList.remove('locked');
                targetCard.classList.add('target-unlocked');
            }

            // Phase 3: Start Runner Animation along energized path (after 1200ms)
            setTimeout(() => {
                this.startRunnerAnimation();
            }, 400);

        }, 800);
    }

    resizeCanvas() {
        const wrapper = document.querySelector('.sector-map-wrapper');
        if (!wrapper || !this.canvas) return;

        const w = Math.max(wrapper.clientWidth, wrapper.scrollWidth);
        const h = wrapper.clientHeight;
        this.canvas.width = w * window.devicePixelRatio;
        this.canvas.height = h * window.devicePixelRatio;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        
        if (this.ctx) {
            this.ctx.resetTransform();
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    updateNodePositions() {
        const wrapper = document.querySelector('.sector-map-wrapper');
        if (!wrapper) return;

        const width = Math.max(wrapper.clientWidth, wrapper.scrollWidth);
        const height = wrapper.clientHeight;
        
        this.calculatedNodePositions = [];
        this.calculatedWaypoints = [];

        this.levels.forEach(lvl => {
            const cardPx = (lvl.cardX / 100) * width;
            const cardPy = (lvl.cardY / 100) * height;

            const wpPx = (lvl.wpX / 100) * width;
            const wpPy = (lvl.wpY / 100) * height;

            this.calculatedNodePositions[lvl.id] = { x: cardPx, y: cardPy };
            this.calculatedWaypoints[lvl.id] = { x: wpPx, y: wpPy };

            const nodeCard = document.getElementById(`sectorNode${lvl.id}`);
            if (nodeCard) {
                nodeCard.style.left = `${cardPx}px`;
                nodeCard.style.top = `${cardPy}px`;
            }
        });

        // Sync current runner avatar position when not actively mid-animation
        const currentTargetWp = this.calculatedWaypoints[this.targetLevel] || this.calculatedWaypoints[this.clearedLevel];
        if (currentTargetWp) {
            this.runnerEndPos = { ...currentTargetWp };
            if (!this.isAnimating && this.runnerAvatar) {
                this.updateRunnerAvatarPos(currentTargetWp.x, currentTargetWp.y);
            }
        }
    }

    updateNodeStates() {
        this.levels.forEach(lvl => {
            const card = document.getElementById(`sectorNode${lvl.id}`);
            if (!card) return;

            card.classList.remove('completed', 'target-unlocked', 'locked');

            const badgeIcon = card.querySelector('.card-badge-overlay');

            if (lvl.id <= this.clearedLevel) {
                card.classList.add('completed');
                if (badgeIcon) badgeIcon.innerHTML = '✓';
            } else if (lvl.id === this.targetLevel) {
                card.classList.add('target-unlocked');
                if (badgeIcon) badgeIcon.innerHTML = `0${lvl.id}`;
            } else {
                card.classList.add('locked');
                if (badgeIcon) badgeIcon.innerHTML = `🔒`;
            }
        });
    }

    startRunnerAnimation() {
        if (!this.runnerAvatar || this.calculatedWaypoints.length < 2) return;

        const startWpPos = this.calculatedWaypoints[this.clearedLevel];
        const endWpPos = this.calculatedWaypoints[this.targetLevel] || startWpPos;

        this.runnerStartPos = { ...startWpPos };
        this.runnerEndPos = { ...endWpPos };

        // Control point for smooth bezier curve matching path arc across continents
        const midX = (startWpPos.x + endWpPos.x) / 2;
        const midY = (startWpPos.y + endWpPos.y) / 2 - 20;
        this.runnerControlPos = { x: midX, y: midY };

        // Initial runner position
        this.updateRunnerAvatarPos(startWpPos.x, startWpPos.y);

        this.runnerProgress = 0;
        this.particles = [];
        this.pulseRings = [];

        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.isAnimating = true;
        
        const startTime = performance.now();
        const duration = 3400; // 3.4 seconds smooth, professional transition

        const runSprites = [
            'uploads/player_run1.png',
            'uploads/player_run2.png',
            'uploads/player_run3.png',
            'uploads/player run 4.png',
            'uploads/player run 5.png',
            'uploads/player run 6.png'
        ];

        const animateStep = (now) => {
            if (!this.modal || !this.modal.classList.contains('active')) {
                this.isAnimating = false;
                return;
            }

            const elapsed = now - startTime;
            this.runnerProgress = Math.min(1.0, elapsed / duration);

            // Silky Smooth Easing (easeInOutCubic)
            const t = this.runnerProgress;
            const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            // Bezier position calculation
            const rx = (1 - easeT) * (1 - easeT) * this.runnerStartPos.x +
                       2 * (1 - easeT) * easeT * this.runnerControlPos.x +
                       easeT * easeT * this.runnerEndPos.x;

            const ry = (1 - easeT) * (1 - easeT) * this.runnerStartPos.y +
                       2 * (1 - easeT) * easeT * this.runnerControlPos.y +
                       easeT * easeT * this.runnerEndPos.y;

            // Dynamic running sprite animation frame while moving
            if (this.runnerAvatar) {
                const img = this.runnerAvatar.querySelector('img');
                if (img) {
                    const frameIdx = Math.floor(elapsed / 110) % runSprites.length;
                    img.src = runSprites[frameIdx];
                }
            }

            // Move HTML Runner Avatar
            this.updateRunnerAvatarPos(rx, ry);

            // Spawn trailing glow particles along path
            if (Math.random() < 0.85) {
                this.particles.push({
                    x: rx,
                    y: ry,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 2.5 - 1,
                    radius: Math.random() * 3.5 + 1.8,
                    color: Math.random() > 0.4 ? '#10b981' : '#fbbf24',
                    life: 1.0,
                    decay: Math.random() * 0.02 + 0.015
                });
            }

            // Draw map background & paths on canvas
            this.renderCanvas(rx, ry, easeT);

            if (this.runnerProgress < 1.0) {
                this.animFrameId = requestAnimationFrame(animateStep);
            } else {
                if (this.runnerAvatar) {
                    const img = this.runnerAvatar.querySelector('img');
                    if (img) img.src = 'uploads/player_stand.png';
                }
                this.onRunnerArrived();
            }
        };

        this.animFrameId = requestAnimationFrame(animateStep);
    }

    updateRunnerAvatarPos(x, y) {
        if (!this.runnerAvatar) return;
        this.runnerAvatar.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    onRunnerArrived() {
        const endPos = this.runnerEndPos;
        for (let i = 0; i < 40; i++) {
            const angle = (Math.PI * 2 * i) / 40;
            const speed = Math.random() * 4.5 + 2;
            this.particles.push({
                x: endPos.x,
                y: endPos.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: i % 2 === 0 ? '#fbbf24' : '#34d399',
                life: 1.0,
                decay: Math.random() * 0.025 + 0.015
            });
        }

        this.pulseRings.push({
            x: endPos.x,
            y: endPos.y,
            radius: 8,
            maxRadius: 65,
            opacity: 1.0,
            color: '#fbbf24'
        });

        if (window.soundEngine) {
            window.soundEngine.playDoorUnlock();
        }

        this.startAmbientLoop();
    }

    startAmbientLoop() {
        const ambientStep = () => {
            if (!this.modal || !this.modal.classList.contains('active')) return;
            this.renderCanvas(this.runnerEndPos.x, this.runnerEndPos.y, 1.0);
            this.animFrameId = requestAnimationFrame(ambientStep);
        };
        this.animFrameId = requestAnimationFrame(ambientStep);
    }

    renderCanvas(currentRunnerX, currentRunnerY, transitionProgress) {
        if (!this.ctx || !this.canvas) return;

        const wrapper = document.querySelector('.sector-map-wrapper');
        if (!wrapper) return;

        const w = Math.max(wrapper.clientWidth, wrapper.scrollWidth);
        const h = wrapper.clientHeight;

        this.ctx.clearRect(0, 0, w, h);

        // --- 0. Render Tactical Radar Scanning Line Across Background ---
        const scanTime = performance.now() * 0.0005;
        const scanY = (scanTime % 1) * h;
        this.ctx.save();
        const scanGrad = this.ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
        scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        this.ctx.fillStyle = scanGrad;
        this.ctx.fillRect(0, scanY - 15, w, 30);
        this.ctx.restore();

        // --- 1. Render Glowing Region Map Halos for Each Waypoint ---
        this.levels.forEach(lvl => {
            const wp = this.calculatedWaypoints[lvl.id];
            if (!wp) return;

            const glowGrad = this.ctx.createRadialGradient(wp.x, wp.y, 5, wp.x, wp.y, 110);
            glowGrad.addColorStop(0, `${lvl.themeColor}50`);
            glowGrad.addColorStop(0.5, `${lvl.themeColor}18`);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = glowGrad;
            this.ctx.beginPath();
            this.ctx.arc(wp.x, wp.y, 110, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // --- 2. Render Supercharged Dotted Bezier Energy Paths between Waypoints ---
        for (let i = 1; i < this.levels.length; i++) {
            const wp1 = this.calculatedWaypoints[i];
            const wp2 = this.calculatedWaypoints[i + 1];
            const lvl1 = this.levels[i - 1];
            const lvl2 = this.levels[i];

            if (!wp1 || !wp2) continue;

            const midX = (wp1.x + wp2.x) / 2;
            const midY = (wp1.y + wp2.y) / 2 - 20;

            // Draw Outer Neon Under-Glow for Completed Paths
            if (i <= this.clearedLevel) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.moveTo(wp1.x, wp1.y);
                this.ctx.quadraticCurveTo(midX, midY, wp2.x, wp2.y);
                this.ctx.strokeStyle = lvl1.themeColor;
                this.ctx.lineWidth = 7;
                this.ctx.globalAlpha = 0.25;
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Draw Base Dotted Energy Arc
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(wp1.x, wp1.y);
            this.ctx.quadraticCurveTo(midX, midY, wp2.x, wp2.y);

            const pathColor = i <= this.clearedLevel ? lvl1.themeColor : 'rgba(255, 255, 255, 0.2)';
            this.ctx.strokeStyle = pathColor;
            this.ctx.lineWidth = 3.5;
            this.ctx.setLineDash([8, 8]);

            if (i <= this.clearedLevel && !window.gamePerformanceMode) {
                this.ctx.shadowColor = pathColor;
                this.ctx.shadowBlur = 16;
            }

            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.restore();

            // High-Speed Traveling Photon Pulses along completed/active path
            if (i <= this.clearedLevel) {
                for (let pIdx = 0; pIdx < 2; pIdx++) {
                    const time = performance.now() * 0.0014 + i * 1.5 + pIdx * 0.5;
                    const dotT = (time % 1);
                    const dotX = (1 - dotT) * (1 - dotT) * wp1.x + 2 * (1 - dotT) * dotT * midX + dotT * dotT * wp2.x;
                    const dotY = (1 - dotT) * (1 - dotT) * wp1.y + 2 * (1 - dotT) * dotT * midY + dotT * dotT * wp2.y;

                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#ffffff';
                    if (!window.gamePerformanceMode) {
                        this.ctx.shadowColor = lvl1.themeColor;
                        this.ctx.shadowBlur = 18;
                    }
                    this.ctx.fill();
                    this.ctx.restore();
                }
            }
        }

        // --- 3. Render Circular Target Waypoint Rings (◯) ---
        this.levels.forEach(lvl => {
            const wp = this.calculatedWaypoints[lvl.id];
            if (!wp) return;

            // Outer Glow Circle
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(wp.x, wp.y, 13, 0, Math.PI * 2);
            this.ctx.strokeStyle = lvl.themeColor;
            this.ctx.lineWidth = 3;
            if (!window.gamePerformanceMode) {
                this.ctx.shadowColor = lvl.themeColor;
                this.ctx.shadowBlur = 18;
            }
            this.ctx.stroke();

            // Inner Core White Dot
            this.ctx.beginPath();
            this.ctx.arc(wp.x, wp.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
            this.ctx.restore();
        });

        // --- 4. Render Shockwave Pulse Rings ---
        for (let i = this.pulseRings.length - 1; i >= 0; i--) {
            const ring = this.pulseRings[i];
            ring.radius += 1.8;
            ring.opacity -= 0.022;

            if (ring.opacity <= 0) {
                this.pulseRings.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(251, 191, 36, ${ring.opacity})`;
            this.ctx.lineWidth = 2.8;
            this.ctx.shadowColor = ring.color;
            this.ctx.shadowBlur = 16;
            this.ctx.stroke();
        }

        // --- 5. Render Particles ---
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.max(0.5, p.radius * p.life), 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 9;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }
    }
}

// Create global instance
const sectorMapManager = new SectorMapManager();
window.sectorMapManager = sectorMapManager;
