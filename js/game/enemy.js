/* ==========================================================================
   Shadow Escape - Human Security Guards & Advanced Flighter Drones
   ========================================================================== */

class PatrolBot {
    constructor(x, y, rangeLeft, rangeRight, speed = 0.9) {
        this.x = x;
        this.y = y;
        this.width = 46;
        this.height = 70;

        this.rangeLeft = rangeLeft;
        this.rangeRight = rangeRight;
        this.speed = speed;      // Patrol speed
        this.direction = 1;      // 1: Right, -1: Left

        this.damage = 25;
        this.animTimer = 0;

        // Load Guard PNG Image from uploads/
        this.spriteImg = new Image();
        this.spriteImg.src = 'uploads/guard.png';
        this.spriteLoaded = false;
        this.spriteImg.onload = () => { this.spriteLoaded = true; };
    }

    update(dt) {
        this.x += this.direction * this.speed;

        if (this.x >= this.rangeRight) {
            this.x = this.rangeRight;
            this.direction = -1;
        } else if (this.x <= this.rangeLeft) {
            this.x = this.rangeLeft;
            this.direction = 1;
        }

        this.animTimer += dt * 4;
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // 3D Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + this.width / 2, drawY + this.height + 2, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flashlight / Laser Vision Cone
        ctx.fillStyle = 'rgba(255, 51, 102, 0.22)';
        ctx.beginPath();
        ctx.moveTo(drawX + (this.direction === 1 ? this.width : 0), drawY + 20);
        ctx.lineTo(drawX + (this.direction === 1 ? this.width + 80 : -80), drawY - 12);
        ctx.lineTo(drawX + (this.direction === 1 ? this.width + 80 : -80), drawY + 55);
        ctx.closePath();
        ctx.fill();

        // Draw Image Sprite or Fallback Human Guard Vector
        if (this.spriteLoaded) {
            ctx.save();
            if (this.direction === -1) {
                ctx.translate(drawX + this.width, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(this.spriteImg, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
            }
            ctx.restore();
        } else {
            // Human Tactical Guard Vector
            const legAngle = Math.sin(this.animTimer) * 0.5;

            // Tactical Helmet & Red Visor
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(drawX + 11, drawY + 6, 24, 18);
            ctx.fillStyle = '#ff3366';
            const visorX = this.direction === 1 ? drawX + 23 : drawX + 11;
            ctx.fillRect(visorX, drawY + 12, 12, 6);

            // Armor Torso
            ctx.fillStyle = '#334155';
            ctx.fillRect(drawX + 8, drawY + 24, 30, 26);

            // Legs
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(drawX + 14, drawY + 50);
            ctx.lineTo(drawX + 14 + Math.sin(legAngle) * 10, drawY + 70);
            ctx.moveTo(drawX + 30, drawY + 50);
            ctx.lineTo(drawX + 30 - Math.sin(legAngle) * 10, drawY + 70);
            ctx.stroke();
        }

        ctx.restore();
    }
}

class FlyingDrone {
    constructor(x, y, rangeY = 40, speed = 0.9, pattern = 'sine', rangeX = 100) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = 52;
        this.height = 40;

        this.rangeY = rangeY;
        this.rangeX = rangeX;
        this.speed = speed;
        this.pattern = pattern; // 'sine', 'vertical', 'horizontal', 'hunter'
        this.time = Math.random() * 10;
        this.damage = 22;
        this.scanTimer = 0;

        // Load Drone PNG Image from uploads/
        this.spriteImg = new Image();
        this.spriteImg.src = 'uploads/drone.png';
        this.spriteLoaded = false;
        this.spriteImg.onload = () => { this.spriteLoaded = true; };
    }

    update(dt) {
        this.time += dt * this.speed * 2;
        this.scanTimer += dt * 3;

        if (this.pattern === 'vertical') {
            this.y = this.startY + Math.sin(this.time) * this.rangeY;
        } else if (this.pattern === 'horizontal') {
            this.x = this.startX + Math.sin(this.time) * this.rangeX;
        } else if (this.pattern === 'hunter') {
            // Slight tracking towards player position if within 350px
            if (window.gameEngine && window.gameEngine.player) {
                const player = window.gameEngine.player;
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 360) {
                    this.x += (dx / dist) * this.speed * 1.4;
                    this.y += (dy / dist) * this.speed * 0.8;
                } else {
                    this.y = this.startY + Math.sin(this.time) * (this.rangeY * 0.5);
                }
            }
        } else {
            // Default Sine Wave Hover
            this.x = this.startX + Math.cos(this.time * 0.7) * (this.rangeX * 0.5);
            this.y = this.startY + Math.sin(this.time) * this.rangeY;
        }
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // 1. Scanner Laser Beam
        const scanWidth = 60;
        const scanGrad = ctx.createLinearGradient(drawX + this.width / 2, drawY + this.height, drawX + this.width / 2, drawY + this.height + 90);
        scanGrad.addColorStop(0, 'rgba(176, 38, 255, 0.45)');
        scanGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(drawX + this.width / 2 - 8, drawY + this.height);
        ctx.lineTo(drawX + this.width / 2 - scanWidth / 2, drawY + this.height + 90);
        ctx.lineTo(drawX + this.width / 2 + scanWidth / 2, drawY + this.height + 90);
        ctx.lineTo(drawX + this.width / 2 + 8, drawY + this.height);
        ctx.closePath();
        ctx.fill();

        // 2. Drone Sprite or Fallback Vector
        if (this.spriteLoaded) {
            ctx.shadowColor = '#b026ff';
            ctx.shadowBlur = window.gamePerformanceMode ? 6 : 14;
            ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
        } else {
            ctx.fillStyle = '#b026ff';
            ctx.shadowColor = '#b026ff';
            ctx.shadowBlur = window.gamePerformanceMode ? 6 : 12;

            ctx.beginPath();
            ctx.moveTo(drawX + 26, drawY);
            ctx.lineTo(drawX + 52, drawY + 20);
            ctx.lineTo(drawX + 38, drawY + 40);
            ctx.lineTo(drawX + 14, drawY + 40);
            ctx.lineTo(drawX, drawY + 20);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

window.PatrolBot = PatrolBot;
window.FlyingDrone = FlyingDrone;
window.Flighter = FlyingDrone;
