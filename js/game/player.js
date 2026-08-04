/* ==========================================================================
   Shadow Escape - Human Persona Runner (Original Jump & Dedicated Flight Action)
   ========================================================================== */

class Player {
    constructor(x, y) {
        // Position & Dimensions
        this.x = x;
        this.y = y;
        this.width = 44;
        this.height = 72;

        // Original Physics Parameters (Gentle & soft jump physics intact)
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 3.6;
        this.accel = 0.6;
        this.friction = 0.82;
        this.gravity = 0.32;
        this.jumpForce = -8.5;
        this.coyoteTimeMax = 0.12;
        this.jumpBufferMax = 0.12;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;

        // Dedicated Flight / Jetpack Ability
        this.isFlying = false;
        this.flightFuel = 100;
        this.maxFlightFuel = 100;
        this.flightFuelConsumption = 30; // Fuel used per sec
        this.flightFuelRecharge = 45;    // Fuel recharged per sec when grounded
        this.flightThrust = -0.55;       // Upward acceleration when holding Flight button

        this.applyViewportTuning();

        // State Flags & Animation Controls
        this.isGrounded = false;
        this.canDoubleJump = true;
        this.isFacingRight = true;
        this.animTimer = 0;
        this.currentAction = 'stand'; // 'stand', 'slow_walk', 'run', 'jump', 'flight'

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
        this.attackCooldown = 0;
        this.attackTimer = 0;
        this.isFighting = false;

        // Checkpoint
        this.spawnX = x;
        this.spawnY = y;

        // Preload Action Images from uploads/
        this.sprites = {
            stand: this.loadImage('uploads/player_stand.png'),
            slow_walk: this.loadImage('uploads/player_slow_walk.png'),
            run: [
                this.loadImage('uploads/player_run1.png'),
                this.loadImage('uploads/player_run2.png'),
                this.loadImage('uploads/player_run3.png'),
                this.loadImage('uploads/player run 4.png'),
                this.loadImage('uploads/player run 5.png'),
                this.loadImage('uploads/player run 6.png')
            ],
            jump: this.loadImage('uploads/player_jump2.png'),
            flight: [
                this.loadImage('uploads/player_flight1.png'),
                this.loadImage('uploads/player_flight2.png'),
                this.loadImage('uploads/player_flight3.png'),
                this.loadImage('uploads/player_flight4.png')
            ]
        };
    }

    loadImage(src) {
        if (window.assetManager) {
            return window.assetManager.getImage(src);
        }
        const img = new Image();
        img.src = src;
        img.loaded = false;
        img.onload = () => { img.loaded = true; };
        return img;
    }

    applyViewportTuning() {
        const isLaptopViewport = window.innerWidth > 900 && window.innerWidth <= 1440;

        if (isLaptopViewport) {
            this.speed = 4.0;
            this.accel = 0.68;
            this.friction = 0.84;
            this.gravity = 0.28;
            this.jumpForce = -9.6;
            this.dashSpeed = 9.0;
        }
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
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.flightFuel = this.maxFlightFuel;
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
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
        if (this.dashCooldown > 0) this.dashCooldown -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.attackTimer > 0) this.attackTimer -= dt;

