/* ==========================================================================
   Shadow Escape - 2.5D / Pseudo-3D Renderer Engine
   ========================================================================== */

class Renderer2D3D {
    constructor() {
        this.depth3D = 14; // 3D extrude depth in pixels

        // Real-World Background Images Preloading
        this.bgImage1 = new Image();
        this.bgImage1.src = 'uploads/bg1.png';
        this.bgImage1Loaded = false;
        this.bgImage1.onload = () => { this.bgImage1Loaded = true; };

        this.bgImage2 = new Image();
        this.bgImage2.src = 'uploads/bg2.png';
        this.bgImage2Loaded = false;
        this.bgImage2.onload = () => { this.bgImage2Loaded = true; };
    }

    // Render 2.5D Platform Block with Top/Front/Side 3D faces
    drawPlatform3D(ctx, platform, cameraOffset) {
        const x = platform.x - cameraOffset.x;
        const y = platform.y - cameraOffset.y;
        const w = platform.width;
        const h = platform.height;
        const depth = this.depth3D;

        ctx.save();

        // 1. Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.moveTo(x + depth, y + h + depth + 6);
        ctx.lineTo(x + w + depth, y + h + depth + 6);
        ctx.lineTo(x + w, y + h + 6);
        ctx.lineTo(x, y + h + 6);
        ctx.closePath();
        ctx.fill();

        // 2. 3D Side Right Face (Dark Shaded Metallic)
        ctx.fillStyle = '#181308';
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w + depth, y + h - depth);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.stroke();

        // 3. 3D Top Face (Reflective Light Shaded Gold)
        const topGrad = ctx.createLinearGradient(x, y - depth, x + w, y);
        topGrad.addColorStop(0, '#3b2d0c');
        topGrad.addColorStop(1, '#1c1505');
        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth, y - depth);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
        
        // Glowing Top Edge (Gold for Normal, Red for Hazard)
        ctx.strokeStyle = platform.isHazard ? '#ef4444' : '#fbbf24';
        ctx.shadowColor = platform.isHazard ? '#ef4444' : '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 4. Main Front Face
        const frontGrad = ctx.createLinearGradient(x, y, x, y + h);
        if (platform.isHazard) {
            frontGrad.addColorStop(0, '#2d0a0a');
            frontGrad.addColorStop(1, '#140303');
        } else {
            frontGrad.addColorStop(0, '#211908');
            frontGrad.addColorStop(1, '#0d0a03');
        }
        ctx.fillStyle = frontGrad;
        ctx.fillRect(x, y, w, h);

        // Cyber Grid Lines on Front Face
        ctx.strokeStyle = platform.isHazard ? 'rgba(239, 68, 68, 0.3)' : 'rgba(251, 191, 36, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

        // Corner Cyber Accents
        ctx.fillStyle = platform.isHazard ? '#ef4444' : '#fbbf24';
        ctx.fillRect(x, y, 4, 4);
        ctx.fillRect(x + w - 4, y, 4, 4);

        ctx.restore();
    }

    // Render Real-World Parallax Image Background (bg1.png / bg2.png)
    drawParallaxBackground(ctx, cameraOffset, canvasWidth, canvasHeight, currentLevel = 1) {
        ctx.save();

        // 1. Deep Base Gradient
        const bgGrad = ctx.createRadialGradient(
            canvasWidth / 2, canvasHeight / 2, 100,
            canvasWidth / 2, canvasHeight / 2, canvasWidth
        );
        bgGrad.addColorStop(0, '#100d06');
        bgGrad.addColorStop(1, '#050608');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Select Real-World Image (bg1.png default, bg2.png for alternate levels)
        const bgImg = (currentLevel % 2 === 0 && this.bgImage2Loaded) ? this.bgImage2 : (this.bgImage1Loaded ? this.bgImage1 : null);

        if (bgImg) {
            ctx.save();
            ctx.globalAlpha = 0.6; // Blend smoothly with deep space background
            
            // Parallax movement speeds
            const parallaxX = (cameraOffset.x * 0.25) % bgImg.width;
            const parallaxY = (cameraOffset.y * 0.15) % bgImg.height;

            // Draw image tiled horizontally to cover full canvas height and width
            const imgWidth = bgImg.width;
            const imgHeight = bgImg.height;

            // Scale to fit canvas height comfortably while preserving ratio
            const scale = Math.max(canvasHeight / imgHeight, 1.2);
            const scaledW = imgWidth * scale;
            const scaledH = imgHeight * scale;

            const startX = -((cameraOffset.x * 0.25) % scaledW);
            const startY = -((cameraOffset.y * 0.15) % (scaledH - canvasHeight));

            for (let x = startX - scaledW; x < canvasWidth + scaledW; x += scaledW) {
                ctx.drawImage(bgImg, x, startY, scaledW, scaledH);
            }
            ctx.restore();
        }

        // 3. Dark Atmosphere Tint & Vignette
        const vignette = ctx.createRadialGradient(
            canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.3,
            canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.8
        );
        vignette.addColorStop(0, 'rgba(6, 7, 10, 0.25)');
        vignette.addColorStop(0.7, 'rgba(6, 7, 10, 0.7)');
        vignette.addColorStop(1, 'rgba(4, 5, 8, 0.94)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 4. Subtle Gold Grid Overlay (Parallax at 0.35x speed)
        const offsetX = (cameraOffset.x * 0.35) % 80;
        const offsetY = (cameraOffset.y * 0.35) % 80;

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let x = -offsetX; x < canvasWidth + 80; x += 80) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        for (let y = -offsetY; y < canvasHeight + 80; y += 80) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();

        ctx.restore();
    }

    // Render Ambient Fog & Light Beams (Gold Shimmer)
    drawAmbientLighting(ctx, canvasWidth, canvasHeight, time) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Pulsing ambient light beam
        const alpha = 0.06 + Math.sin(time * 1.5) * 0.025;
        const beamGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        beamGrad.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
        beamGrad.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.7})`);
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
}

const renderer2D3D = new Renderer2D3D();
window.renderer2D3D = renderer2D3D;
