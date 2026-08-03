/* ==========================================================================
   Shadow Escape - Global Asset Manager & Image Preloading System
   ========================================================================== */

class AssetManager {
    constructor() {
        this.cache = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.isReady = false;

        // Complete manifest of all game PNG image assets
        this.manifest = [
            // Level Parallax Backgrounds
            'uploads/bg1.png',
            'uploads/bg2.png',
            'uploads/bg3.png',
            'uploads/bg4.png',
            'uploads/bg5.png',

            // Story Mode Briefing Level Background Images
            'uploads/animation img 1.png',
            'uploads/animation img 2.png',
            'uploads/animation img 3.png',
            'uploads/animation img 4.png',
            'uploads/animation img 5.png',
            
            // Player Animation Sprites
            'uploads/player_stand.png',
            'uploads/player_slow_walk.png',
            'uploads/player_run1.png',
            'uploads/player_run2.png',
            'uploads/player_run3.png',
            'uploads/player run 4.png',
            'uploads/player run 5.png',
            'uploads/player run 6.png',
            'uploads/player_jump2.png',
            'uploads/player_flight1.png',
            'uploads/player_flight2.png',
            'uploads/player_flight3.png',
            'uploads/player_flight4.png',
            
            // Enemy & Hazard Sprites
            'uploads/guard.png',
            'uploads/fighter walk 1.png',
            'uploads/fighter walk 2.png',
            'uploads/fighter walk 3.png',
            'uploads/fighter 1.png',
            'uploads/fighter 2.png',
            'uploads/fighter 3.png',
            'uploads/fighter 4.png',
            'uploads/drone.png',

            // Collectibles
            'uploads/crystal.png',

            // UI & Branding
            'uploads/logo.png',
            'uploads/preview.png',
            'uploads/org_person.png'
        ];
    }

    preloadAll() {
        this.totalCount = this.manifest.length;
        this.loadedCount = 0;

        const promises = this.manifest.map(src => this.loadImage(src));
        return Promise.all(promises).then(() => {
            this.isReady = true;
            console.log(`[AssetManager] Preloaded ${this.loadedCount}/${this.totalCount} game assets.`);
        });
    }

    loadImage(src) {
        if (this.cache.has(src)) {
            return Promise.resolve(this.cache.get(src));
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.loaded = false;
            img.onload = () => {
                img.loaded = true;
                this.loadedCount++;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`[AssetManager] Warning: Image failed to load: ${src}`);
                img.loaded = true;
                resolve(img);
            };
            img.src = src;
            this.cache.set(src, img);
        });
    }

    getImage(src) {
        if (this.cache.has(src)) {
            return this.cache.get(src);
        }

        // Automatic fallback cache entry
        const img = new Image();
        img.loaded = false;
        img.onload = () => { img.loaded = true; };
        img.onerror = () => { img.loaded = true; };
        img.src = src;
        this.cache.set(src, img);
        return img;
    }
}

window.assetManager = new AssetManager();
// Preload instantly on script parse
window.assetManager.preloadAll();