        if (this.isGrounded) {
            this.coyoteTimer = this.coyoteTimeMax;
            // Recharge flight fuel when grounded
            this.flightFuel = Math.min(this.maxFlightFuel, this.flightFuel + this.flightFuelRecharge * dt);
        } else {
            this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
        }

        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
        }

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
            this.currentAction = 'flight';
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

        // Dedicated Fight / Attack Combat Action Check
        const wantsFight = input.isFlightPressed();
        if (wantsFight && this.attackCooldown <= 0) {
            this.isFighting = true;
            this.attackTimer = 0.25;
            this.attackCooldown = 0.35;
            this.jumpBufferTimer = 0; // Prevent jumping when attacking

            if (window.particleSystem) {
                const slashX = this.isFacingRight ? this.x + this.width + 10 : this.x - 10;
                window.particleSystem.createHitSparks(slashX, this.y + 30);
            }
            if (window.soundEngine) {
                window.soundEngine.playAttack();
            }
        } else if (this.attackTimer > 0) {
            this.isFighting = true;
        } else {
            this.isFighting = false;

            // Jump Input (ONLY evaluated when NOT clicking Fight)
            if (input.consumeJumpPressed()) {
                this.jumpBufferTimer = this.jumpBufferMax;
            }

            if (this.jumpBufferTimer > 0) {
                if (this.isGrounded || this.coyoteTimer > 0) {
                    this.velocityY = this.jumpForce;
                    this.isGrounded = false;
                    this.canDoubleJump = true;
                    this.coyoteTimer = 0;
                    this.jumpBufferTimer = 0;
                    if (window.soundEngine) window.soundEngine.playJump();
                    if (window.particleSystem) window.particleSystem.createJumpDust(this.x + this.width / 2, this.y + this.height);
                } else if (this.canDoubleJump) {
                    this.velocityY = this.jumpForce * 0.85;
                    this.canDoubleJump = false;
                    this.jumpBufferTimer = 0;
                    if (window.soundEngine) window.soundEngine.playDoubleJump();
                    if (window.particleSystem) window.particleSystem.createJumpDust(this.x + this.width / 2, this.y + this.height);
                }
            }
        }

        // Gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Reset grounded state (evaluated by physics collisions)
        this.isGrounded = false;

        // Animation Timer Increment
        this.animTimer += dt * 8;

        // Determine current action state
        const speedMagnitude = Math.abs(this.velocityX);
        if (this.isFighting) {
            // Display Fight knife attack action frames (player_flight1..4.png)
            this.currentAction = 'flight';
        } else if (!this.isGrounded && Math.abs(this.velocityY) > 0.5) {
            this.currentAction = 'jump';
        } else if (speedMagnitude > 2.0) {
            this.currentAction = 'run';
        } else if (speedMagnitude > 0.15) {
            this.currentAction = 'slow_walk';
        } else {
            this.currentAction = 'stand';
        }
    }

    getActiveImage() {
        const spr = this.sprites;
        if (!spr) return null;

        switch (this.currentAction) {
            case 'flight': {
                const idx = Math.floor(this.animTimer * 1.5) % spr.flight.length;
                return spr.flight[idx];
            }
            case 'jump':
                return spr.jump;
            case 'run': {
                const idx = Math.floor(this.animTimer * 1.2) % spr.run.length;
                return spr.run[idx];
            }
            case 'slow_walk':
                return spr.slow_walk;
            case 'stand':
            default:
                return spr.stand;
        }
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

        const activeImg = this.getActiveImage();

        if (activeImg && activeImg.loaded && activeImg.naturalHeight > 0) {
            const aspect = activeImg.naturalWidth / activeImg.naturalHeight;

            // Height tuned per action state, width derived from natural image aspect ratio
            let drawHeight = 78;
            let widthScale = 1.0;

            if (this.currentAction === 'stand') {
                drawHeight = 80; // Perfect tall standing hero stance
            } else if (this.currentAction === 'slow_walk') {
                drawHeight = 78;
            } else if (this.currentAction === 'run') {
                drawHeight = 72;
                widthScale = 0.86; // Reduced running player width slightly as requested
            } else if (this.currentAction === 'jump') {
                drawHeight = 58;
                widthScale = 0.78; // Reduced width of jumping person as requested
            } else if (this.currentAction === 'flight') {
                drawHeight = 72; // Fight knife combat action stance
            }

            const drawWidth = drawHeight * aspect * widthScale; // Scaled width
            const offsetX = (this.width - drawWidth) / 2;
            const offsetY = this.height - drawHeight; // Align feet with ground level

            ctx.save();
            if (!this.isFacingRight) {
                ctx.translate(drawX + this.width / 2 + drawWidth / 2, drawY + offsetY);
                ctx.scale(-1, 1);
                ctx.drawImage(activeImg, 0, 0, drawWidth, drawHeight);
            } else {
                ctx.drawImage(activeImg, drawX + offsetX, drawY + offsetY, drawWidth, drawHeight);
            }
            ctx.restore();
        } else {
            // Detailed Vector Fallback if images loading
            const legAngle = Math.sin(this.animTimer) * (Math.abs(this.velocityX) > 0.5 ? 0.6 : 0.1);

            ctx.fillStyle = this.isFlying ? '#fbbf24' : '#00f3ff';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = window.gamePerformanceMode ? 0 : 12;
            ctx.beginPath();
            ctx.arc(drawX + 22, drawY + 14, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0a1a36';
            ctx.fillRect(drawX + 11, drawY + 25, 22, 26);

            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(drawX + 16, drawY + 51);
            ctx.lineTo(drawX + 16 + Math.sin(legAngle) * 12, drawY + 72);
            ctx.moveTo(drawX + 28, drawY + 51);
            ctx.lineTo(drawX + 28 - Math.sin(legAngle) * 12, drawY + 72);
            ctx.stroke();
        }

        if (this.isFighting || this.attackTimer > 0) {
            ctx.save();
            ctx.strokeStyle = '#00f3ff';
            if (!window.gamePerformanceMode) {
                ctx.shadowColor = '#00f3ff';
                ctx.shadowBlur = 18;
            }
            ctx.lineWidth = 4;
            ctx.beginPath();
            const arcCenterX = this.isFacingRight ? drawX + this.width + 12 : drawX - 12;
            const arcCenterY = drawY + 36;
            ctx.arc(arcCenterX, arcCenterY, 32, this.isFacingRight ? -Math.PI * 0.45 : Math.PI * 0.55, this.isFacingRight ? Math.PI * 0.45 : Math.PI * 1.45);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }

    getAttackHitbox() {
        if (!this.isFighting && this.attackTimer <= 0) return null;
        const reach = 60;
        return {
            x: this.isFacingRight ? this.x + this.width - 10 : this.x - reach + 10,
            y: this.y + 10,
            width: reach,
            height: this.height - 20
        };
    }
}

window.Player = Player;
