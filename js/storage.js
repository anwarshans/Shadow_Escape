/* ==========================================================================
   Shadow Escape - LocalStorage State Manager
   ========================================================================== */

const STORAGE_KEY = 'shadow_escape_save_v1';

class StorageManager {
    constructor() {
        this.defaultData = {
            unlockedLevel: 1,
            highScore: 0,
            totalCrystals: 0,
            levelTimes: {},
            settings: {
                sfxVolume: 0.8,
                musicVolume: 0.5,
                particles: 'high',
                touchControls: 'auto'
            }
        };
        this.data = this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...this.defaultData };
            const parsed = JSON.parse(raw);
            return { ...this.defaultData, ...parsed, settings: { ...this.defaultData.settings, ...(parsed.settings || {}) } };
        } catch (e) {
            console.warn('LocalStorage error, fallback to defaults:', e);
            return { ...this.defaultData };
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save to LocalStorage:', e);
        }
    }

    getUnlockedLevel() {
        return this.data.unlockedLevel || 1;
    }

    unlockLevel(levelNum) {
        if (levelNum > this.data.unlockedLevel) {
            this.data.unlockedLevel = Math.min(levelNum, 5);
            this.save();
        }
    }

    updateHighScore(score) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.save();
            return true;
        }
        return false;
    }

    addCrystals(count) {
        this.data.totalCrystals = (this.data.totalCrystals || 0) + count;
        this.save();
    }

    saveLevelTime(levelId, timeInSeconds) {
        const currentBest = this.data.levelTimes[levelId];
        if (!currentBest || timeInSeconds < currentBest) {
            this.data.levelTimes[levelId] = timeInSeconds;
            this.save();
        }
    }

    getSettings() {
        return this.data.settings;
    }

    updateSettings(newSettings) {
        this.data.settings = { ...this.data.settings, ...newSettings };
        this.save();
    }
}

const storage = new StorageManager();
window.storage = storage;
