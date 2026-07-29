/* ==========================================================================
   Shadow Escape - Human Security Guards & Flying Drone Enemies
   ========================================================================== */

class PatrolBot {
    constructor(x, y, rangeLeft, rangeRight, speed = 2) {
        this.x = x;
        this.y = y;
        this.width = 46;
        this.height = 70;

        this.rangeLeft = rangeLeft;
        this.rangeRight = rangeRight;
        this.speed = speed;
        this.direction = 1; // 1: Right, -1: Left

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

        this.animTimer += dt * 8;
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
    constructor(x, y, rangeY = 40, speed = 1.5) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 36;

        this.rangeY = rangeY;
        this.speed = speed;
        this.time = Math.random() * 10;

        this.damage = 20;

        // Load Drone PNG Image from uploads/
        this.spriteImg = new Image();
        this.spriteImg.src = 'uploads/drone.png';
        this.spriteLoaded = false;
        this.spriteImg.onload = () => { this.spriteLoaded = true; };
    }

    update(dt) {
        this.time += dt * this.speed;
        this.y = this.startY + Math.sin(this.time) * this.rangeY;
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        if (this.spriteLoaded) {
            ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
        } else {
            ctx.fillStyle = '#b026ff';
            ctx.shadowColor = '#b026ff';
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.moveTo(drawX + 24, drawY);
            ctx.lineTo(drawX + 48, drawY + 18);
            ctx.lineTo(drawX + 36, drawY + 36);
            ctx.lineTo(drawX + 12, drawY + 36);
            ctx.lineTo(drawX, drawY + 18);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

window.PatrolBot = PatrolBot;
window.FlyingDrone = FlyingDrone;
