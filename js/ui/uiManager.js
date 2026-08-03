/* ==========================================================================
   Shadow Escape - UI Manager (HUD, Modals & Navigation)
   ========================================================================== */

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
            window.gameEngine.loadLevel(window.gameEngine.currentLevelId + 1);
        });

        // Mobile Nav Toggle
        const navToggle = document.getElementById('mobileNavToggle');
        const navLinks = document.getElementById('navLinks');
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('open');
            });
        }
    }

    updateHUD(engine) {
        if (!engine.player) return;

        // Health Bar
        if (this.hudHealthFill) {
            const pct = Math.max(0, (engine.player.hp / engine.player.maxHp) * 100);
            this.hudHealthFill.style.width = `${pct}%`;
        }

        // Flight Fuel Bar
        if (this.hudFuelFill) {
            const fuelPct = Math.max(0, (engine.player.flightFuel / engine.player.maxFlightFuel) * 100);
            this.hudFuelFill.style.width = `${fuelPct}%`;
        }

        // Crystals Counter
        if (this.hudCrystalsVal) {
            this.hudCrystalsVal.innerText = `${engine.crystalsCollected}/${engine.totalCrystalsInLevel}`;
        }

        // Key Indicator
        if (this.hudKeyIndicator) {
            if (engine.hasKey) {
                this.hudKeyIndicator.classList.add('acquired');
            } else {
                this.hudKeyIndicator.classList.remove('acquired');
            }
        }

        // Level Title
        if (this.hudLevelTitle && engine.levelData) {
            this.hudLevelTitle.innerText = engine.levelData.title;
        }

        // Timer Display
        if (this.hudTimerVal) {
            const mins = Math.floor(engine.levelTimer / 60).toString().padStart(2, '0');
            const secs = Math.floor(engine.levelTimer % 60).toString().padStart(2, '0');
            this.hudTimerVal.innerText = `${mins}:${secs}`;
        }

        // Score
        if (this.hudScoreVal) {
            this.hudScoreVal.innerText = engine.score.toString();
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
        const scoreElem = document.getElementById('levelClearScore');
        if (scoreElem) scoreElem.innerText = score.toString();
        if (this.levelClearModal) this.levelClearModal.classList.add('active');
    }

    showVictoryModal(totalScore) {
        const scoreElem = document.getElementById('victoryScore');
        if (scoreElem) scoreElem.innerText = totalScore.toString();
        if (this.victoryModal) this.victoryModal.classList.add('active');
    }

    hideAllModals() {
        [this.pauseModal, this.gameOverModal, this.levelClearModal, this.victoryModal].forEach(m => {
            if (m) m.classList.remove('active');
        });
    }
}

const uiManager = new UIManager();
window.uiManager = uiManager;

document.addEventListener('DOMContentLoaded', () => {
    uiManager.init();
});
