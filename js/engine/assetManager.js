/* ==========================================================================
   Shadow Escape - Global Asset Manager & Image Preloading System
   ========================================================================== */

class AssetManager {
    constructor() {
        this.cache = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.isReady = false;

        // Core gameplay image assets (Level backgrounds & essential UI)
        this.coreManifest = [
            'uploads/bg1.webp',
            'uploads/bg2.webp',
            'uploads/bg3.webp',
            'uploads/bg4.webp',
            'uploads/bg5.webp',
            
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
            
            'uploads/guard.png',
            'uploads/fighter walk 1.png',
            'uploads/fighter walk 2.png',
            'uploads/fighter walk 3.png',
            'uploads/fighter 1.png',
            'uploads/fighter 2.png',
            'uploads/fighter 3.png',
            'uploads/fighter 4.png',
            'uploads/drone.png',
            'uploads/crystal.png',

            'uploads/logo.png',
            'uploads/preview.webp',
            'uploads/org_person.webp'
        ];

        this.storyManifest = [
            'uploads/animation img 1.webp',
            'uploads/animation img 2.webp',
            'uploads/animation img 3.webp',
            'uploads/animation img 4.webp',
            'uploads/animation img 5.webp'
        ];

        this.manifest = [...this.coreManifest, ...this.storyManifest];
    }

    preloadAll() {
        this.totalCount = this.manifest.length;
        this.loadedCount = 0;

        // Load core gameplay assets first asynchronously
        const corePromises = this.coreManifest.map(src => this.loadImage(src));
        
        return Promise.all(corePromises).then(() => {
            this.isReady = true;
            console.log(`[AssetManager] Core assets loaded (${this.coreManifest.length}/${this.coreManifest.length}). Loading story assets...`);
            // Non-blocking background load for story briefing images
            this.storyManifest.forEach(src => this.loadImage(src));
        });
    }

    loadImage(src) {
        if (this.cache.has(src)) {
            return Promise.resolve(this.cache.get(src));
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.loaded = false;

            const handleComplete = () => {
                if ('decode' in img && typeof img.decode === 'function') {
                    img.decode().then(() => {
                        img.loaded = true;
                        this.loadedCount++;
                        resolve(img);
                    }).catch(() => {
                        img.loaded = true;
                        this.loadedCount++;
                        resolve(img);
                    });
                } else {
                    img.loaded = true;
                    this.loadedCount++;
                    resolve(img);
                }
            };

            img.onload = handleComplete;
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
        // Transparent mapping of legacy .png paths to optimized .webp paths for background and heavy images
        let targetSrc = src;
        if (src.includes('bg1.png')) targetSrc = 'uploads/bg1.webp';
        else if (src.includes('bg2.png')) targetSrc = 'uploads/bg2.webp';
        else if (src.includes('bg3.png')) targetSrc = 'uploads/bg3.webp';
        else if (src.includes('bg4.png')) targetSrc = 'uploads/bg4.webp';
        else if (src.includes('bg5.png')) targetSrc = 'uploads/bg5.webp';
        else if (src.includes('preview.png')) targetSrc = 'uploads/preview.webp';
        else if (src.includes('org_person.png')) targetSrc = 'uploads/org_person.webp';
        else if (src.includes('animation img 1.png')) targetSrc = 'uploads/animation img 1.webp';
        else if (src.includes('animation img 2.png')) targetSrc = 'uploads/animation img 2.webp';
        else if (src.includes('animation img 3.png')) targetSrc = 'uploads/animation img 3.webp';
        else if (src.includes('animation img 4.png')) targetSrc = 'uploads/animation img 4.webp';
        else if (src.includes('animation img 5.png')) targetSrc = 'uploads/animation img 5.webp';

        if (this.cache.has(targetSrc)) {
            return this.cache.get(targetSrc);
        }

        // Automatic fallback cache entry
        const img = new Image();
        img.loaded = false;
        img.onload = () => {
            if ('decode' in img && typeof img.decode === 'function') {
                img.decode().then(() => { img.loaded = true; }).catch(() => { img.loaded = true; });
            } else {
                img.loaded = true;
            }
        };
        img.onerror = () => { img.loaded = true; };
        img.src = targetSrc;
        this.cache.set(targetSrc, img);
        return img;
    }
}

window.assetManager = new AssetManager();
// Preload core assets instantly on script parse
window.assetManager.preloadAll();
