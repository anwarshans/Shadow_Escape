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
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = window.gamePerformanceMode ? 8 : 15;
            ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
        } else {
            ctx.translate(drawX + 15, drawY + 15);
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = window.gamePerformanceMode ? 8 : 15;

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
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = window.gamePerformanceMode ? 10 : 20;
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
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // Security Frame
        ctx.fillStyle = '#0a1024';
        ctx.fillRect(drawX, drawY, this.width, this.height);
        ctx.strokeStyle = this.isUnlocked ? '#00ff88' : '#ff3366';
        ctx.shadowColor = this.isUnlocked ? '#00ff88' : '#ff3366';
        ctx.shadowBlur = window.gamePerformanceMode ? 9 : 18;
        ctx.lineWidth = 4;
        ctx.strokeRect(drawX, drawY, this.width, this.height);

        // Center Portal Beam
        const beamGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
        if (this.isUnlocked) {
            beamGrad.addColorStop(0, 'rgba(0, 255, 136, 0.45)');
            beamGrad.addColorStop(1, 'rgba(0, 243, 255, 0.85)');
        } else {
            beamGrad.addColorStop(0, 'rgba(255, 51, 102, 0.35)');
            beamGrad.addColorStop(1, 'rgba(10, 16, 36, 0.95)');
        }
        ctx.fillStyle = beamGrad;
        ctx.fillRect(drawX + 5, drawY + 5, this.width - 10, this.height - 10);

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
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(drawX + 10, drawY, 8, this.height);

        ctx.fillStyle = this.activated ? '#00ff88' : '#00f3ff';
        ctx.shadowColor = this.activated ? '#00ff88' : '#00f3ff';
        ctx.shadowBlur = window.gamePerformanceMode ? 7 : 14;

        ctx.beginPath();
        ctx.arc(drawX + 14, drawY + 10, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

window.EnergyCrystal = EnergyCrystal;
window.Keycard = Keycard;
window.ExitDoor = ExitDoor;
window.Checkpoint = Checkpoint;
