/* ==========================================================================
   Shadow Escape - Core Game Engine & Game Loop
   ========================================================================== */

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.performanceMode = false;
        this.sceneZoom = 1.08;

        this.currentLevelId = 1;
        this.levelData = null;

        this.player = null;
        this.camera = null;
        this.platforms = [];
        this.hazards = [];
        this.lasers = [];
        this.enemies = [];
        this.crystals = [];
        this.key = null;
        this.door = null;
        this.checkpoint = null;

        // Gameplay Metrics
        this.score = 0;
        this.crystalsCollected = 0;
        this.totalCrystalsInLevel = 0;
        this.hasKey = false;
        this.levelTimer = 0;

        // Engine State: 'LOADING', 'PLAYING', 'PAUSED', 'LEVEL_CLEAR', 'GAME_OVER', 'VICTORY'
        this.state = 'LOADING';

        this.lastTime = 0;
        this.accumulatedTime = 0;
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.resizeCanvas();
        this.refreshPerformanceMode();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.loadLevel(this.currentLevelId);
        this.startLoop();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        // Keep 16:9 canvas aspect ratio
        this.canvas.width = 1280;
        this.canvas.height = 720;
        if (this.camera) {
            this.camera.viewportWidth = 1280;
            this.camera.viewportHeight = 720;
        }
        this.refreshPerformanceMode();
    }

    refreshPerformanceMode() {
        this.performanceMode = window.innerWidth <= 1440 || window.innerHeight <= 850;
        window.gamePerformanceMode = this.performanceMode;
    }

    isVisible(entity, cameraOffset, padding = 120) {
        if (!entity || !this.canvas) return false;

        const x = entity.x ?? entity.x1 ?? 0;
        const y = entity.y ?? entity.y1 ?? 0;
        const width = entity.width ?? Math.abs((entity.x2 ?? x) - x);
        const height = entity.height ?? Math.abs((entity.y2 ?? y) - y);
        const safeWidth = Number.isFinite(width) ? width : 0;
        const safeHeight = Number.isFinite(height) ? height : 0;

        return (
            x + safeWidth >= cameraOffset.x - padding &&
            x <= cameraOffset.x + this.canvas.width + padding &&
            y + safeHeight >= cameraOffset.y - padding &&
            y <= cameraOffset.y + this.canvas.height + padding
        );
    }

    loadLevel(levelId) {
        this.currentLevelId = levelId;
        const rawLevel = window.LEVELS.find(l => l.id === levelId);
        if (!rawLevel) return;

        this.levelData = JSON.parse(JSON.stringify(rawLevel)); // Deep copy map
        this.camera.setWorldBounds(this.levelData.worldWidth, this.levelData.worldHeight);

        // Instantiate Player
        this.player = new Player(this.levelData.spawn.x, this.levelData.spawn.y);

        // Load Platforms & Hazards
        this.platforms = this.levelData.platforms;
        this.hazards = (this.levelData.hazards || []).map(h => new HazardZone(h.x, h.y, h.width, h.height, h.isReactorFluid));
        this.lasers = (this.levelData.lasers || []).map(l => new LaserTrap(l.x1, l.y1, l.x2, l.y2, l.interval, l.duration));

        // Load Enemies
        this.enemies = (this.levelData.enemies || []).map(e => {
            if (e.type === 'patrol') return new PatrolBot(e.x, e.y, e.rangeLeft, e.rangeRight);
            if (e.type === 'drone') return new FlyingDrone(e.x, e.y, e.rangeY);
            return null;
        }).filter(Boolean);

        // Collectibles
        this.crystals = (this.levelData.crystals || []).map(c => new EnergyCrystal(c.x, c.y));
        this.totalCrystalsInLevel = this.crystals.length;
        this.crystalsCollected = 0;

        // Key, Door & Checkpoint
        this.key = this.levelData.key ? new Keycard(this.levelData.key.x, this.levelData.key.y) : null;
        this.door = this.levelData.door ? new ExitDoor(this.levelData.door.x, this.levelData.door.y) : null;
        this.checkpoint = this.levelData.checkpoint ? new Checkpoint(this.levelData.checkpoint.x, this.levelData.checkpoint.y) : null;

        this.hasKey = false;
        this.levelTimer = 0;
        this.state = 'PLAYING';

        if (window.particleSystem) window.particleSystem.reset();
        if (window.soundEngine) window.soundEngine.startBGM();
    }

    startLoop() {
        this.lastTime = performance.now();
        this.accumulator = 0;
        const fixedStep = 1 / 60;

        const loop = (currentTime) => {
            const frameTime = Math.min(0.1, (currentTime - this.lastTime) / 1000);
            this.lastTime = currentTime;

            if (this.state === 'PLAYING') {
                this.accumulator += frameTime;
                while (this.accumulator >= fixedStep) {
                    this.update(fixedStep);
                    this.accumulator -= fixedStep;
                }
            } else {
                this.accumulator = 0;
            }

            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt) {
        this.levelTimer += dt;

        // Update Input & Player Physics
        const input = window.inputHandler;
        if (input.isPausePressed()) {
            this.togglePause();
            input.keys['Escape'] = false;
            input.keys['KeyP'] = false;
            return;
        }

        this.player.update(dt, input);

        // Platform Collisions
        this.platforms.forEach(plat => {
            if (Physics.checkAABB(this.player, plat)) {
                Physics.resolvePlatformCollision(this.player, plat);
            }
        });

        // Camera Tracking
        this.camera.follow(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.camera.update(dt);

        // Particle System
        if (window.particleSystem) window.particleSystem.update(dt);

        // Update Lasers
        this.lasers.forEach(laser => {
            laser.update(dt);
            if (laser.isActive && Physics.lineIntersectsBox(laser.x1, laser.y1, laser.x2, laser.y2, this.player)) {
                if (this.player.takeDamage(laser.damage)) {
                    if (window.particleSystem) window.particleSystem.createExplosion(this.player.x, this.player.y);
                }
            }
        });

        // Update Hazards
        this.hazards.forEach(haz => {
            if (Physics.checkAABB(this.player, haz)) {
                if (this.player.takeDamage(haz.damage)) {
                    this.player.respawn();
                }
            }
        });

        // Update Enemies
        this.enemies.forEach(enemy => {
            enemy.update(dt);
            if (Physics.checkAABB(this.player, enemy)) {
                if (this.player.takeDamage(enemy.damage)) {
                    if (window.particleSystem) window.particleSystem.createExplosion(this.player.x, this.player.y);
                }
            }
        });

        // Collect Crystals
        this.crystals.forEach(c => {
            if (!c.collected) {
                c.update(dt);
                if (Physics.checkAABB(this.player, c)) {
                    c.collected = true;
                    this.crystalsCollected++;
                    this.score += 100;
                    if (window.soundEngine) window.soundEngine.playCrystal();
                    if (window.particleSystem) window.particleSystem.createCrystalBurst(c.x + 12, c.y + 12);
                }
            }
        });

        // Collect Keycard
        if (this.key && !this.key.collected) {
            this.key.update(dt);
            if (Physics.checkAABB(this.player, this.key)) {
                this.key.collected = true;
                this.hasKey = true;
                if (this.door) this.door.isUnlocked = true;
                if (window.soundEngine) {
                    window.soundEngine.playKey();
                    window.soundEngine.playDoorUnlock();
                }
            }
        }

        // Trigger Checkpoint
        if (this.checkpoint && !this.checkpoint.activated) {
            if (Physics.checkAABB(this.player, this.checkpoint)) {
                this.checkpoint.activated = true;
                this.player.setCheckpoint(this.checkpoint.x, this.checkpoint.y);
            }
        }

        // Check Exit Door Win Condition
        if (this.door && this.door.isUnlocked && Physics.checkAABB(this.player, this.door)) {
            this.handleLevelClear();
        }

        // Check Death Condition
        if (this.player.hp <= 0 || this.player.y > this.levelData.worldHeight + 200) {
            this.handleGameOver();
        }

        // Sync UI HUD
        if (window.uiManager) window.uiManager.updateHUD(this);
    }

    render() {
        if (!this.ctx) return;
        const cameraOffset = this.camera.getRenderOffset();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.sceneZoom, this.sceneZoom);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

        // 1. Clear & Render 2.5D Parallax Background
        if (window.renderer2D3D) {
            window.renderer2D3D.drawParallaxBackground(this.ctx, cameraOffset, this.canvas.width, this.canvas.height, this.currentLevelId);
        }

        // 2. Render 2.5D Platforms
        this.platforms.forEach(plat => {
            if (window.renderer2D3D && this.isVisible(plat, cameraOffset, 180)) {
                window.renderer2D3D.drawPlatform3D(this.ctx, plat, cameraOffset);
            }
        });

        // 3. Render Hazards & Lasers
        this.hazards.forEach(haz => {
            if (this.isVisible(haz, cameraOffset, 180)) {
                haz.draw(this.ctx, cameraOffset);
            }
        });
        this.lasers.forEach(laser => {
            if (this.isVisible(laser, cameraOffset, 180)) {
                laser.draw(this.ctx, cameraOffset);
            }
        });

        // 4. Render Checkpoint & Exit Door
        if (this.checkpoint && this.isVisible(this.checkpoint, cameraOffset, 180)) this.checkpoint.draw(this.ctx, cameraOffset);
        if (this.door && this.isVisible(this.door, cameraOffset, 180)) this.door.draw(this.ctx, cameraOffset);

        // 5. Render Collectibles & Enemies
        this.crystals.forEach(c => {
            if (this.isVisible(c, cameraOffset, 160)) {
                c.draw(this.ctx, cameraOffset);
            }
        });
        if (this.key && this.isVisible(this.key, cameraOffset, 160)) this.key.draw(this.ctx, cameraOffset);
        this.enemies.forEach(e => {
            if (this.isVisible(e, cameraOffset, 180)) {
                e.draw(this.ctx, cameraOffset);
            }
        });

        // 6. Render Player & Particles
        if (this.player) this.player.draw(this.ctx, cameraOffset);
        if (window.particleSystem) window.particleSystem.draw(this.ctx, cameraOffset);

        // 7. Render Ambient Light Beams
        if (window.renderer2D3D) {
            window.renderer2D3D.drawAmbientLighting(this.ctx, this.canvas.width, this.canvas.height, performance.now() / 1000);
        }

        this.ctx.restore();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            if (window.uiManager) window.uiManager.showPauseModal(true);
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            if (window.uiManager) window.uiManager.showPauseModal(false);
        }
    }

    handleLevelClear() {
        this.state = 'LEVEL_CLEAR';
        if (window.soundEngine) window.soundEngine.playLevelClear();

        // Calculate Score & Save Progress
        const timeBonus = Math.max(0, Math.floor(300 - this.levelTimer) * 10);
        this.score += 500 + timeBonus;

        if (window.storage) {
            window.storage.unlockLevel(this.currentLevelId + 1);
            window.storage.addCrystals(this.crystalsCollected);
            window.storage.saveLevelTime(this.currentLevelId, Math.floor(this.levelTimer));
            window.storage.updateHighScore(this.score);
        }

        if (this.currentLevelId >= 5) {
            this.state = 'VICTORY';
            if (window.uiManager) window.uiManager.showVictoryModal(this.score);
        } else {
            if (window.uiManager) window.uiManager.showLevelClearModal(this.currentLevelId, this.score);
        }
    }

    handleGameOver() {
        this.state = 'GAME_OVER';
        if (window.soundEngine) window.soundEngine.playExplosion();
        if (window.uiManager) window.uiManager.showGameOverModal();
    }
}

const gameEngine = new GameEngine();
window.gameEngine = gameEngine;
