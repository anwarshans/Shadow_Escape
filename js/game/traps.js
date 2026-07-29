/* ==========================================================================
   Shadow Escape - Laser Traps & Environment Hazards
   ========================================================================== */

class LaserTrap {
    constructor(x1, y1, x2, y2, interval = 2.0, duration = 1.2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.interval = interval;
        this.duration = duration;
        this.timer = Math.random() * interval;

        this.isActive = true;
        this.damage = 35;
    }

    update(dt) {
        if (this.interval <= 0) {
            this.isActive = true; // Always active
            return;
        }

        this.timer += dt;
        const totalCycle = this.interval + this.duration;
        const cycleTime = this.timer % totalCycle;

        this.isActive = cycleTime >= this.interval;

        if (this.isActive && window.particleSystem) {
            window.particleSystem.createLaserSparks(this.x1 + Math.random() * (this.x2 - this.x1), this.y1 + Math.random() * (this.y2 - this.y1));
        }
    }

    draw(ctx, cameraOffset) {
        const drawX1 = this.x1 - cameraOffset.x;
        const drawY1 = this.y1 - cameraOffset.y;
        const drawX2 = this.x2 - cameraOffset.x;
        const drawY2 = this.y2 - cameraOffset.y;

        ctx.save();

        // Emitter Nodes
        ctx.fillStyle = '#ff007f';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 10;
        ctx.fillRect(drawX1 - 5, drawY1 - 5, 10, 10);
        ctx.fillRect(drawX2 - 5, drawY2 - 5, 10, 10);

        if (this.isActive) {
            // Outer Glowing Energy Beam
            ctx.strokeStyle = '#ff007f';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(drawX1, drawY1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();

            // Inner Intense Core Beam
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(drawX1, drawY1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();
        }

        ctx.restore();
    }
}

class HazardZone {
    constructor(x, y, width, height, isReactorFluid = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isReactorFluid = isReactorFluid;
        this.damage = 100; // Instant respawn damage
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        if (this.isReactorFluid) {
            // Reactor Toxic Plasma Liquid
            const grad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
            grad.addColorStop(0, 'rgba(255, 0, 127, 0.85)');
            grad.addColorStop(1, 'rgba(176, 38, 255, 0.95)');

            ctx.fillStyle = grad;
            ctx.shadowColor = '#ff007f';
            ctx.shadowBlur = 15;
            ctx.fillRect(drawX, drawY, this.width, this.height);

            // Pulsing surface wave
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(drawX, drawY, this.width, 3);
        } else {
            // Spike Hazard
            ctx.fillStyle = '#ff3366';
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 8;

            const spikeWidth = 16;
            const spikeCount = Math.floor(this.width / spikeWidth);

            for (let i = 0; i < spikeCount; i++) {
                const sx = drawX + i * spikeWidth;
                ctx.beginPath();
                ctx.moveTo(sx, drawY + this.height);
                ctx.lineTo(sx + spikeWidth / 2, drawY);
                ctx.lineTo(sx + spikeWidth, drawY + this.height);
                ctx.closePath();
                ctx.fill();
            }
        }

        ctx.restore();
    }
}

window.LaserTrap = LaserTrap;
window.HazardZone = HazardZone;
