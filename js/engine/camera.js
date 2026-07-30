/* ==========================================================================
   Shadow Escape - Smooth 2D/3D Camera System with Shake FX
   ========================================================================== */

class Camera {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.targetX = 0;
        this.targetY = 0;

        // Camera smoothinglerp factor
        this.lerp = 0.1;

        // Level world limits
        this.worldWidth = 2000;
        this.worldHeight = 1200;

        // Screen Shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    setWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }

    follow(targetX, targetY) {
        // Center camera on target
        this.targetX = targetX - this.viewportWidth / 2;
        this.targetY = targetY - this.viewportHeight / 2;
    }

    shake(intensity, duration = 200) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    update(dt) {
        // Smooth framerate-independent lerp tracking
        const factor = 1 - Math.exp(-14 * dt);
        this.x += (this.targetX - this.x) * factor;
        this.y += (this.targetY - this.y) * factor;

        // Clamp camera within world bounds
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.viewportWidth));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.viewportHeight));

        // Screen shake processing
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt * 1000;
            this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
            this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
        } else {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    }

    getRenderOffset() {
        return {
            x: Math.round(this.x + this.shakeOffsetX),
            y: Math.round(this.y + this.shakeOffsetY)
        };
    }
}

window.Camera = Camera;
