/* ==========================================================================
   Shadow Escape - Energy Crystals, Keycards, Exit Doors & Checkpoints
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
        this.spriteImg = new Image();
        this.spriteImg.src = 'uploads/crystal.png';
        this.spriteLoaded = false;
        this.spriteImg.onload = () => { this.spriteLoaded = true; };
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

        if (this.spriteLoaded) {
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
        this.width = 32;
        this.height = 32;
        this.collected = false;
        this.time = Math.random() * 5;
    }

    update(dt) {
        this.time += dt * 4;
    }

    draw(ctx, cameraOffset) {
        if (this.collected) return;

        const floatY = Math.sin(this.time) * 4;
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y + floatY;

        ctx.save();
        
        // Render Realistic Metallic Golden Master Key 🔑
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = window.gamePerformanceMode ? 8 : 16;

        // 1. Key Head (Circular Ring with Metallic Gold Radial Gradient)
        const headGrad = ctx.createRadialGradient(
            drawX + 10, drawY + 12, 2,
            drawX + 10, drawY + 12, 10
        );
        headGrad.addColorStop(0, '#ffffff');
        headGrad.addColorStop(0.35, '#fbbf24');
        headGrad.addColorStop(1, '#b45309');

        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(drawX + 10, drawY + 12, 9, 0, Math.PI * 2);
        ctx.fill();

        // 2. Inner Hole of Key Ring
        ctx.fillStyle = '#06070a';
        ctx.beginPath();
        ctx.arc(drawX + 10, drawY + 12, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Key Shaft / Stem
        const stemGrad = ctx.createLinearGradient(drawX + 16, drawY + 10, drawX + 32, drawY + 14);
        stemGrad.addColorStop(0, '#fef08a');
        stemGrad.addColorStop(0.5, '#fbbf24');
        stemGrad.addColorStop(1, '#d97706');

        ctx.fillStyle = stemGrad;
        ctx.fillRect(drawX + 16, drawY + 10, 16, 4);

        // 4. Key Teeth / Notches
        ctx.fillRect(drawX + 23, drawY + 14, 3, 5);
        ctx.fillRect(drawX + 28, drawY + 14, 4, 6);

        // 5. Golden Metallic Highlight Sparkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(drawX + 7, drawY + 9, 1.8, 0, Math.PI * 2);
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
