/* ==========================================================================
   Shadow Escape - UI Manager (HUD, Modals & Navigation)
   ========================================================================== */

const STORY_BRIEFINGS = {
    1: "Agent Shanu has breached the outer perimeter of Green Valley Outskirts. Security fighters patrol the staircase landing towers. Retrieve the encryption keycard to unlock the facility entrance.",
    2: "Deep within Metro Skyline District, high-tech lasers and rooftop fighters guard the cargo transports. Obtain the keycard to infiltrate the inner city.",
    3: "Industrial Power Zone: Toxic reactor channels and lab staircase guardians protect the main energy grid. Clear the vertical staircase shaft to reach the peak containment tower.",
    4: "Research Facility Core: Plasma abyss staircases are locked down by aggressive defense forces. Maintain flight fuel, grab the master keycard, and execute emergency extraction.",
    5: "Shadow Nexus: The ultimate stronghold of shadow command. Defeat elite staircase guardians, unlock the master door, and achieve final victory!"
};

class UIManager {
    constructor() {
        this.hudHealthFill = null;
        this.hudFuelFill = null;
        this.hudCrystalsVal = null;
        this.hudKeyIndicator = null;
        this.hudLevelTitle = null;
        this.hudTimerVal = null;
        this.hudScoreVal = null;

        this.pauseModal = null;
        this.gameOverModal = null;
        this.levelClearModal = null;
        this.victoryModal = null;

        this.seenLevelIntros = new Set();
        this.pendingIntro = null;

        this.lastHudState = {
            hpPct: -1,
            fuelPct: -1,
            crystalsText: '',
            hasKey: null,
            levelId: -1,
            timerText: '',
            scoreText: ''
        };
    }

