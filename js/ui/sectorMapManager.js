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
        this.previewCard = null;
        
        this.animFrameId = null;
        this.isAnimating = false;
        
        this.clearedLevel = 1;
        this.targetLevel = 2;
        this.score = 0;
        this.timeSec = 0;
        this.crystals = 0;
        
        // 5 Levels Configuration
        this.levels = [
            {
                id: 1,
                name: "Green Valley",
                title: "GREEN VALLEY OUTSKIRTS",
                sub: "Peaceful Countryside Village: Bypass security gates and staircase guards.",
                img: "uploads/animation img 1.png",
                xPct: 10,
                yPct: 62
            },
            {
                id: 2,
                name: "Metro Skyline",
                title: "METRO SKYLINE DISTRICT",
                sub: "Futuristic Metropolitan City: Defeat Fighters guarding cargo staircases!",
                img: "uploads/animation img 2.png",
                xPct: 30,
                yPct: 38
            },
            {
                id: 3,
                name: "Power Zone",
                title: "INDUSTRIAL POWER ZONE",
                sub: "Factories & Industrial Area: Clear vertical lab stairs to reach the top!",
                img: "uploads/animation img 3.png",
                xPct: 50,
                yPct: 66
            },
            {
                id: 4,
                name: "Research Core",
                title: "RESEARCH FACILITY CORE",
                sub: "High-Tech Laboratory: Plasma abyss stairs guarded by aggressive Fighters!",
                img: "uploads/animation img 4.png",
                xPct: 70,
                yPct: 38
            },
            {
                id: 5,
                name: "Shadow Nexus",
                title: "SHADOW NEXUS CITADEL",
                sub: "Reactor Core & Final Escape: Grand Citadel stairs guarded by Elite Fighters!",
                img: "uploads/animation img 5.png",
                xPct: 90,
                yPct: 62
            }
        ];

        this.particles = [];
        this.pulseRings = [];
        this.runnerProgress = 0;
        this.runnerStartPos = { x: 0, y: 0 };
        this.runnerEndPos = { x: 0, y: 0 };
        this.runnerControlPos = { x: 0, y: 0 };
        this.calculatedNodePositions = [];
    }

    init() {
        this.modal = document.getElementById('levelClearModal');
        this.canvas = document.getElementById('sectorMapCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.nodesContainer = document.getElementById('sectorNodesContainer');
        this.runnerAvatar = document.getElementById('mapRunnerAvatar');
        this.previewCard = document.getElementById('sectorPreviewCard');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Node hover / click listeners
        this.levels.forEach(lvl => {
            const card = document.getElementById(`sectorNode${lvl.id}`);
            if (card) {
                card.addEventListener('mouseenter', () => {
                    if (window.soundEngine) window.soundEngine.playUIHover();
                    this.updatePreviewCard(lvl.id);
                });
                card.addEventListener('click', () => {
                    if (window.soundEngine) window.soundEngine.playUIClick();
                    this.updatePreviewCard(lvl.id);
                });
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (this.modal && this.modal.classList.contains('active')) {
                this.resizeCanvas();
                this.updateNodePositions();
            }
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

        const timeElem = document.getElementById('levelClearTime');
        if (timeElem) {
            const mins = Math.floor(timeSec / 60).toString().padStart(2, '0');
            const secs = Math.floor(timeSec % 60).toString().padStart(2, '0');
            timeElem.innerText = `${mins}:${secs}`;
        }

        const crysElem = document.getElementById('levelClearCrystals');
        if (crysElem) crysElem.innerText = `+${crystals}`;

        const currNumElem = document.getElementById('levelClearCurrentNum');
        if (currNumElem) currNumElem.innerText = this.clearedLevel.toString();

        const headerTag = document.getElementById('sectorHeaderTag');
        if (headerTag) {
            headerTag.innerText = `SECTOR 0${this.clearedLevel} CLEARED`;
        }

        // Show Modal
        if (this.modal) this.modal.classList.add('active');

        // Play sector clear sound
        if (window.soundEngine) window.soundEngine.playLevelClear();

        // Prepare layout & canvas
        setTimeout(() => {
            this.resizeCanvas();
            this.updateNodePositions();
            this.updateNodeStates();
            this.updatePreviewCard(this.targetLevel);
            this.startRunnerAnimation();
        }, 50);
    }

    resizeCanvas() {
        const wrapper = document.querySelector('.sector-map-wrapper');
        if (!wrapper || !this.canvas) return;

        const rect = wrapper.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        
        if (this.ctx) {
            this.ctx.resetTransform();
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    updateNodePositions() {
        const wrapper = document.querySelector('.sector-map-wrapper');
        if (!wrapper) return;

        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;
        
        this.calculatedNodePositions = [];

        this.levels.forEach(lvl => {
            const px = (lvl.xPct / 100) * width;
            const py = (lvl.yPct / 100) * height;

            this.calculatedNodePositions[lvl.id] = { x: px, y: py };

            const nodeCard = document.getElementById(`sectorNode${lvl.id}`);
            if (nodeCard) {
                nodeCard.style.left = `${px}px`;
                nodeCard.style.top = `${py}px`;
            }
        });
    }

    updateNodeStates() {
        this.levels.forEach(lvl => {
            const card = document.getElementById(`sectorNode${lvl.id}`);
            if (!card) return;

            card.classList.remove('completed', 'target-unlocked', 'locked');

            const badgeIcon = card.querySelector('.node-badge-icon');

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

    updatePreviewCard(lvlId) {
        const lvl = this.levels.find(l => l.id === lvlId) || this.levels[1];
        
        const previewBg = document.getElementById('sectorPreviewBg');
        if (previewBg) previewBg.style.backgroundImage = `url('${lvl.img}')`;

        const previewBadge = document.getElementById('sectorPreviewBadge');
        if (previewBadge) {
            if (lvl.id <= this.clearedLevel) {
                previewBadge.innerText = `SECTOR 0${lvl.id} // CLEARED`;
                previewBadge.style.color = "var(--accent-green)";
            } else if (lvl.id === this.targetLevel) {
                previewBadge.innerText = `NEXT TARGET // SECTOR 0${lvl.id}`;
                previewBadge.style.color = "var(--primary-gold)";
            } else {
                previewBadge.innerText = `RESTRICTED // SECTOR 0${lvl.id}`;
                previewBadge.style.color = "#94a3b8";
            }
        }

        const previewTitle = document.getElementById('sectorPreviewTitle');
        if (previewTitle) previewTitle.innerText = lvl.title;

        const previewSub = document.getElementById('sectorPreviewSub');
        if (previewSub) previewSub.innerText = lvl.sub;
    }

    startRunnerAnimation() {
        if (!this.runnerAvatar || this.calculatedNodePositions.length < 2) return;

        const startNodePos = this.calculatedNodePositions[this.clearedLevel];
        const endNodePos = this.calculatedNodePositions[this.targetLevel] || startNodePos;

        this.runnerStartPos = { ...startNodePos };
        this.runnerEndPos = { ...endNodePos };

        // Control point for smooth bezier arc
        const midX = (startNodePos.x + endNodePos.x) / 2;
        const midY = (startNodePos.y + endNodePos.y) / 2 - 35; // Curve upward
        this.runnerControlPos = { x: midX, y: midY };

        // Initial runner position
        this.updateRunnerAvatarPos(startNodePos.x, startNodePos.y);

        this.runnerProgress = 0;
        this.particles = [];
        this.pulseRings = [];

        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.isAnimating = true;
        
        const startTime = performance.now();
        const duration = 1800; // 1.8 seconds transition animation

        const animateStep = (now) => {
            if (!this.modal || !this.modal.classList.contains('active')) {
                this.isAnimating = false;
                return;
            }

            const elapsed = now - startTime;
            this.runnerProgress = Math.min(1.0, elapsed / duration);

            // Easing function (easeOutCubic)
            const t = this.runnerProgress;
            const easeT = 1 - Math.pow(1 - t, 3);

            // Bezier position calculation
            const rx = (1 - easeT) * (1 - easeT) * this.runnerStartPos.x +
                       2 * (1 - easeT) * easeT * this.runnerControlPos.x +
                       easeT * easeT * this.runnerEndPos.x;

            const ry = (1 - easeT) * (1 - easeT) * this.runnerStartPos.y +
                       2 * (1 - easeT) * easeT * this.runnerControlPos.y +
                       easeT * easeT * this.runnerEndPos.y;

            // Move HTML Runner Avatar
            this.updateRunnerAvatarPos(rx, ry);

            // Spawn trailing particles
            if (Math.random() < 0.7) {
                this.particles.push({
                    x: rx,
                    y: ry,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 - 1,
                    radius: Math.random() * 3 + 1.5,
                    color: Math.random() > 0.4 ? '#10b981' : '#fbbf24',
                    life: 1.0,
                    decay: Math.random() * 0.03 + 0.02
                });
            }

            // Draw map background & paths on canvas
            this.renderCanvas(rx, ry, easeT);

            if (this.runnerProgress < 1.0) {
                this.animFrameId = requestAnimationFrame(animateStep);
            } else {
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
        // Shockwave burst at target node
        const endPos = this.runnerEndPos;
        for (let i = 0; i < 35; i++) {
            const angle = (Math.PI * 2 * i) / 35;
            const speed = Math.random() * 4 + 2;
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

        // Add arrival pulse ring
        this.pulseRings.push({
            x: endPos.x,
            y: endPos.y,
            radius: 10,
            maxRadius: 55,
            opacity: 1.0,
            color: '#fbbf24'
        });

        // Audio feedback
        if (window.soundEngine) {
            window.soundEngine.playDoorUnlock();
        }

        // Start ambient idle render loop
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

        const w = wrapper.clientWidth;
        const h = wrapper.clientHeight;

        this.ctx.clearRect(0, 0, w, h);

        // 1. Draw Connecting Paths between nodes
        for (let i = 1; i < this.levels.length; i++) {
            const p1 = this.calculatedNodePositions[i];
            const p2 = this.calculatedNodePositions[i + 1];

            if (!p1 || !p2) continue;

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2 - 35;

            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);

            if (i < this.clearedLevel) {
                // Completed level path (Glowing Green)
                this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
                this.ctx.lineWidth = 3.5;
                this.ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
                this.ctx.shadowBlur = 10;
                this.ctx.stroke();

                // Traveling pulse dot
                const time = performance.now() * 0.0015 + i;
                const dotT = (time % 1);
                const dotX = (1 - dotT) * (1 - dotT) * p1.x + 2 * (1 - dotT) * dotT * midX + dotT * dotT * p2.x;
                const dotY = (1 - dotT) * (1 - dotT) * p1.y + 2 * (1 - dotT) * dotT * midY + dotT * dotT * p2.y;

                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
                this.ctx.fillStyle = '#34d399';
                this.ctx.shadowColor = '#34d399';
                this.ctx.shadowBlur = 12;
                this.ctx.fill();

            } else if (i === this.clearedLevel && i < 5) {
                // Active transition path (Gradient Green to Gold)
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.lineWidth = 2.5;
                this.ctx.setLineDash([6, 6]);
                this.ctx.stroke();
                this.ctx.setLineDash([]);

                // Draw active energy beam up to current runner position
                const activeGrad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                activeGrad.addColorStop(0, '#10b981');
                activeGrad.addColorStop(1, '#fbbf24');

                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
                this.ctx.strokeStyle = activeGrad;
                this.ctx.lineWidth = 4;
                this.ctx.shadowColor = '#fbbf24';
                this.ctx.shadowBlur = 15;
                this.ctx.stroke();

            } else {
                // Locked path (Dashed Gray)
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.shadowBlur = 0;
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }

        // 2. Render Pulse Rings
        for (let i = this.pulseRings.length - 1; i >= 0; i--) {
            const ring = this.pulseRings[i];
            ring.radius += 1.5;
            ring.opacity -= 0.025;

            if (ring.opacity <= 0) {
                this.pulseRings.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(251, 191, 36, ${ring.opacity})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.shadowColor = ring.color;
            this.ctx.shadowBlur = 15;
            this.ctx.stroke();
        }

        // 3. Render Particles
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
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }
    }
}

// Create global instance
const sectorMapManager = new SectorMapManager();
window.sectorMapManager = sectorMapManager;
