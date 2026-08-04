/* ==========================================================================
   Shadow Escape - Energy Crystals, Golden Keycards, Exit Doors & Checkpoints
   ========================================================================== */

class EnergyCrystal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.collected = false;

        this.time = Math.random() * 10;
        this.rotationAngle = 0;

        // Load Crystal PNG Image from uploads/
        if (window.assetManager) {
            this.spriteImg = window.assetManager.getImage('uploads/crystal.png');
            this.spriteLoaded = this.spriteImg.loaded;
        } else {
            this.spriteImg = new Image();
            this.spriteImg.src = 'uploads/crystal.png';
            this.spriteLoaded = false;
            this.spriteImg.onload = () => { this.spriteLoaded = true; };
        }
    }

    update(dt) {
        this.time += dt * 3;
        this.rotationAngle += dt * 2;
    }

    draw(ctx, cameraOffset) {
        if (this.collected) return;

        const floatY = Math.sin(this.time) * 5;
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y + floatY;

        ctx.save();

        if (this.spriteLoaded || (this.spriteImg && this.spriteImg.loaded)) {
            ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
        } else {
            ctx.translate(drawX + 15, drawY + 15);

            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(12 * Math.cos(this.rotationAngle), 0);
            ctx.lineTo(0, 15);
            ctx.lineTo(-12 * Math.cos(this.rotationAngle), 0);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, -15, 0, 15);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.5, '#00f3ff');
            grad.addColorStop(1, '#b026ff');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        ctx.restore();
    }
}

class Keycard {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 36;
        this.collected = false;
        this.time = Math.random() * 5;
        this.auraAngle = 0;
    }

    update(dt) {
        this.time += dt * 4;
        this.auraAngle += dt * 3;
    }

    draw(ctx, cameraOffset) {
        if (this.collected) return;

        const floatY = Math.sin(this.time) * 6;
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y + floatY;

        ctx.save();

        // 0. Golden Pulsing Beacon Light Ring
        const pulse = 14 + Math.sin(this.auraAngle * 2) * 6;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX + 18, drawY + 18, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // 1. Key Head (Circular Ring with Metallic Gold Radial Gradient)
        const headGrad = ctx.createRadialGradient(
            drawX + 12, drawY + 14, 2,
            drawX + 12, drawY + 14, 12
        );
        headGrad.addColorStop(0, '#ffffff');
        headGrad.addColorStop(0.35, '#fbbf24');
        headGrad.addColorStop(1, '#b45309');

        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(drawX + 12, drawY + 14, 10, 0, Math.PI * 2);
        ctx.fill();

        // 2. Inner Hole of Key Ring
        ctx.fillStyle = '#06070a';
        ctx.beginPath();
        ctx.arc(drawX + 12, drawY + 14, 4, 0, Math.PI * 2);
        ctx.fill();

        // 3. Key Shaft / Stem
        const stemGrad = ctx.createLinearGradient(drawX + 18, drawY + 12, drawX + 34, drawY + 16);
        stemGrad.addColorStop(0, '#fef08a');
        stemGrad.addColorStop(0.5, '#fbbf24');
        stemGrad.addColorStop(1, '#d97706');

        ctx.fillStyle = stemGrad;
        ctx.fillRect(drawX + 18, drawY + 12, 16, 5);

        // 4. Key Teeth / Notches
        ctx.fillRect(drawX + 25, drawY + 17, 4, 6);
        ctx.fillRect(drawX + 30, drawY + 17, 4, 7);

        // 5. Golden Metallic Highlight Sparkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(drawX + 9, drawY + 10, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class ExitDoor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 52;
        this.height = 82;
        this.isUnlocked = false;
        this.animTime = Math.random() * 10;
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;
        this.animTime += 0.05;

        ctx.save();

        // 1. Dark Metallic Security Frame
        const frameGrad = ctx.createLinearGradient(drawX, drawY, drawX + this.width, drawY + this.height);
        frameGrad.addColorStop(0, '#1e293b');
        frameGrad.addColorStop(0.5, '#0f172a');
        frameGrad.addColorStop(1, '#020617');

        ctx.fillStyle = frameGrad;
        ctx.fillRect(drawX, drawY, this.width, this.height);

        // 2. Glowing Status Border Frame
        const statusColor = this.isUnlocked ? '#10b981' : '#ef4444';
        ctx.strokeStyle = statusColor;
        if (!window.gamePerformanceMode) {
            ctx.shadowColor = statusColor;
            ctx.shadowBlur = 20;
        }
        ctx.lineWidth = 3.5;
        ctx.strokeRect(drawX, drawY, this.width, this.height);

        // 3. Center Portal Chamber / Beam
        const beamGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
        if (this.isUnlocked) {
            beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
            beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.85)');
            beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0.95)');
        } else {
            beamGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
            beamGrad.addColorStop(0.5, 'rgba(185, 28, 28, 0.7)');
            beamGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
        }
        ctx.fillStyle = beamGrad;
        ctx.fillRect(drawX + 6, drawY + 6, this.width - 12, this.height - 12);

        // 4. Moving Laser Scanline Overlay
        const scanY = drawY + 6 + (Math.sin(this.animTime * 2) * 0.5 + 0.5) * (this.height - 14);
        ctx.strokeStyle = this.isUnlocked ? '#ffffff' : '#fca5a5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(drawX + 6, scanY);
        ctx.lineTo(drawX + this.width - 6, scanY);
        ctx.stroke();

        // 5. Corner Status Indicator LEDs
        [ { x: drawX + 4, y: drawY + 4 }, { x: drawX + this.width - 4, y: drawY + 4 } ].forEach(led => {
            ctx.fillStyle = statusColor;
            ctx.beginPath();
            ctx.arc(led.x, led.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}

class Checkpoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 46;
        this.activated = false;
        this.animTime = Math.random() * 10;
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;
        this.animTime += 0.04;

        ctx.save();

        const activeColor = this.activated ? '#10b981' : '#38bdf8';

        // 1. Telemetry Station Post / Pillar
        const postGrad = ctx.createLinearGradient(drawX, drawY, drawX + this.width, drawY);
        postGrad.addColorStop(0, '#334155');
        postGrad.addColorStop(0.5, '#0f172a');
        postGrad.addColorStop(1, '#1e293b');

        ctx.fillStyle = postGrad;
        ctx.fillRect(drawX + 10, drawY + 12, 8, this.height - 12);

        // Vertical Laser Light Beam
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 2;
        if (!window.gamePerformanceMode) {
            ctx.shadowColor = activeColor;
            ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.moveTo(drawX + 14, drawY + 14);
        ctx.lineTo(drawX + 14, drawY + this.height);
        ctx.stroke();

        // 2. Floating Holographic Beacon Orb
        const floatY = Math.sin(this.animTime * 3) * 3;
        const orbX = drawX + 14;
        const orbY = drawY + 10 + floatY;

        // Pulse Ring
        const ringPulse = 10 + Math.sin(this.animTime * 4) * 3;
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(orbX, orbY, ringPulse, 0, Math.PI * 2);
        ctx.stroke();

        // Core Glowing Sphere
        const orbGrad = ctx.createRadialGradient(orbX - 2, orbY - 2, 1, orbX, orbY, 8);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.4, activeColor);
        orbGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

window.EnergyCrystal = EnergyCrystal;
window.Keycard = Keycard;
window.ExitDoor = ExitDoor;
window.Checkpoint = Checkpoint;