    init() {
        this.hudHealthFill = document.getElementById('hudHealthFill');
        this.hudFuelFill = document.getElementById('hudFuelFill');
        this.hudCrystalsVal = document.getElementById('hudCrystalsVal');
        this.hudKeyIndicator = document.getElementById('hudKeyIndicator');
        this.hudLevelTitle = document.getElementById('hudLevelTitle');
        this.hudTimerVal = document.getElementById('hudTimerVal');
        this.hudScoreVal = document.getElementById('hudScoreVal');

        this.pauseModal = document.getElementById('pauseModal');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.levelClearModal = document.getElementById('levelClearModal');
        this.victoryModal = document.getElementById('victoryModal');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add global button click & hover SFX listeners
        document.body.addEventListener('click', (e) => {
            if (window.soundEngine) {
                window.soundEngine.ensureContext();
                if (window.soundEngine.isPlayingHomeBGM === false && window.soundEngine.isPlayingBGM === false) {
                    const homeView = document.getElementById('homeView');
                    if (homeView && homeView.style.display !== 'none') {
                        window.soundEngine.startHomeBGM();
                    }
                }
            }

            const target = e.target.closest('button, .nav-link, a, .poster-play-btn, .poster-secondary-btn, .modal-close');
            if (target && window.soundEngine) {
                window.soundEngine.playUIClick();
            }
        });

        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('button, .nav-link, .poster-play-btn, .poster-secondary-btn');
            if (target && window.soundEngine && !target.dataset.hovered) {
                window.soundEngine.playUIHover();
                target.dataset.hovered = 'true';
                setTimeout(() => { delete target.dataset.hovered; }, 200);
            }
        });

        // Pause Modal Buttons
        const btnResume = document.getElementById('btnResume');
        if (btnResume) btnResume.addEventListener('click', () => window.gameEngine.togglePause());

        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) btnRestart.addEventListener('click', () => {
            this.hideAllModals();
            window.gameEngine.loadLevel(window.gameEngine.currentLevelId);
        });

        // Game Over Restart
        const btnGameOverRestart = document.getElementById('btnGameOverRestart');
        if (btnGameOverRestart) btnGameOverRestart.addEventListener('click', () => {
            this.hideAllModals();
            window.gameEngine.loadLevel(window.gameEngine.currentLevelId);
        });

        // Level Clear Next Stage
        const btnNextLevel = document.getElementById('btnNextLevel');
        if (btnNextLevel) btnNextLevel.addEventListener('click', () => {
            this.hideAllModals();
            const maxLvl = (window.LEVELS && window.LEVELS.length) ? window.LEVELS.length : 5;
            const nextLvl = window.gameEngine.currentLevelId + 1;
            if (nextLvl > maxLvl) {
                window.gameEngine.loadLevel(1);
            } else {
                window.gameEngine.loadLevel(nextLvl);
            }
        });

        // Replay Level Sector
        const btnReplaySector = document.getElementById('btnReplaySector');
        if (btnReplaySector) btnReplaySector.addEventListener('click', () => {
            this.hideAllModals();
            window.gameEngine.loadLevel(window.gameEngine.currentLevelId);
        });

        // Victory Modal Buttons
        const btnVictoryPlayAgain = document.getElementById('btnVictoryPlayAgain');
        if (btnVictoryPlayAgain) btnVictoryPlayAgain.addEventListener('click', () => {
            this.hideAllModals();
            window.gameEngine.loadLevel(1);
        });

        const btnVictoryLeaderboard = document.getElementById('btnVictoryLeaderboard');
        if (btnVictoryLeaderboard) btnVictoryLeaderboard.addEventListener('click', () => {
            this.openedLeaderboardFromVictory = true;
            if (typeof window.openModal === 'function') {
                window.openModal('modalLeaderboard');
            }
            if (this.victoryModal) this.victoryModal.classList.remove('active');
        });

        // Mobile Nav Toggle
        const navToggle = document.getElementById('mobileNavToggle');
        const navLinks = document.getElementById('navLinks');
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('open');
                navToggle.classList.toggle('active', isOpen);
                navToggle.innerHTML = isOpen ? '✕' : '☰';
            });
        }
    }

    updateHUD(engine) {
        if (!engine.player) return;

        // Health Bar
        if (this.hudHealthFill) {
            const pct = Math.round(Math.max(0, (engine.player.hp / engine.player.maxHp) * 100));
            if (pct !== this.lastHudState.hpPct) {
                this.hudHealthFill.style.width = `${pct}%`;
                this.lastHudState.hpPct = pct;
            }
        }

        // Flight Fuel Bar
        if (this.hudFuelFill) {
            const fuelPct = Math.round(Math.max(0, (engine.player.flightFuel / engine.player.maxFlightFuel) * 100));
            if (fuelPct !== this.lastHudState.fuelPct) {
                this.hudFuelFill.style.width = `${fuelPct}%`;
                this.lastHudState.fuelPct = fuelPct;
            }
        }

        // Crystals Counter
        if (this.hudCrystalsVal) {
            const cText = `${engine.crystalsCollected}/${engine.totalCrystalsInLevel}`;
            if (cText !== this.lastHudState.crystalsText) {
                this.hudCrystalsVal.innerText = cText;
                this.lastHudState.crystalsText = cText;
            }
        }

        // Key Indicator
        if (this.hudKeyIndicator && engine.hasKey !== this.lastHudState.hasKey) {
            if (engine.hasKey) {
                this.hudKeyIndicator.classList.add('acquired');
            } else {
                this.hudKeyIndicator.classList.remove('acquired');
            }
            this.lastHudState.hasKey = engine.hasKey;
        }

        // Level Indicator (LEVEL 1, LEVEL 2...)
        if (engine.currentLevelId && engine.currentLevelId !== this.lastHudState.levelId) {
            if (this.hudLevelNum) this.hudLevelNum.innerText = engine.currentLevelId;
            else if (this.hudLevelTitle) {
                this.hudLevelTitle.innerHTML = `<span class="lvl-label">LEVEL</span><span class="lvl-num">${engine.currentLevelId}</span>`;
            }
            this.lastHudState.levelId = engine.currentLevelId;
        }

        // Timer Display
        if (this.hudTimerVal) {
            const mins = Math.floor(engine.levelTimer / 60).toString().padStart(2, '0');
            const secs = Math.floor(engine.levelTimer % 60).toString().padStart(2, '0');
            const tText = `${mins}:${secs}`;
            if (tText !== this.lastHudState.timerText) {
                this.hudTimerVal.innerText = tText;
                this.lastHudState.timerText = tText;
            }
        }

        // Score
        if (this.hudScoreVal) {
            const sText = engine.score.toString();
            if (sText !== this.lastHudState.scoreText) {
                this.hudScoreVal.innerText = sText;
                this.lastHudState.scoreText = sText;
            }
        }
    }

    showPauseModal(show) {
        if (this.pauseModal) {
            if (show) this.pauseModal.classList.add('active');
            else this.pauseModal.classList.remove('active');
        }
    }

    showGameOverModal() {
        if (this.gameOverModal) this.gameOverModal.classList.add('active');
    }

    showLevelClearModal(levelId, score) {
        const timeSec = window.gameEngine ? Math.floor(window.gameEngine.levelTimer) : 0;
        const crystals = window.gameEngine ? window.gameEngine.crystalsCollected : 0;

        if (window.sectorMapManager) {
            window.sectorMapManager.showSectorMap(levelId, score, timeSec, crystals);
        } else {
            const scoreElem = document.getElementById('levelClearScore');
            if (scoreElem) scoreElem.innerText = score.toString();
            if (this.levelClearModal) this.levelClearModal.classList.add('active');
        }
    }

    showVictoryModal(totalScore = 0) {
        if (!this.victoryModal) this.victoryModal = document.getElementById('victoryModal');
        if (!this.victoryModal) return;

        this.victoryModal.classList.add('active');

        // Trigger Landing Shockwave Burst on Hero Run-In
        const shockwave = document.getElementById('victoryShockwave');
        if (shockwave) {
            shockwave.classList.remove('burst');
            void shockwave.offsetWidth; // trigger reflow
            setTimeout(() => shockwave.classList.add('burst'), 250);
        }

        // Reset S-Rank stamp
        const rankStamp = document.getElementById('victoryRankStamp');
        if (rankStamp) rankStamp.classList.remove('stamped');

        // Setup 3D Interactive Parallax Tilt Effect
        this.setupVictoryParallaxTilt();

        // Play grand celebratory audio fanfare
        if (window.soundEngine) {
            if (typeof window.soundEngine.playGrandVictory === 'function') {
                window.soundEngine.playGrandVictory();
            } else if (typeof window.soundEngine.playLevelClear === 'function') {
                window.soundEngine.playLevelClear();
            }
        }

        // Start High-Graphics Video-style Particle & Coin Physics Canvas
        this.startVictoryParticleCanvas();

        // Animate Score Counting Up & Trigger Rank Stamp
        this.animateVictoryScore(totalScore);
    }

    setupVictoryParallaxTilt() {
        const heroWrapper = document.getElementById('heroCharacterWrapper');
        const heroContainer = document.getElementById('victoryHeroContainer');
        const bottomDock = document.getElementById('victoryBottomDock');
        if (!this.victoryModal || !heroContainer) return;

        const handleMove = (e) => {
            if (!this.victoryModal || !this.victoryModal.classList.contains('active')) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (clientX - cx) / cx; // -1 to 1
            const dy = (clientY - cy) / cy; // -1 to 1

            const tiltX = -dy * 10; // deg
            const tiltY = dx * 12;  // deg

            if (heroWrapper) {
                heroWrapper.style.transform = `scale(1) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(30px)`;
            }
            if (bottomDock) {
                bottomDock.style.transform = `translateY(0) rotateX(${tiltX * 0.3}deg) rotateY(${tiltY * 0.3}deg)`;
            }
        };

        const handleReset = () => {
            if (heroWrapper) heroWrapper.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            if (bottomDock) bottomDock.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
        };

        this.victoryModal.addEventListener('mousemove', handleMove);
        this.victoryModal.addEventListener('touchmove', handleMove);
        this.victoryModal.addEventListener('mouseleave', handleReset);
        this.victoryModal.addEventListener('touchend', handleReset);
    }

    startVictoryParticleCanvas() {
        const canvas = document.getElementById('victoryCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Multi-Layer Physics Particles Array (Confetti, Stars, Sparks & 3D Spinning Coins)
        const particles = [];
        const coins = [];
        const fireworks = [];

        const colors = ['#fbbf24', '#fef08a', '#d97706', '#ffffff', '#06b6d4', '#38bdf8', '#ef4444', '#10b981'];

        // Initial Explosive Confetti Burst from Left & Right Corners
        const createCannonBurst = (originX, originY, count = 60) => {
            for (let i = 0; i < count; i++) {
                const angle = (originX < width / 2 ? -Math.PI / 4 : -3 * Math.PI / 4) + (Math.random() - 0.5) * 0.8;
                const speed = Math.random() * 16 + 8;
                particles.push({
                    x: originX,
                    y: originY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 10 + 4,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 12,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.random() > 0.3 ? 'rect' : 'star',
                    opacity: 1,
                    decay: Math.random() * 0.005 + 0.002,
                    gravity: 0.22,
                    friction: 0.98
                });
            }
        };

        // Cannon Bursts from bottom corners
        createCannonBurst(50, height - 50, 70);
        createCannonBurst(width - 50, height - 50, 70);

        // Continuous Ambient Golden Dust Particles
        const particleCount = Math.min(80, Math.floor(width / 12));
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2 - 1,
                size: Math.random() * 6 + 2,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'circle' : 'rect',
                opacity: Math.random() * 0.7 + 0.3,
                gravity: 0,
                friction: 1
            });
        }

        // 3D Spinning Gold Coins physics layer
        for (let i = 0; i < 16; i++) {
            coins.push({
                x: width * 0.2 + Math.random() * (width * 0.6),
                y: height * 0.2 + Math.random() * (height * 0.5),
                vy: (Math.random() - 0.5) * 1.2,
                radius: Math.random() * 14 + 10,
                scaleX: Math.random(),
                flipSpeed: Math.random() * 0.08 + 0.04,
                opacity: Math.random() * 0.8 + 0.2
            });
        }

        if (this.victoryAnimFrame) cancelAnimationFrame(this.victoryAnimFrame);

        const render = () => {
            if (!this.victoryModal || !this.victoryModal.classList.contains('active')) {
                window.removeEventListener('resize', handleResize);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Render Confetti & Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.vy += p.gravity;
                p.rotation += p.rotSpeed;

                if (p.decay) p.opacity -= p.decay;

                // Reset ambient rising particles
                if (p.gravity === 0 && p.y < -20) {
                    p.y = height + 20;
                    p.x = Math.random() * width;
                    p.opacity = Math.random() * 0.7 + 0.3;
                }

                if (p.opacity <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else if (p.shape === 'star') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            // Render 3D Spinning Gold Coins
            for (let i = 0; i < coins.length; i++) {
                const c = coins[i];
                c.y += c.vy;
                c.scaleX += c.flipSpeed;
                if (c.scaleX > 1 || c.scaleX < -1) c.flipSpeed = -c.flipSpeed;

                if (c.y < 50 || c.y > height - 50) c.vy = -c.vy;

                const coinWidth = c.radius * Math.abs(Math.sin(c.scaleX));

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.globalAlpha = c.opacity;

                // Outer Gold Ring
                ctx.beginPath();
                ctx.ellipse(0, 0, Math.max(2, coinWidth), c.radius, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fbbf24';
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 15;
                ctx.fill();

                // Inner Coin Reflection
                ctx.beginPath();
                ctx.ellipse(0, 0, Math.max(1, coinWidth * 0.6), c.radius * 0.6, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fff085';
                ctx.fill();

                ctx.restore();
            }

            this.victoryAnimFrame = requestAnimationFrame(render);
        };

        render();
    }

    animateVictoryScore(targetScore = 0) {
        const scoreElem = document.getElementById('victoryScore');
        const recordScoreElem = document.getElementById('victoryRecordScore');
        const rankStamp = document.getElementById('victoryRankStamp');

        const finalVal = parseInt(targetScore, 10) || 3930;

        if (scoreElem) scoreElem.innerText = '0';
        if (recordScoreElem) recordScoreElem.innerText = '0';

        if (this.scoreCounterInterval) clearInterval(this.scoreCounterInterval);

        const duration = 1800; // ms
        const steps = 40;
        const stepTime = duration / steps;
        const increment = Math.ceil(finalVal / steps);
        let current = 0;

        this.scoreCounterInterval = setInterval(() => {
            current += increment;
            if (current >= finalVal) {
                current = finalVal;
                clearInterval(this.scoreCounterInterval);

                if (rankStamp) {
                    setTimeout(() => {
                        rankStamp.classList.add('stamped');
                        if (window.soundEngine && typeof window.soundEngine.playLevelClear === 'function') {
                            window.soundEngine.playLevelClear();
                        }
                    }, 200);
                }
            }

            const formatted = current.toLocaleString();
            if (scoreElem) {
                scoreElem.innerText = formatted;
                scoreElem.classList.add('pulse');
                setTimeout(() => scoreElem.classList.remove('pulse'), 120);
            }
            if (recordScoreElem) {
                recordScoreElem.innerText = formatted;
            }

            if (window.soundEngine && typeof window.soundEngine.playTone === 'function' && current < finalVal) {
                window.soundEngine.playTone(600 + (current % 500), 'sine', 0.03, 0.12, 0.001, false);
            }
        }, stepTime);
    }

    showLevelIntro(levelData, onStartGame, forceShow = true) {
        if (!levelData) {
            if (onStartGame) onStartGame();
            return;
        }

        // On mobile devices, delay intro until after device is rotated to landscape mode
        const isMobile = window.innerWidth <= 950 || ('ontouchstart' in window);
        const isPortrait = window.innerHeight > window.innerWidth;
        const rotateOverlay = document.getElementById('rotateOverlay');
        const isRotateOverlayActive = rotateOverlay && rotateOverlay.classList.contains('active');

        if (isMobile && (isPortrait || isRotateOverlayActive)) {
            this.pendingIntro = { levelData, onStartGame, forceShow };
            return;
        }

        this.seenLevelIntros.add(levelData.id);
        this.pendingIntro = null;

        const overlay = document.getElementById('levelIntroOverlay');
        if (!overlay) {
            if (onStartGame) onStartGame();
            return;
        }

        const bgImage = document.getElementById('introBgImage');
        const levelId = Math.min(Math.max(levelData.id || 1, 1), 5);
        if (bgImage) {
            bgImage.style.backgroundImage = `url("uploads/animation img ${levelId}.webp")`;
        }

        const chapterHeader = document.getElementById('introChapterHeader');
        const badge = document.getElementById('introBadge');
        const title = document.getElementById('introTitle');
        const location = document.getElementById('introLocation');
        const storyBox = document.getElementById('introStoryBox');

        if (chapterHeader) chapterHeader.innerText = `LEVEL 0${levelData.id || 1} // STORY MODE BRIEFING`;
        if (badge) badge.innerText = `— LEVEL 0${levelData.id || 1} —`;

        const rawTitle = levelData.title || `Stage ${levelData.id}`;
        const cleanTitle = rawTitle.replace(/^Level\s+\d+:\s*/i, '');
        if (title) title.innerText = cleanTitle.toUpperCase();

        let locText = 'Unknown Location';
        if (levelData.subtitle) {
            locText = levelData.subtitle.split(':')[0];
        }
        if (location) location.innerText = `📍 LOCATION: ${locText}`;

        const storyText = STORY_BRIEFINGS[levelData.id] || "Infiltrate the level, retrieve keycard, defeat staircase fighters, and reach the exit door!";
        if (storyBox) storyBox.innerText = `"${storyText}"`;

        if (this.introTimeout) clearTimeout(this.introTimeout);

        overlay.classList.remove('fade-out');
        overlay.style.display = 'flex';
        void overlay.offsetWidth;
        overlay.classList.add('active');

        if (window.soundEngine) {
            if (typeof window.soundEngine.playStoryBriefingMusic === 'function') {
                window.soundEngine.playStoryBriefingMusic(levelId);
            } else if (typeof window.soundEngine.playTone === 'function') {
                window.soundEngine.playTone(320, 'triangle', 0.2, 0.4, 0.001, true);
            }
        }

        let dismissed = false;
        const dismissIntro = () => {
            if (dismissed) return;
            dismissed = true;
            overlay.onclick = null;
            if (window.soundEngine && typeof window.soundEngine.stopStoryMusic === 'function') {
                window.soundEngine.stopStoryMusic();
            }
            overlay.classList.add('fade-out');
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.classList.remove('fade-out');
                if (onStartGame) onStartGame();
            }, 400);
        };

        overlay.onclick = dismissIntro;

        this.introTimeout = setTimeout(() => {
            dismissIntro();
        }, 4000);
    }

    openStoryBriefingModal(levelId = 1) {
        let levelData = null;
        if (window.LEVELS && Array.isArray(window.LEVELS)) {
            levelData = window.LEVELS.find(l => l.id === levelId);
        }
        if (!levelData) {
            levelData = { id: levelId, title: `Level ${levelId}`, subtitle: 'Tactical Sector' };
        }
        this.showLevelIntro(levelData, null, true);
    }

    checkPendingIntro() {
        if (this.pendingIntro) {
            const pending = this.pendingIntro;
            const isMobile = window.innerWidth <= 950 || ('ontouchstart' in window);
            const isPortrait = window.innerHeight > window.innerWidth;
            const rotateOverlay = document.getElementById('rotateOverlay');
            const isRotateOverlayActive = rotateOverlay && rotateOverlay.classList.contains('active');

            if (!isMobile || (!isPortrait && !isRotateOverlayActive)) {
                const { levelData, onStartGame, forceShow } = pending;
                this.pendingIntro = null;
                this.showLevelIntro(levelData, onStartGame, forceShow);
            }
        }
    }

    hideAllModals() {
        if (this.victoryAnimFrame) {
            cancelAnimationFrame(this.victoryAnimFrame);
            this.victoryAnimFrame = null;
        }
        if (this.scoreCounterInterval) {
            clearInterval(this.scoreCounterInterval);
            this.scoreCounterInterval = null;
        }
        if (window.soundEngine && typeof window.soundEngine.stopStoryMusic === 'function') {
            window.soundEngine.stopStoryMusic();
        }

        [this.pauseModal, this.gameOverModal, this.levelClearModal, this.victoryModal].forEach(m => {
            if (m) m.classList.remove('active');
        });
        const overlay = document.getElementById('levelIntroOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.classList.remove('fade-out');
        }
    }
}

const uiManager = new UIManager();
window.uiManager = uiManager;

document.addEventListener('DOMContentLoaded', () => {
    uiManager.init();
});
