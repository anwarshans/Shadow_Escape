/* ==========================================================================
   Shadow Escape - Particle System (Visual FX Engine)
   ========================================================================== */

class Particle {
    constructor(x, y, vx, vy, color, size, lifeMax, shape = 'circle') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifeMax = lifeMax;
        this.life = lifeMax;
        this.shape = shape;
        this.alpha = 1;
        this.gravity = 0;
    }

    update(dt) {
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
        this.vy += this.gravity * dt * 60;
        this.life -= dt;
        this.alpha = Math.max(0, this.life / this.lifeMax);
    }

    draw(ctx, cameraOffset) {
        if (this.alpha <= 0) return;
        const drawX = this.x - cameraOffset.x;
        const drawY = this.y - cameraOffset.y;

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.shape === 'text') {
            ctx.font = '900 16px var(--font-heading), sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.text || '', drawX, drawY);
        } else if (this.shape === 'rect') {
            ctx.fillRect(drawX - this.size / 2, drawY - this.size / 2, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(drawX, drawY, Math.max(1, this.size * this.alpha), 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.dashGhosts = [];
    }

    // Spawn Jump Dust
    createJumpDust(x, y) {
        const count = window.gamePerformanceMode ? 4 : 8;
        for (let i = 0; i < count; i++) {
            const vx = (Math.random() - 0.5) * 3;
            const vy = -Math.random() * 2 - 1;
            this.particles.push(new Particle(x, y, vx, vy, '#00f3ff', 3 + Math.random() * 3, 0.4));
        }
    }

    // Spawn Jetpack Flight Thruster Flames/Sparks
    createFlightThruster(x, y, isFacingRight) {
        const colors = ['#fbbf24', '#f59e0b', '#00f3ff', '#ef4444'];
        const count = window.gamePerformanceMode ? 2 : 4;
        for (let i = 0; i < count; i++) {
            const vx = (isFacingRight ? -1 : 1) * (1 + Math.random() * 2) + (Math.random() - 0.5) * 1.5;
            const vy = 1.5 + Math.random() * 2.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 3 + Math.random() * 4;
            const p = new Particle(x, y, vx, vy, color, size, 0.25);
            this.particles.push(p);
        }
    }

    // Spawn Dash Trail
    createDashGhost(x, y, width, height, isFacingRight) {
        this.dashGhosts.push({
            x, y, width, height, isFacingRight,
            life: 0.25, lifeMax: 0.25
        });
    }

    // Spawn Crystal Collect Sparkles
    createCrystalBurst(x, y) {
        const colors = ['#00f3ff', '#b026ff', '#ffffff'];
        const count = window.gamePerformanceMode ? 8 : 15;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4, 0.5));
        }
    }

    // Spawn Explosion Bits
    createExplosion(x, y) {
        const colors = ['#ff007f', '#ff3366', '#ffcf25'];
        const count = window.gamePerformanceMode ? 12 : 25;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4 + Math.random() * 4, 0.6, 'rect');
            p.gravity = 0.2;
            this.particles.push(p);
        }
    }

    // Spawn Floating Damage Text
    createDamageText(x, y, text, color = '#ff3366') {
        const p = new Particle(x, y, (Math.random() - 0.5) * 1.5, -2, color, 16, 0.7, 'text');
        p.text = text;
        p.gravity = 0.05;
        this.particles.push(p);
    }

    // Spawn Hit Sparks
    createHitSparks(x, y) {
        const colors = ['#ff007f', '#ffcf25', '#ffffff', '#00f3ff'];
        const count = window.gamePerformanceMode ? 6 : 12;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3, 0.35);
            p.gravity = 0.1;
            this.particles.push(p);
        }
    }

    // Spawn Laser Spark Emitters
    createLaserSparks(x, y) {
        if (Math.random() > (window.gamePerformanceMode ? 0.7 : 0.4)) return;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        this.particles.push(new Particle(x, y, vx, vy, '#ff007f', 2, 0.3));
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update dash ghost trails
        for (let i = this.dashGhosts.length - 1; i >= 0; i--) {
            this.dashGhosts[i].life -= dt;
            if (this.dashGhosts[i].life <= 0) {
                this.dashGhosts.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraOffset) {
        // Draw Dash Ghosts
        if (this.dashGhosts.length > 0) {
            ctx.save();
            ctx.fillStyle = '#00f3ff';
            this.dashGhosts.forEach(g => {
                ctx.globalAlpha = (g.life / g.lifeMax) * 0.5;
                const drawX = g.x - cameraOffset.x;
                const drawY = g.y - cameraOffset.y;
                ctx.fillRect(drawX, drawY, g.width, g.height);
            });
            ctx.restore();
        }

        // Draw Normal Particles
        if (this.particles.length > 0) {
            ctx.save();
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].draw(ctx, cameraOffset);
            }
            ctx.restore();
        }
    }

    reset() {
        this.particles = [];
        this.dashGhosts = [];
    }
}

const particleSystem = new ParticleSystem();
window.particleSystem = particleSystem;
