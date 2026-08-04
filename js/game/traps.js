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

        const time = performance.now() * 0.003;
        const colorAccent = this.isActive ? '#ff007f' : '#334155';

        // 1. High-Tech Metallic Emitter Nodes
        [ { x: drawX1, y: drawY1 }, { x: drawX2, y: drawY2 } ].forEach(node => {
            // Dark Metallic Housing
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = colorAccent;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Status LED Ring
            ctx.fillStyle = this.isActive ? (Math.sin(time * 10) > 0 ? '#ff007f' : '#00f3ff') : '#475569';
            if (this.isActive && !window.gamePerformanceMode) {
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 12;
            }
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Active High-Tech Laser Energy Beam
        if (this.isActive) {
            // Outer Energy Glow Wave
            const beamPulse = 7 + Math.sin(time * 8) * 2;
            ctx.strokeStyle = '#ff007f';
            if (!window.gamePerformanceMode) {
                ctx.shadowColor = '#ff007f';
                ctx.shadowBlur = 18;
            }
            ctx.lineWidth = beamPulse;
            ctx.beginPath();
            ctx.moveTo(drawX1, drawY1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();

            // Secondary Neon Cyan Layer
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = beamPulse * 0.5;
            ctx.beginPath();
            ctx.moveTo(drawX1, drawY1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();

            // Pure White Intense Core Beam
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(drawX1, drawY1);
            ctx.lineTo(drawX2, drawY2);
            ctx.stroke();

            // Laser Node Spark Flares
            [ { x: drawX1, y: drawY1 }, { x: drawX2, y: drawY2 } ].forEach(node => {
                ctx.fillStyle = '#ffffff';
                if (!window.gamePerformanceMode) {
                    ctx.shadowColor = '#00f3ff';
                    ctx.shadowBlur = 15;
                }
                const flareSize = 5 + Math.random() * 3;
                ctx.beginPath();
                ctx.arc(node.x, node.y, flareSize, 0, Math.PI * 2);
                ctx.fill();
            });
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
        
        // Particle pools
        this.flameParticles = [];
        this.smokeParticles = [];
        this.embers = [];
        this.plasmaBubbles = [];
    }

    update(dt) {
        this.animTime += dt;

        if (this.isReactorFluid) {
            // 1. Spawn Plasma Bubbles rising from depth
            if (this.plasmaBubbles.length < 14 && Math.random() < 0.6) {
                this.plasmaBubbles.push({
                    x: this.x + Math.random() * this.width,
                    y: this.y + this.height - Math.random() * 10,
                    vy: -Math.random() * 35 - 25,
                    vx: (Math.random() - 0.5) * 12,
                    radius: Math.random() * 4 + 2,
                    life: 1.0,
                    maxLife: 0.6 + Math.random() * 0.5,
                    color: Math.random() > 0.4 ? '#22d3ee' : '#f43f5e'
                });
            }

            // Update Plasma Bubbles
            for (let i = this.plasmaBubbles.length - 1; i >= 0; i--) {
                const b = this.plasmaBubbles[i];
                b.life -= dt / b.maxLife;
                if (b.life <= 0 || b.y <= this.y) {
                    // Surface pop spark
                    if (b.y <= this.y + 12 && Math.random() < 0.8) {
                        this.embers.push({
                            x: b.x,
                            y: this.y,
                            vx: (Math.random() - 0.5) * 40,
                            vy: -Math.random() * 50 - 20,
                            size: Math.random() * 2 + 1,
                            maxLife: 0.35 + Math.random() * 0.3,
                            life: 1.0,
                            color: b.color
                        });
                    }
                    this.plasmaBubbles.splice(i, 1);
                    continue;
                }
                b.y += b.vy * dt;
                b.x += (b.vx + Math.sin(this.animTime * 8 + i) * 15) * dt;
            }

            // Update Embers for reactor surface pops
            for (let i = this.embers.length - 1; i >= 0; i--) {
                const e = this.embers[i];
                e.life -= dt / e.maxLife;
                if (e.life <= 0) {
                    this.embers.splice(i, 1);
                    continue;
                }
                e.x += e.vx * dt;
                e.y += e.vy * dt;
            }
            return;
        }

        // 1. Spawn Volumetric Flame Plumes (capped for smooth 60FPS)
        if (this.flameParticles.length < 16) {
            const pX = this.x + Math.random() * this.width;
            const pY = this.y + this.height - Math.random() * 6;
            this.flameParticles.push({
                x: pX,
                y: pY,
                vx: (Math.random() - 0.5) * 16,
                vy: -Math.random() * 55 - 45,
                size: Math.random() * 7 + 7,
                maxLife: 0.35 + Math.random() * 0.3,
                life: 1.0,
                seed: Math.random() * 10
            });
        }

        // 2. Spawn Dark Smoke Wisps (capped for performance)
        if (this.smokeParticles.length < 8 && Math.random() < 0.45) {
            this.smokeParticles.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height * 0.2 - Math.random() * 10,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 30 - 20,
                size: Math.random() * 10 + 10,
                maxLife: 0.8 + Math.random() * 0.5,
                life: 1.0
            });
        }

        // 3. Spawn Floating Ember Sparks
        if (this.embers.length < 12 && Math.random() < 0.6) {
            this.embers.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height - Math.random() * 8,
                vx: (Math.random() - 0.5) * 28,
                vy: -Math.random() * 70 - 40,
                size: Math.random() * 2.2 + 0.8,
                maxLife: 0.5 + Math.random() * 0.5,
                life: 1.0,
                color: Math.random() > 0.3 ? '#fff466' : '#ff7700'
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
            p.x += (p.vx + Math.sin(this.animTime * 10 + p.seed) * 18) * dt;
            p.y += p.vy * dt;
            p.size += dt * 8;
        }

        // Update Smoke Particles
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const s = this.smokeParticles[i];
            s.life -= dt / s.maxLife;
            if (s.life <= 0) {
                this.smokeParticles.splice(i, 1);
                continue;
            }
            s.x += (s.vx + Math.sin(this.animTime * 4 + i) * 12) * dt;
            s.y += s.vy * dt;
            s.size += dt * 16;
        }

        // Update Ember Particles
        for (let i = this.embers.length - 1; i >= 0; i--) {
            const e = this.embers[i];
            e.life -= dt / e.maxLife;
            if (e.life <= 0) {
                this.embers.splice(i, 1);
                continue;
            }
            e.x += (e.vx + Math.sin(this.animTime * 12 + i) * 20) * dt;
            e.y += e.vy * dt;
        }
    }

    draw(ctx, cameraOffset) {
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.save();

        if (this.isReactorFluid) {
            // =========================================================================
            // AAA Professional Volumetric Plasma Reactor Abyss (No Box Outlines!)
            // =========================================================================
            const time = this.animTime * 4;

            // --- 1. Deep Liquid Abyss Body Gradient ---
            const abyssGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + this.height);
            abyssGrad.addColorStop(0, '#e11d48');       // Neon Magenta top
            abyssGrad.addColorStop(0.35, '#9333ea');    // Intense Violet mid
            abyssGrad.addColorStop(0.75, '#4c1d95');    // Deep Purple lower
            abyssGrad.addColorStop(1, '#090514');       // Dark void base

            // Calculate fine-step wave height points along surface
            const step = 6;
            const points = [];
            for (let px = 0; px <= this.width; px += step) {
                const w1 = Math.sin(time * 3.6 + px * 0.03) * 5;
                const w2 = Math.cos(time * 5.8 + px * 0.055) * 3;
                const w3 = Math.sin(time * 8.2 + px * 0.09) * 1.8;
                points.push({ x: drawX + px, y: drawY + w1 + w2 + w3 });
            }

            // Fill main liquid body polygon (NO STROKE here - zero box outlines!)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(drawX, drawY + this.height);
            ctx.lineTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.lineTo(drawX + this.width, drawY + this.height);
            ctx.closePath();

            ctx.fillStyle = abyssGrad;
            ctx.fill(); // ONLY FILL - ZERO STROKE!
            ctx.restore();

            // --- 2. Internal Energy Current Veins ---
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let j = 0; j < 3; j++) {
                const veinY = drawY + 15 + j * 16 + Math.sin(time * 2 + j) * 4;
                const veinGrad = ctx.createLinearGradient(drawX, veinY, drawX + this.width, veinY);
                veinGrad.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
                veinGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.25)');
                veinGrad.addColorStop(1, 'rgba(34, 211, 238, 0.05)');

                ctx.fillStyle = veinGrad;
                ctx.fillRect(drawX, veinY, this.width, 4);
            }
            ctx.restore();

            // --- 3. DEDICATED Top Surface Crest Stroke Line (ONLY TOP CREST STROKED!) ---
            ctx.save();
            // Outer Electric Cyan Surface Glow Line
            ctx.strokeStyle = '#22d3ee';
            if (!window.gamePerformanceMode) {
                ctx.shadowColor = '#22d3ee';
                ctx.shadowBlur = 16;
            }
            ctx.lineWidth = 3.5;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // Inner White-Hot Intense Crest Highlight Line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y - 0.5);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y - 0.5);
            }
            ctx.stroke();
            ctx.restore();

            // --- 4. Dynamic Rising Plasma Bubbles inside Liquid ---
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < this.plasmaBubbles.length; i++) {
                const b = this.plasmaBubbles[i];
                const bx = b.x - cameraOffset.x;
                const by = b.y - cameraOffset.y;

                const bGrad = ctx.createRadialGradient(bx - 1, by - 1, 0.5, bx, by, b.radius);
                bGrad.addColorStop(0, '#ffffff');
                bGrad.addColorStop(0.4, b.color);
                bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = bGrad;
                ctx.beginPath();
                ctx.arc(bx, by, b.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // --- 5. Volumetric Plasma Steam Vapor Plumes ---
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const numVapors = Math.min(6, Math.floor(this.width / 220) + 1);
            for (let i = 0; i < numVapors; i++) {
                const vx = drawX + ((i + 0.5) / numVapors) * this.width + Math.sin(time * 1.8 + i * 2) * 25;
                const vy = drawY - 12 - Math.sin(time * 2.5 + i * 1.7) * 10;
                const vSize = 22 + Math.sin(time * 3 + i) * 6;

                const vGrad = ctx.createRadialGradient(vx, vy, 0, vx, vy, vSize);
                vGrad.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
                vGrad.addColorStop(0.45, 'rgba(244, 63, 94, 0.18)');
                vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = vGrad;
                ctx.beginPath();
                ctx.arc(vx, vy, vSize, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // --- 6. Electric Discharge Lightning Arcs on Surface ---
            ctx.save();
            if (Math.random() < 0.55) {
                const arcStartX = drawX + Math.random() * (this.width - 60);
                const arcY = drawY + (Math.random() - 0.5) * 4;
                const arcLen = Math.random() * 45 + 25;

                ctx.strokeStyle = Math.random() > 0.3 ? '#ffffff' : '#22d3ee';
                ctx.lineWidth = 1.6;
                if (!window.gamePerformanceMode) {
                    ctx.shadowColor = '#22d3ee';
                    ctx.shadowBlur = 12;
                }

                ctx.beginPath();
                ctx.moveTo(arcStartX, arcY);
                let currX = arcStartX;
                let currY = arcY;

                for (let j = 0; j < 5; j++) {
                    currX += arcLen / 5;
                    currY += (Math.random() - 0.5) * 7;
                    ctx.lineTo(currX, currY);
                }
                ctx.stroke();
            }
            ctx.restore();

            // --- 7. Surface Pop Spark Embers ---
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < this.embers.length; i++) {
                const e = this.embers[i];
                const ex = e.x - cameraOffset.x;
                const ey = e.y - cameraOffset.y;
                const alpha = Math.max(0, e.life);

                ctx.globalAlpha = alpha;
                ctx.fillStyle = e.color;
                if (!window.gamePerformanceMode) {
                    ctx.shadowColor = e.color;
                    ctx.shadowBlur = 8;
                }
                ctx.beginPath();
                ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        } else {
            // =========================================================================
            // Professional Organic Fire Hazard Renderer (No Box Artifacts)
            // =========================================================================
            const time = this.animTime * 5;
            const centerX = drawX + this.width / 2;
            const baseY = drawY + this.height;

            // --- 1. Ambient Radial Heat Aura (Smooth Gradient - No harsh box container!) ---
            const auraRadiusX = this.width * 0.8;
            const auraRadiusY = this.height * 0.9;
            const auraPulse = 0.35 + Math.sin(time * 4) * 0.08;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const auraGrad = ctx.createRadialGradient(
                centerX, baseY - this.height * 0.3, 5,
                centerX, baseY - this.height * 0.3, Math.max(auraRadiusX, auraRadiusY)
            );
            auraGrad.addColorStop(0, `rgba(255, 90, 0, ${auraPulse * 0.8})`);
            auraGrad.addColorStop(0.4, `rgba(230, 40, 0, ${auraPulse * 0.4})`);
            auraGrad.addColorStop(0.85, `rgba(150, 15, 0, ${auraPulse * 0.12})`);
            auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = auraGrad;
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - this.height * 0.3, auraRadiusX + 15, auraRadiusY + 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // --- 2. Ground Light Reflection & Molten Coal Bed ---
            const coalGrad = ctx.createLinearGradient(drawX, baseY, drawX, baseY - 10);
            coalGrad.addColorStop(0, '#7a0500');
            coalGrad.addColorStop(0.5, '#e63900');
            coalGrad.addColorStop(1, '#ffaa00');

            ctx.fillStyle = coalGrad;
            ctx.beginPath();
            ctx.ellipse(centerX, baseY, this.width * 0.52, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // --- 3. Volumetric Dark Smoke Wisps ---
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            for (let i = 0; i < this.smokeParticles.length; i++) {
                const s = this.smokeParticles[i];
                const sx = s.x - cameraOffset.x;
                const sy = s.y - cameraOffset.y;
                const progress = 1.0 - s.life;
                const alpha = Math.sin(progress * Math.PI) * 0.22;

                const smokeGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size);
                smokeGrad.addColorStop(0, `rgba(35, 20, 25, ${alpha})`);
                smokeGrad.addColorStop(0.6, `rgba(20, 12, 15, ${alpha * 0.6})`);
                smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = smokeGrad;
                ctx.beginPath();
                ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // --- 4. Dynamic Multi-Harmonic Organic Flame Tongues ---
            const tongueWidth = 16;
            const numTongues = Math.max(3, Math.floor(this.width / tongueWidth) + 1);
            const stepX = this.width / Math.max(1, numTongues - 1);

            for (let i = 0; i < numTongues; i++) {
                const tx = drawX + i * stepX;
                const seed = i * 3.47;

                // Multi-frequency noise for organic swaying and flickering
                const wave1 = Math.sin(time * 4.2 + seed) * 9;
                const wave2 = Math.cos(time * 7.1 + seed * 1.8) * 6;
                const wave3 = Math.sin(time * 11.5 + seed * 2.3) * 4;

                const hFlicker = Math.sin(time * 5.8 + seed * 1.4) * 12 + Math.cos(time * 9.2 + seed) * 8;
                const flameHeight = Math.max(26, this.height * 0.85 + hFlicker + 10);

                const tipSway = wave1 + wave2;
                const waistSway1 = wave2 - wave3;
                const waistSway2 = wave1 + wave3 * 0.8;

                const baseLeft = tx - tongueWidth * 0.55;
                const baseRight = tx + tongueWidth * 0.55;

                const tipX = tx + tipSway;
                const tipY = baseY - flameHeight;

                const cp1X = tx - tongueWidth * 0.4 + waistSway1;
                const cp1Y = baseY - flameHeight * 0.38;
                const cp2X = tx + tongueWidth * 0.35 + waistSway2;
                const cp2Y = baseY - flameHeight * 0.72;

                const cp3X = tx + tongueWidth * 0.45 + waistSway1 * 0.8;
                const cp3Y = baseY - flameHeight * 0.42;

                // Helper to construct organic smooth bezier flame path
                const buildFlamePath = (widthScale, heightScale, shiftX) => {
                    const wLeft = tx - (tongueWidth * 0.55 * widthScale) + shiftX;
                    const wRight = tx + (tongueWidth * 0.55 * widthScale) + shiftX;
                    const tX = tx + tipSway * widthScale + shiftX;
                    const tY = baseY - flameHeight * heightScale;

                    ctx.beginPath();
                    ctx.moveTo(wLeft, baseY);
                    ctx.bezierCurveTo(
                        cp1X * widthScale + tx * (1 - widthScale) + shiftX, baseY - (baseY - cp1Y) * heightScale,
                        cp2X * widthScale + tx * (1 - widthScale) + shiftX, baseY - (baseY - cp2Y) * heightScale,
                        tX, tY
                    );
                    ctx.bezierCurveTo(
                        cp2X * widthScale + tx * (1 - widthScale) + shiftX + 4, tY + (baseY - tY) * 0.3,
                        cp3X * widthScale + tx * (1 - widthScale) + shiftX, baseY - (baseY - cp3Y) * heightScale,
                        wRight, baseY
                    );
                    ctx.closePath();
                };

                // Layer A: Outer Fiery Red/Orange Flame Body
                ctx.save();
                const outerGrad = ctx.createLinearGradient(tx, baseY, tipX, tipY);
                outerGrad.addColorStop(0, '#d61c00');
                outerGrad.addColorStop(0.3, '#ff4400');
                outerGrad.addColorStop(0.7, '#ff9900');
                outerGrad.addColorStop(1, 'rgba(255, 200, 0, 0.9)');

                ctx.fillStyle = outerGrad;
                if (!window.gamePerformanceMode) {
                    ctx.shadowColor = '#ff3300';
                    ctx.shadowBlur = 12;
                }
                buildFlamePath(1.0, 1.0, 0);
                ctx.fill();
                ctx.restore();

                // Layer B: Mid Bright Amber Core
                ctx.save();
                const midGrad = ctx.createLinearGradient(tx, baseY, tipX, tipY);
                midGrad.addColorStop(0, '#ff6600');
                midGrad.addColorStop(0.5, '#ffcc00');
                midGrad.addColorStop(1, '#ffff66');

                ctx.fillStyle = midGrad;
                buildFlamePath(0.68, 0.76, 0);
                ctx.fill();
                ctx.restore();

                // Layer C: Incandescent White-Hot Base Heart
                ctx.save();
                const innerGrad = ctx.createLinearGradient(tx, baseY, tipX, tipY);
                innerGrad.addColorStop(0, '#ffaa00');
                innerGrad.addColorStop(0.45, '#ffffff');
                innerGrad.addColorStop(1, 'rgba(255, 255, 240, 0.95)');

                ctx.fillStyle = innerGrad;
                buildFlamePath(0.38, 0.48, 0);
                ctx.fill();
                ctx.restore();
            }

            // --- 5. Volumetric Additive Plumes (Blend Mode 'lighter') ---
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < this.flameParticles.length; i++) {
                const p = this.flameParticles[i];
                const px = p.x - cameraOffset.x;
                const py = p.y - cameraOffset.y;
                const normLife = Math.max(0, p.life);

                let cCore, cMid, cEdge;
                if (normLife > 0.65) {
                    const t = (normLife - 0.65) / 0.35;
                    cCore = `rgba(255, 255, 240, ${0.95 * t})`;
                    cMid = `rgba(255, 200, 30, ${0.85 * t})`;
                    cEdge = `rgba(255, 70, 0, ${0.45 * t})`;
                } else if (normLife > 0.3) {
                    const t = (normLife - 0.3) / 0.35;
                    cCore = `rgba(255, 210, 40, ${0.8 * t})`;
                    cMid = `rgba(255, 100, 0, ${0.7 * t})`;
                    cEdge = `rgba(200, 20, 40, ${0.35 * t})`;
                } else {
                    const t = normLife / 0.3;
                    cCore = `rgba(255, 80, 0, ${0.65 * t})`;
                    cMid = `rgba(180, 15, 30, ${0.4 * t})`;
                    cEdge = 'rgba(0, 0, 0, 0)';
                }

                const radGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size);
                radGrad.addColorStop(0, cCore);
                radGrad.addColorStop(0.38, cMid);
                radGrad.addColorStop(0.82, cEdge);
                radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = radGrad;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- 6. Physics Embers & Rising Spark Streaks ---
            for (let i = 0; i < this.embers.length; i++) {
                const e = this.embers[i];
                const ex = e.x - cameraOffset.x;
                const ey = e.y - cameraOffset.y;
                const alpha = Math.max(0, e.life);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = e.color;
                if (!window.gamePerformanceMode) {
                    ctx.shadowColor = e.color;
                    ctx.shadowBlur = 8;
                }

                // Draw glowing ember dot
                ctx.beginPath();
                ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
                ctx.fill();

                // Small rising spark streak
                ctx.strokeStyle = e.color;
                ctx.lineWidth = e.size * 0.8;
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(ex - e.vx * 0.04, ey - e.vy * 0.05);
                ctx.stroke();

                ctx.restore();
            }
            ctx.restore();
        }

        ctx.restore();
    }
}

window.LaserTrap = LaserTrap;
window.HazardZone = HazardZone;
