/* ==========================================================================
   Shadow Escape - 2.5D / Pseudo-3D Renderer Engine
   ========================================================================== */

class Renderer2D3D {
    constructor() {
        this.depth3D = 14; // 3D extrude depth in pixels
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

        // 2. 3D Side Right Face (Dark Shaded)
        ctx.fillStyle = '#0a1024';
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w + depth, y + h - depth);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.stroke();

        // 3. 3D Top Face (Reflective Light Shaded)
        const topGrad = ctx.createLinearGradient(x, y - depth, x + w, y);
        topGrad.addColorStop(0, '#1a274c');
        topGrad.addColorStop(1, '#0e1834');
        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth, y - depth);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
        
        // Glowing Top Edge
        ctx.strokeStyle = platform.isHazard ? '#ff007f' : '#00f3ff';
        ctx.shadowColor = platform.isHazard ? '#ff007f' : '#00f3ff';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 4. Main Front Face
        const frontGrad = ctx.createLinearGradient(x, y, x, y + h);
        if (platform.isHazard) {
            frontGrad.addColorStop(0, '#2e071a');
            frontGrad.addColorStop(1, '#14030b');
        } else {
            frontGrad.addColorStop(0, '#0c152a');
            frontGrad.addColorStop(1, '#050914');
        }
        ctx.fillStyle = frontGrad;
        ctx.fillRect(x, y, w, h);

        // Cyber Grid Lines on Front Face
        ctx.strokeStyle = platform.isHazard ? 'rgba(255, 0, 127, 0.25)' : 'rgba(0, 243, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

        // Corner Cyber Accents
        ctx.fillStyle = platform.isHazard ? '#ff007f' : '#00f3ff';
        ctx.fillRect(x, y, 4, 4);
        ctx.fillRect(x + w - 4, y, 4, 4);

        ctx.restore();
    }

    // Render Parallax Depth Grid Background
    drawParallaxBackground(ctx, cameraOffset, canvasWidth, canvasHeight) {
        ctx.save();
        // Deep background gradient
        const bgGrad = ctx.createRadialGradient(
            canvasWidth / 2, canvasHeight / 2, 100,
            canvasWidth / 2, canvasHeight / 2, canvasWidth
        );
        bgGrad.addColorStop(0, '#0a0d20');
        bgGrad.addColorStop(1, '#03050c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Far Parallax Grid (Moves at 0.2x speed)
        const offsetX = (cameraOffset.x * 0.2) % 60;
        const offsetY = (cameraOffset.y * 0.2) % 60;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let x = -offsetX; x < canvasWidth; x += 60) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        for (let y = -offsetY; y < canvasHeight; y += 60) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();

        ctx.restore();
    }

    // Render Ambient Fog & Light Beams
    drawAmbientLighting(ctx, canvasWidth, canvasHeight, time) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Pulsing ambient light beam
        const alpha = 0.05 + Math.sin(time * 2) * 0.02;
        const beamGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        beamGrad.addColorStop(0, `rgba(0, 243, 255, ${alpha})`);
        beamGrad.addColorStop(0.5, `rgba(176, 38, 255, ${alpha * 0.7})`);
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
}

const renderer2D3D = new Renderer2D3D();
window.renderer2D3D = renderer2D3D;
