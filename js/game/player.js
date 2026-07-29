/* ==========================================================================
   Shadow Escape - Human Persona Runner (Gentle & Slow Jump Physics)
   ========================================================================== */

class Player {
    constructor(x, y) {
        // Position & Dimensions
        this.x = x;
        this.y = y;
        this.width = 44;
        this.height = 72;

        // Physics Parameters (Gentle & slow vertical jumping speed)
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 3.6;
        this.accel = 0.6;
        this.friction = 0.82;
        this.gravity = 0.32;     // Reduced from 0.48 for slow, soft float
        this.jumpForce = -8.5;   // Reduced from -11.0 for gentle, controlled jump

        // State Flags
        this.isGrounded = false;
        this.canDoubleJump = true;
        this.isFacingRight = true;
        this.animTimer = 0;

        // Dash Ability
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDuration = 0.18;
        this.dashCooldown = 0;
        this.maxDashCooldown = 0.8;
        this.dashSpeed = 8.5;

        // Health & Damage
        this.hp = 100;
        this.maxHp = 100;
        this.invincibleTimer = 0;

        // Checkpoint
        this.spawnX = x;
        this.spawnY = y;

        // Load Human Hero PNG Sprite Image from uploads/
        this.spriteImg = new Image();
        this.spriteImg.src = 'uploads/player.png';
        this.spriteLoaded = false;
        this.spriteImg.onload = () => { this.spriteLoaded = true; };
    }

    setCheckpoint(x, y) {
        this.spawnX = x;
        this.spawnY = y;
    }

    respawn() {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hp = this.maxHp;
        this.invincibleTimer = 1.5;
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0 || this.isDashing) return false;
        this.hp = Math.max(0, this.hp - amount);
        this.invincibleTimer = 1.2;

        if (window.soundEngine) window.soundEngine.playHurt();
        if (window.Camera && window.camera) window.camera.shake(14, 280);

        return true;
    }

    update(dt, input) {
        // Cooldowns
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
        if (this.dashCooldown > 0) this.dashCooldown -= dt;

        // Dash State
        if (this.isDashing) {
            this.dashTimer -= dt;
            this.velocityY = 0;
            this.velocityX = (this.isFacingRight ? 1 : -1) * this.dashSpeed;

            if (window.particleSystem) {
                window.particleSystem.createDashGhost(this.x, this.y, this.width, this.height, this.isFacingRight);
            }

            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }

            this.x += this.velocityX;
            return;
        }

        // Horizontal Movement Input
        if (input.isLeft()) {
            this.velocityX -= this.accel;
            this.isFacingRight = false;
        } else if (input.isRight()) {
            this.velocityX += this.accel;
            this.isFacingRight = true;
        } else {
            this.velocityX *= this.friction;
        }

        this.velocityX = Math.max(-this.speed, Math.min(this.speed, this.velocityX));
        this.x += this.velocityX;

        // Dash Input
        if (input.isDashPressed() && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldown = this.maxDashCooldown;
            if (window.soundEngine) window.soundEngine.playDash();
        }

        // Jump Input
        if (input.isJumpPressed()) {
            if (this.isGrounded) {
                this.velocityY = this.jumpForce;
                this.isGrounded = false;
                this.canDoubleJump = true;
                if (window.soundEngine) window.soundEngine.playJump();
                if (window.particleSystem) window.particleSystem.createJumpDust(this.x + this.width / 2, this.y + this.height);
                input.touch.jump = false;
            } else if (this.canDoubleJump) {
                this.velocityY = this.jumpForce * 0.85;
                this.canDoubleJump = false;
                if (window.soundEngine) window.soundEngine.playDoubleJump();
                if (window.particleSystem) window.particleSystem.createJumpDust(this.x + this.width / 2, this.y + this.height);
                input.touch.jump = false;
            }
        }

        // Gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        this.isGrounded = false;
        this.animTimer += dt * 6;
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // Flashing Invincibility
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer * 20) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        // Human 3D Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + this.width / 2, drawY + this.height + 2, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Image Sprite or Fallback Detailed Vector Human Character
        if (this.spriteLoaded) {
            ctx.save();
            if (!this.isFacingRight) {
                ctx.translate(drawX + this.width, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(this.spriteImg, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
            }
            ctx.restore();
        } else {
            // Detailed Vector Human Persona Animation
            const legAngle = Math.sin(this.animTimer) * (Math.abs(this.velocityX) > 0.5 ? 0.6 : 0.1);

            // Head & Helmet
            ctx.fillStyle = '#00f3ff';
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(drawX + 22, drawY + 14, 11, 0, Math.PI * 2);
            ctx.fill();

            // Torso (Stealth Suit)
            ctx.fillStyle = '#0a1a36';
            ctx.fillRect(drawX + 11, drawY + 25, 22, 26);

            // Legs
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(drawX + 16, drawY + 51);
            ctx.lineTo(drawX + 16 + Math.sin(legAngle) * 12, drawY + 72);
            ctx.moveTo(drawX + 28, drawY + 51);
            ctx.lineTo(drawX + 28 - Math.sin(legAngle) * 12, drawY + 72);
            ctx.stroke();
        }

        ctx.restore();
    }
}

window.Player = Player;
