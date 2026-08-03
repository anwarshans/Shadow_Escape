/* ==========================================================================
   Shadow Escape - Human Security Guards, Stair Fighters & Advanced Drones
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

        this.hp = 60;
        this.maxHp = 60;
        this.damage = 25;
        this.animTimer = 0;
        this.hurtTimer = 0;
        this.isDead = false;

        // Load Guard PNG Image from uploads/
        if (window.assetManager) {
            this.spriteImg = window.assetManager.getImage('uploads/guard.png');
            this.spriteLoaded = this.spriteImg.loaded;
        } else {
            this.spriteImg = new Image();
            this.spriteImg.src = 'uploads/guard.png';
            this.spriteLoaded = false;
            this.spriteImg.onload = () => { this.spriteLoaded = true; };
        }
    }

    takeDamage(amount) {
        if (this.isDead || this.hurtTimer > 0) return false;
        this.hp -= amount;
        this.hurtTimer = 0.3;

        if (window.particleSystem) {
            window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 10, `-${amount} HP`, '#ff3366');
            window.particleSystem.createHitSparks(this.x + this.width / 2, this.y + this.height / 2);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            if (window.particleSystem) {
                window.particleSystem.createExplosion(this.x + this.width / 2, this.y + this.height / 2);
                window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 30, 'GUARD DOWN!', '#fbbf24');
            }
            if (window.soundEngine) window.soundEngine.playExplosion();
        } else if (window.soundEngine) {
            window.soundEngine.playEnemyHit();
        }

        return true;
    }

    update(dt) {
        if (this.isDead) return;

        if (this.hurtTimer > 0) this.hurtTimer -= dt;

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
        if (this.isDead) return;

        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // 3D Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + this.width / 2, drawY + this.height + 2, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Health bar
        if (this.hp < this.maxHp) {
            const barW = 40;
            const barH = 5;
            const barX = drawX + (this.width - barW) / 2;
            const barY = drawY - 10;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(barX, barY, barW * (this.hp / this.maxHp), barH);
        }

        // Flashlight / Laser Vision Cone
        ctx.fillStyle = 'rgba(255, 51, 102, 0.22)';
        ctx.beginPath();
        ctx.moveTo(drawX + (this.direction === 1 ? this.width : 0), drawY + 20);
        ctx.lineTo(drawX + (this.direction === 1 ? this.width + 80 : -80), drawY - 12);
        ctx.lineTo(drawX + (this.direction === 1 ? this.width + 80 : -80), drawY + 55);
        ctx.closePath();
        ctx.fill();

        if (this.hurtTimer > 0) {
            ctx.filter = 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)';
        }

        // Draw Image Sprite or Fallback Human Guard Vector
        if (this.spriteLoaded || (this.spriteImg && this.spriteImg.loaded)) {
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

            ctx.fillStyle = '#1e293b';
            ctx.fillRect(drawX + 11, drawY + 6, 24, 18);
            ctx.fillStyle = '#ff3366';
            const visorX = this.direction === 1 ? drawX + 23 : drawX + 11;
            ctx.fillRect(visorX, drawY + 12, 12, 6);

            ctx.fillStyle = '#334155';
            ctx.fillRect(drawX + 8, drawY + 24, 30, 26);

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

class Fighter {
    constructor(x, y, rangeLeft, rangeRight, speed = 1.1, hp = 60) {
        this.x = x;
        this.y = y;
        this.width = 52;
        this.height = 76;

        this.rangeLeft = rangeLeft;
        this.rangeRight = rangeRight;
        this.speed = speed;
        this.direction = 1; // 1: Right, -1: Left

        this.hp = hp;
        this.maxHp = hp;
        this.damage = 25;
        this.animTimer = 0;
        this.attackCooldown = 0;
        this.hurtTimer = 0;
        this.isDead = false;
        this.isFighting = false;

        // Walking PNG frames for normal time (patrol / walk without fighting)
        this.walkSprites = [
            this.loadImage('uploads/fighter walk 1.png'),
            this.loadImage('uploads/fighter walk 2.png'),
            this.loadImage('uploads/fighter walk 3.png')
        ];

        // Fighting PNG frames for combat / attacking player
        this.fightSprites = [
            this.loadImage('uploads/fighter 1.png'),
            this.loadImage('uploads/fighter 2.png'),
            this.loadImage('uploads/fighter 3.png'),
            this.loadImage('uploads/fighter 4.png')
        ];

        this.sprites = this.walkSprites;
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

    takeDamage(amount) {
        if (this.isDead || this.hurtTimer > 0) return false;
        this.hp -= amount;
        this.hurtTimer = 0.3;

        if (window.particleSystem) {
            window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 10, `-${amount} HP`, '#ff3366');
            window.particleSystem.createHitSparks(this.x + this.width / 2, this.y + this.height / 2);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            if (window.particleSystem) {
                window.particleSystem.createExplosion(this.x + this.width / 2, this.y + this.height / 2);
                window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 30, 'FIGHTER ELIMINATED!', '#fbbf24');
            }
            if (window.soundEngine) window.soundEngine.playExplosion();
        } else if (window.soundEngine) {
            window.soundEngine.playEnemyHit();
        }

        return true;
    }

    update(dt) {
        if (this.isDead) return;

        if (this.hurtTimer > 0) this.hurtTimer -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;

        this.isFighting = false;

        // Stair attack AI: check distance to player
        if (window.gameEngine && window.gameEngine.player) {
            const player = window.gameEngine.player;
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.hypot(dx, dy);

            // If player is on or near the stair platform
            if (dist < 200 && Math.abs(dy) < 85) {
                this.direction = dx > 0 ? 1 : -1;

                if (dist < 70 || this.attackCooldown > 0.3) {
                    this.isFighting = true;
                    if (dist < 60 && this.attackCooldown <= 0) {
                        // Perform Stair Attack
                        this.attackCooldown = 0.9;
                        if (window.particleSystem) {
                            const slashX = this.direction === 1 ? this.x + this.width : this.x - 15;
                            window.particleSystem.createHitSparks(slashX, this.y + 35);
                        }
                    }
                } else if (dist >= 45) {
                    // March aggressively on stair step
                    this.x += this.direction * (this.speed * 1.35);
                }
            } else {
                // Patrol stair bounds in normal time
                this.x += this.direction * this.speed;
                if (this.x >= this.rangeRight) {
                    this.x = this.rangeRight;
                    this.direction = -1;
                } else if (this.x <= this.rangeLeft) {
                    this.x = this.rangeLeft;
                    this.direction = 1;
                }
            }
        }

        this.animTimer += dt * 8;
    }

    draw(ctx, cameraOffset) {
        if (this.isDead) return;

        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        // 3D Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(drawX + this.width / 2, drawY + this.height + 2, 22, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cyber Health Bar above head
        const barWidth = 46;
        const barHeight = 6;
        const barX = drawX + (this.width - barWidth) / 2;
        const barY = drawY - 14;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

        const hpPct = Math.max(0, this.hp / this.maxHp);
        const hpColor = hpPct > 0.5 ? '#10b981' : (hpPct > 0.25 ? '#fbbf24' : '#ef4444');
        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barWidth * hpPct, barHeight);


        if (this.hurtTimer > 0) {
            ctx.filter = 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)';
        }

        // Draw active Fighter frame (fighter walk 1..3 in normal time, fighter 1..4 when fighting player)
        const activeFrames = this.isFighting ? this.fightSprites : this.walkSprites;
        const frameIdx = Math.floor(this.animTimer) % activeFrames.length;
        const currentSpr = activeFrames[frameIdx];

        if (currentSpr && currentSpr.loaded && currentSpr.naturalHeight > 0) {
            const aspect = currentSpr.naturalWidth / currentSpr.naturalHeight;
            const drawWidth = this.height * aspect;
            const offsetX = (this.width - drawWidth) / 2;

            ctx.save();
            if (this.direction === -1) {
                ctx.translate(drawX + this.width / 2 + drawWidth / 2, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(currentSpr, 0, 0, drawWidth, this.height);
            } else {
                ctx.drawImage(currentSpr, drawX + offsetX, drawY, drawWidth, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(drawX, drawY, this.width, this.height);
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
        this.hp = 40;
        this.maxHp = 40;
        this.damage = 22;
        this.scanTimer = 0;
        this.hurtTimer = 0;
        this.isDead = false;

        // Load Drone PNG Image from uploads/
        if (window.assetManager) {
            this.spriteImg = window.assetManager.getImage('uploads/drone.png');
            this.spriteLoaded = this.spriteImg.loaded;
        } else {
            this.spriteImg = new Image();
            this.spriteImg.src = 'uploads/drone.png';
            this.spriteLoaded = false;
            this.spriteImg.onload = () => { this.spriteLoaded = true; };
        }
    }

    takeDamage(amount) {
        if (this.isDead || this.hurtTimer > 0) return false;
        this.hp -= amount;
        this.hurtTimer = 0.3;

        if (window.particleSystem) {
            window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 10, `-${amount} HP`, '#ff3366');
            window.particleSystem.createHitSparks(this.x + this.width / 2, this.y + this.height / 2);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            if (window.particleSystem) {
                window.particleSystem.createExplosion(this.x + this.width / 2, this.y + this.height / 2);
                window.particleSystem.createDamageText(this.x + this.width / 2, this.y - 25, 'DRONE DESTROYED!', '#fbbf24');
            }
            if (window.soundEngine) window.soundEngine.playExplosion();
        } else if (window.soundEngine) {
            window.soundEngine.playEnemyHit();
        }

        return true;
    }

    update(dt) {
        if (this.isDead) return;

        if (this.hurtTimer > 0) this.hurtTimer -= dt;

        this.time += dt * this.speed * 2;
        this.scanTimer += dt * 3;

        if (this.pattern === 'vertical') {
            this.y = this.startY + Math.sin(this.time) * this.rangeY;
        } else if (this.pattern === 'horizontal') {
            this.x = this.startX + Math.sin(this.time) * this.rangeX;
        } else if (this.pattern === 'hunter') {
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
            this.x = this.startX + Math.cos(this.time * 0.7) * (this.rangeX * 0.5);
            this.y = this.startY + Math.sin(this.time) * this.rangeY;
        }
    }

    draw(ctx, cameraOffset) {
        if (this.isDead) return;

        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        if (this.hp < this.maxHp) {
            const barW = 36;
            const barH = 4;
            const barX = drawX + (this.width - barW) / 2;
            const barY = drawY - 8;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
            ctx.fillStyle = '#b026ff';
            ctx.fillRect(barX, barY, barW * (this.hp / this.maxHp), barH);
        }

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

        if (this.hurtTimer > 0) {
            ctx.filter = 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)';
        }

        // 2. Drone Sprite or Fallback Vector
        if (this.spriteLoaded || (this.spriteImg && this.spriteImg.loaded)) {
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
window.Fighter = Fighter;
window.FlyingDrone = FlyingDrone;
window.Flighter = FlyingDrone;
