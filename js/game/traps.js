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
        ctx.shadowBlur = window.gamePerformanceMode ? 5 : 10;
        ctx.fillRect(drawX1 - 5, drawY1 - 5, 10, 10);
        ctx.fillRect(drawX2 - 5, drawY2 - 5, 10, 10);

        if (this.isActive) {
            // Outer Glowing Energy Beam
            ctx.strokeStyle = '#ff007f';
            ctx.shadowBlur = window.gamePerformanceMode ? 7 : 15;
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
        this.animTime = Math.random() * 100;
        
        // Original Stylized Fire particle pools
        this.flameParticles = [];
        this.smokeParticles = [];
        this.embers = [];
    }

    update(dt) {
        this.animTime += dt;

        if (this.isReactorFluid) return;

        // 1. Spawn Volumetric Flame Particles
        const spawnCount = Math.max(1, Math.floor(this.width / 10));
        for (let i = 0; i < spawnCount; i++) {
            if (Math.random() < 0.85) {
                const pX = this.x + Math.random() * this.width;
                const pY = this.y + this.height - Math.random() * 6;
                this.flameParticles.push({
                    x: pX,
                    y: pY,
                    vx: (Math.random() - 0.5) * 18,
                    vy: -Math.random() * 60 - 50,
                    size: Math.random() * 10 + 10,
                    maxLife: 0.35 + Math.random() * 0.35,
                    life: 1.0,
                    seed: Math.random() * 10
                });
            }
        }

        // 2. Spawn Dark Smoke Wisps
        if (Math.random() < 0.35) {
            this.smokeParticles.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height * 0.25 - Math.random() * 10,
                vx: (Math.random() - 0.5) * 22,
                vy: -Math.random() * 32 - 22,
                size: Math.random() * 12 + 14,
                maxLife: 0.8 + Math.random() * 0.6,
                life: 1.0
            });
        }

        // 3. Spawn Stylized Star/Diamond Ember Sparks
        if (Math.random() < 0.65) {
            this.embers.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height - Math.random() * 8,
                vx: (Math.random() - 0.5) * 32,
                vy: -Math.random() * 75 - 45,
                size: Math.random() * 2.2 + 1.2,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 12,
                maxLife: 0.55 + Math.random() * 0.55,
                life: 1.0,
                color: Math.random() > 0.3 ? '#ffea00' : '#ff5500'
            });
        }

        // Update Flame Particles
        for (let i = this.flameParticles.length - 1; i >= 0; i--) {
            const p = this.flameParticles[i];
            p.life -= dt / p.maxLife;
            if (p.life <= 0) {
                this.flameParticles.splice(i, 1);
                continue;
            }
            p.x += (p.vx + Math.sin(this.animTime * 9 + p.seed) * 20) * dt;
            p.y += p.vy * dt;
            p.size += dt * 9;
        }

        // Update Smoke Particles
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const s = this.smokeParticles[i];
            s.life -= dt / s.maxLife;
            if (s.life <= 0) {
                this.smokeParticles.splice(i, 1);
                continue;
            }
            s.x += (s.vx + Math.sin(this.animTime * 4 + i) * 14) * dt;
            s.y += s.vy * dt;
            s.size += dt * 18;
        }

        // Update Ember Particles
        for (let i = this.embers.length - 1; i >= 0; i--) {
            const e = this.embers[i];
            e.life -= dt / e.maxLife;
            if (e.life <= 0) {
                this.embers.splice(i, 1);
                continue;
            }
            e.x += (e.vx + Math.sin(this.animTime * 11 + i) * 24) * dt;
            e.y += e.vy * dt;
            e.angle += e.rotSpeed * dt;
        }
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
            ctx.shadowBlur = window.gamePerformanceMode ? 7 : 15;
            ctx.fillRect(drawX, drawY, this.width, this.height);

            // Pulsing surface wave
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(drawX, drawY, this.width, 3);
        } else {
            // Original Stylized Sci-Fi Fire Effect
            const time = this.animTime * 6;

            // --- STEP 1: Ambient Pulsing Heat Aura Base ---
            const glowGrad = ctx.createRadialGradient(
                drawX + this.width / 2, drawY + this.height, 0,
                drawX + this.width / 2, drawY + this.height, Math.max(this.width, this.height * 2.0)
            );
            const glowPulse = 0.3 + Math.sin(time * 4.5) * 0.09;
            glowGrad.addColorStop(0, `rgba(255, 80, 0, ${glowPulse})`);
            glowGrad.addColorStop(0.45, `rgba(220, 20, 60, ${glowPulse * 0.5})`);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(drawX - 30, drawY - 35, this.width + 60, this.height + 50);

            // --- STEP 2: Dark Smoke Wisps ---
            ctx.globalCompositeOperation = 'source-over';
            for (let i = 0; i < this.smokeParticles.length; i++) {
                const s = this.smokeParticles[i];
                const sx = s.x - cameraOffset.x;
                const sy = s.y - cameraOffset.y;
                const progress = 1.0 - s.life;
                const alpha = Math.sin(progress * Math.PI) * 0.16;

                const smokeGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size);
                smokeGrad.addColorStop(0, `rgba(30, 20, 25, ${alpha})`);
                smokeGrad.addColorStop(0.65, `rgba(18, 12, 16, ${alpha * 0.4})`);
                smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = smokeGrad;
                ctx.beginPath();
                ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- STEP 3: Professional 3-Tier S-Curved Flame Shapes with Split Tips ---
            const flameWidth = 14;
            const flameCount = Math.floor(this.width / flameWidth);
            for (let i = 0; i < flameCount; i++) {
                const fx = drawX + i * flameWidth;
                const seed = i * 2.9;

                const hNoise = Math.sin(time * 3.8 + seed) * 8 + Math.cos(time * 6.5 + seed * 1.6) * 5;
                const fHeight = Math.max(20, this.height + hNoise + 6);
                const tipSway = Math.sin(time * 4.8 + seed) * 8;
                const waistSway1 = Math.sin(time * 4.2 + seed * 1.3) * 5;
                const waistSway2 = Math.cos(time * 3.9 + seed * 1.7) * 5;

                const bLeft = fx;
                const bRight = fx + flameWidth;
                const bY = drawY + this.height;

                // Main Flame Tip
                const tipX = fx + flameWidth * 0.45 + tipSway;
                const tipY = drawY + (this.height - fHeight);

                // Secondary Flame Notch Tip (gives professional split flame look)
                const subTipX = fx + flameWidth * 0.85 + tipSway * 0.6;
                const subTipY = drawY + (this.height - fHeight * 0.68);
                const notchX = fx + flameWidth * 0.65 + tipSway * 0.8;
                const notchY = drawY + (this.height - fHeight * 0.52);

                // S-Curve Control Points
                const cp1X = fx - flameWidth * 0.25 + waistSway1;
                const cp1Y = bY - fHeight * 0.35;
                const cp2X = fx + flameWidth * 0.2 + waistSway2;
                const cp2Y = bY - fHeight * 0.75;
                const cp3X = fx + flameWidth * 1.1 + waistSway1 * 0.7;
                const cp3Y = bY - fHeight * 0.4;

                // Helper to construct flame path
                const drawFlamePath = (scaleX, scaleY, offsetX, offsetY) => {
                    const sWidth = flameWidth * scaleX;
                    const sLeft = fx + (flameWidth - sWidth) / 2 + offsetX;
                    const sRight = sLeft + sWidth;
                    const sTipX = tipX * scaleX + fx * (1 - scaleX) + offsetX;
                    const sTipY = bY - fHeight * scaleY + offsetY;
                    const sSubTipX = subTipX * scaleX + fx * (1 - scaleX) + offsetX;
                    const sSubTipY = bY - fHeight * 0.68 * scaleY + offsetY;
                    const sNotchX = notchX * scaleX + fx * (1 - scaleX) + offsetX;
                    const sNotchY = bY - fHeight * 0.52 * scaleY + offsetY;

                    ctx.beginPath();
                    ctx.moveTo(sLeft, bY);
                    ctx.bezierCurveTo(
                        cp1X * scaleX + fx * (1 - scaleX) + offsetX, bY - (bY - cp1Y) * scaleY + offsetY,
                        cp2X * scaleX + fx * (1 - scaleX) + offsetX, bY - (bY - cp2Y) * scaleY + offsetY,
                        sTipX, sTipY
                    );
                    ctx.quadraticCurveTo(sTipX + 2, sTipY + fHeight * 0.12 * scaleY, sNotchX, sNotchY);
                    ctx.quadraticCurveTo(sNotchX + 1, sSubTipY + fHeight * 0.1 * scaleY, sSubTipX, sSubTipY);
                    ctx.bezierCurveTo(
                        sSubTipX + 3, sSubTipY + fHeight * 0.18 * scaleY,
                        cp3X * scaleX + fx * (1 - scaleX) + offsetX, bY - (bY - cp3Y) * scaleY + offsetY,
                        sRight, bY
                    );
                    ctx.closePath();
                };

                // --- Layer 1: Outer Fiery Red/Crimson Flame ---
                const outerGrad = ctx.createLinearGradient(fx, bY, tipX, tipY);
                outerGrad.addColorStop(0, '#c01000');
                outerGrad.addColorStop(0.35, '#ff4400');
                outerGrad.addColorStop(0.75, '#ff9900');
                outerGrad.addColorStop(1, '#ffdd22');
                ctx.fillStyle = outerGrad;
                drawFlamePath(1.0, 1.0, 0, 0);
                ctx.fill();

                // --- Layer 2: Mid Golden Orange Flame Core ---
                const midGrad = ctx.createLinearGradient(fx, bY, tipX, tipY);
                midGrad.addColorStop(0, '#ff7700');
                midGrad.addColorStop(0.5, '#ffcc00');
                midGrad.addColorStop(1, '#ffffaa');
                ctx.fillStyle = midGrad;
                drawFlamePath(0.72, 0.78, 0, 0);
                ctx.fill();

                // --- Layer 3: White-Hot Inner Flame Heart ---
                const innerGrad = ctx.createLinearGradient(fx, bY, tipX, tipY);
                innerGrad.addColorStop(0, '#ffbb00');
                innerGrad.addColorStop(0.4, '#ffffff');
                innerGrad.addColorStop(1, '#ffffff');
                ctx.fillStyle = innerGrad;
                drawFlamePath(0.42, 0.52, 0, 0);
                ctx.fill();
            }

            // --- STEP 4: Additive Volumetric Fire Plumes ---
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < this.flameParticles.length; i++) {
                const p = this.flameParticles[i];
                const px = p.x - cameraOffset.x;
                const py = p.y - cameraOffset.y;
                const normLife = Math.max(0, p.life);

                let cCore, cMid, cEdge;
                if (normLife > 0.7) {
                    const t = (normLife - 0.7) / 0.3;
                    cCore = `rgba(255, 255, 240, ${0.95 * t + 0.05})`;
                    cMid = `rgba(255, 200, 30, ${0.85 * t})`;
                    cEdge = `rgba(255, 80, 0, ${0.5 * t})`;
                } else if (normLife > 0.35) {
                    const t = (normLife - 0.35) / 0.35;
                    cCore = `rgba(255, 210, 40, ${0.85 * t})`;
                    cMid = `rgba(255, 110, 0, ${0.75 * t})`;
                    cEdge = `rgba(220, 30, 40, ${0.4 * t})`;
                } else {
                    const t = normLife / 0.35;
                    cCore = `rgba(255, 90, 0, ${0.7 * t})`;
                    cMid = `rgba(200, 20, 50, ${0.5 * t})`;
                    cEdge = `rgba(120, 10, 30, 0)`;
                }

                const radGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size);
                radGrad.addColorStop(0, cCore);
                radGrad.addColorStop(0.4, cMid);
                radGrad.addColorStop(0.85, cEdge);
                radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = radGrad;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- STEP 5: Stylized Diamond / Star Plasma Embers ---
            for (let i = 0; i < this.embers.length; i++) {
                const e = this.embers[i];
                const ex = e.x - cameraOffset.x;
                const ey = e.y - cameraOffset.y;
                const alpha = Math.max(0, e.life);

                ctx.save();
                ctx.translate(ex, ey);
                ctx.rotate(e.angle);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = e.color;
                ctx.shadowColor = e.color;
                ctx.shadowBlur = 8;

                const sz = e.size;
                ctx.beginPath();
                ctx.moveTo(0, -sz * 2.2);
                ctx.lineTo(sz * 0.6, -sz * 0.6);
                ctx.lineTo(sz * 2.2, 0);
                ctx.lineTo(sz * 0.6, sz * 0.6);
                ctx.lineTo(0, sz * 2.2);
                ctx.lineTo(-sz * 0.6, sz * 0.6);
                ctx.lineTo(-sz * 2.2, 0);
                ctx.lineTo(-sz * 0.6, -sz * 0.6);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.globalAlpha = 1.0;
        }

        ctx.restore();
    }
}

window.LaserTrap = LaserTrap;
window.HazardZone = HazardZone;
