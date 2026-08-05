/* ==========================================================================
   Shadow Escape - LocalStorage State Manager
   ========================================================================== */

const STORAGE_KEY = 'shadow_escape_save_v1';

class StorageManager {
    constructor() {
        this.defaultLeaderboard = [
            { name: 'Shadow_X', score: 28450, time: '01:45' },
            { name: 'Alpha_Hunter', score: 22150, time: '02:15' },
            { name: 'Cipher_Ghost', score: 17300, time: '02:40' },
            { name: 'Vortex_Runner', score: 15100, time: '03:05' },
            { name: 'Neon_Blade', score: 12800, time: '03:30' }
        ];
        this.defaultData = {
            playerName: '',
            unlockedLevel: 1,
            highScore: 0,
            totalCrystals: 0,
            levelTimes: {},
            leaderboard: [ ...this.defaultLeaderboard ],
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
            if (!raw) return { ...this.defaultData, leaderboard: [ ...this.defaultLeaderboard ] };
            const parsed = JSON.parse(raw);
            const loadedData = { 
                ...this.defaultData, 
                ...parsed, 
                settings: { ...this.defaultData.settings, ...(parsed.settings || {}) } 
            };
            if (!Array.isArray(loadedData.leaderboard) || loadedData.leaderboard.length === 0) {
                loadedData.leaderboard = [ ...this.defaultLeaderboard ];
            }
            return loadedData;
        } catch (e) {
            console.warn('LocalStorage error, fallback to defaults:', e);
            return { ...this.defaultData, leaderboard: [ ...this.defaultLeaderboard ] };
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save to LocalStorage:', e);
        }
    }

    getPlayerName() {
        return (this.data && this.data.playerName) ? this.data.playerName.trim() : '';
    }

    setPlayerName(name) {
        let cleanName = (name || '').trim();
        cleanName = cleanName.substring(0, 18);
        this.data.playerName = cleanName;
        this.save();
        return cleanName;
    }

    getLeaderboard() {
        if (!Array.isArray(this.data.leaderboard) || this.data.leaderboard.length === 0) {
            this.data.leaderboard = [ ...this.defaultLeaderboard ];
            this.save();
        }
        return [ ...this.data.leaderboard ];
    }

    recordLeaderboardEntry(playerName, score, totalTimeSec = 0) {
        const cleanName = (playerName || this.getPlayerName()).trim() || 'Agent';
        const board = this.getLeaderboard();

        // Format time string MM:SS
        let timeStr = '00:00';
        if (totalTimeSec > 0) {
            const m = Math.floor(totalTimeSec / 60).toString().padStart(2, '0');
            const s = (Math.floor(totalTimeSec) % 60).toString().padStart(2, '0');
            timeStr = `${m}:${s}`;
        }

        // Check if player name already exists in leaderboard
        const existingIdx = board.findIndex(item => item.name.toLowerCase() === cleanName.toLowerCase());
        if (existingIdx !== -1) {
            // Update if score is higher
            if (score > board[existingIdx].score) {
                board[existingIdx].score = score;
                if (totalTimeSec > 0) board[existingIdx].time = timeStr;
                board[existingIdx].name = cleanName; // preserve exact casing
            }
        } else {
            // Add new entry
            board.push({
                name: cleanName,
                score: score,
                time: timeStr
            });
        }

        // Sort descending by score
        board.sort((a, b) => b.score - a.score);

        // Keep top 5
        const top5 = board.slice(0, 5);
        this.data.leaderboard = top5;

        // Also update overall high score if applicable
        if (score > (this.data.highScore || 0)) {
            this.data.highScore = score;
        }

        this.save();

        const rankIndex = top5.findIndex(item => item.name.toLowerCase() === cleanName.toLowerCase());
        return {
            inTop5: rankIndex !== -1,
            rank: rankIndex !== -1 ? rankIndex + 1 : null,
            leaderboard: top5
        };
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
        let isNewHigh = false;
        if (score > (this.data.highScore || 0)) {
            this.data.highScore = score;
            isNewHigh = true;
        }
        this.recordLeaderboardEntry(this.getPlayerName(), score);
        this.save();
        return isNewHigh;
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
