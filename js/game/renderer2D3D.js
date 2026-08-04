/* ==========================================================================
   Shadow Escape - Level-Themed 2.5D / Pseudo-3D Renderer Engine
   ========================================================================== */

class Renderer2D3D {
    constructor() {
        this.depth3D = 14; // 3D extrude depth in pixels
        this.bgImages = [];

        // Theme Palettes tailored for each Level's Background Image
        this.levelThemes = {
            1: { // Green Valley Outskirts (Peaceful Countryside Village)
                lightAccent: '#22c55e',
                topGradStart: '#1f4d36',
                topGradEnd: '#0d261a',
                frontGradStart: '#143324',
                frontGradEnd: '#0a1a12',
                sideFill: '#0e2419',
                sideStroke: 'rgba(34, 197, 94, 0.35)',
                gridStroke: 'rgba(34, 197, 94, 0.25)',
                bgGradStart: '#0f2d1e',
                bgGradEnd: '#040f0a',
                ambientRgb: '34, 197, 94'
            },
            2: { // Metro Skyline District (Futuristic Metropolitan City)
                lightAccent: '#00f3ff',
                topGradStart: '#1e1b4b',
                topGradEnd: '#0f172a',
                frontGradStart: '#111827',
                frontGradEnd: '#030712',
                sideFill: '#1e1035',
                sideStroke: 'rgba(0, 243, 255, 0.35)',
                gridStroke: 'rgba(0, 243, 255, 0.25)',
                bgGradStart: '#0f172a',
                bgGradEnd: '#030712',
                ambientRgb: '0, 243, 255'
            },
            3: { // Industrial Power Zone (Factories and Industrial Area)
                lightAccent: '#f59e0b',
                topGradStart: '#3b1f09',
                topGradEnd: '#1f0f04',
                frontGradStart: '#241407',
                frontGradEnd: '#0d0702',
                sideFill: '#1d0c03',
                sideStroke: 'rgba(245, 158, 11, 0.35)',
                gridStroke: 'rgba(245, 158, 11, 0.25)',
                bgGradStart: '#1c1006',
                bgGradEnd: '#080401',
                ambientRgb: '245, 158, 11'
            },
            4: { // Research Facility Core (High-Tech Laboratory)
                lightAccent: '#00f2fe',
                topGradStart: '#051923',
                topGradEnd: '#020b12',
                frontGradStart: '#0a2540',
                frontGradEnd: '#030e1a',
                sideFill: '#041d33',
                sideStroke: 'rgba(0, 242, 254, 0.45)',
                gridStroke: 'rgba(0, 242, 254, 0.3)',
                bgGradStart: '#09253b',
                bgGradEnd: '#020912',
                ambientRgb: '0, 242, 254'
            },
            5: { // Shadow Nexus (Reactor Core / Final Escape)
                lightAccent: '#ff0055',
                topGradStart: '#4c0519',
                topGradEnd: '#1f020a',
                frontGradStart: '#2a0410',
                frontGradEnd: '#0f0105',
                sideFill: '#22030d',
                sideStroke: 'rgba(255, 0, 85, 0.35)',
                gridStroke: 'rgba(255, 0, 85, 0.25)',
                bgGradStart: '#24040d',
                bgGradEnd: '#080103',
                ambientRgb: '255, 0, 85'
            }
        };
        this.vignetteCanvas = null;
        this.bgGradients = {};
    }

    getTheme(levelId = 1) {
        return this.levelThemes[levelId] || this.levelThemes[1];
    }

    getBgImage(level = 1) {
        const levelNum = Math.max(1, Math.min(5, level));
        const srcWebp = `uploads/bg${levelNum}.webp`;

        if (window.assetManager) {
            const cachedImg = window.assetManager.getImage(srcWebp);
            if (cachedImg && (cachedImg.loaded || cachedImg.complete) && cachedImg.width > 0) {
                return cachedImg;
            }
        }

        if (!this.bgImages[levelNum - 1]) {
            const img = new Image();
            img.src = srcWebp;
            img.loaded = false;
            img.onload = () => { img.loaded = true; };
            this.bgImages[levelNum - 1] = img;
        }
        return this.bgImages[levelNum - 1];
    }

    // Render 2.5D Platform Block with Level-Themed Colors & Built-In Corner Lights
    drawPlatform3D(ctx, platform, cameraOffset, currentLevel = 1) {
        const x = platform.x - cameraOffset.x;
        const y = platform.y - cameraOffset.y;
        const w = platform.width;
        const h = platform.height;
        const depth = this.depth3D;

        const theme = this.getTheme(currentLevel);
        const accentLightColor = platform.isHazard ? '#ef4444' : theme.lightAccent;

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

        // 2. 3D Side Right Face (Dark Shaded Metallic with Theme Tint)
        ctx.fillStyle = theme.sideFill;
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w + depth, y + h - depth);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = platform.isHazard ? 'rgba(239, 68, 68, 0.35)' : theme.sideStroke;
        ctx.stroke();

        // 3. 3D Top Face (Reflective Level-Themed Surface)
        const topGrad = ctx.createLinearGradient(x, y - depth, x + w, y);
        topGrad.addColorStop(0, theme.topGradStart);
        topGrad.addColorStop(1, theme.topGradEnd);
        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth, y - depth);
        ctx.lineTo(x + w + depth, y - depth);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
        
        // Glowing Built-In Top Edge Lights
        ctx.strokeStyle = accentLightColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();

        // 4. Main Front Face
        const frontGrad = ctx.createLinearGradient(x, y, x, y + h);
        if (platform.isHazard) {
            frontGrad.addColorStop(0, '#2d0a0a');
            frontGrad.addColorStop(1, '#140303');
        } else {
            frontGrad.addColorStop(0, theme.frontGradStart);
            frontGrad.addColorStop(1, theme.frontGradEnd);
        }
        ctx.fillStyle = frontGrad;
        ctx.fillRect(x, y, w, h);

        // Cyber Grid Lines on Front Face
        ctx.strokeStyle = platform.isHazard ? 'rgba(239, 68, 68, 0.3)' : theme.gridStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

        // Built-in Corner Light Accents (Matching Level Palette)
        ctx.fillStyle = accentLightColor;
        ctx.fillRect(x, y, 5, 5);
        ctx.fillRect(x + w - 5, y, 5, 5);

        ctx.restore();
    }

    // Helper: Cached Vignette Overlay to eliminate radial gradient creation per frame
    getVignetteCanvas(width, height) {
        if (this.vignetteCanvas && this.vignetteCanvas.width === width && this.vignetteCanvas.height === height) {
            return this.vignetteCanvas;
        }
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');

        const vignette = offCtx.createRadialGradient(
            width / 2, height / 2, width * 0.3,
            width / 2, height / 2, width * 0.8
        );
        vignette.addColorStop(0, 'rgba(6, 7, 10, 0.15)');
        vignette.addColorStop(0.7, 'rgba(6, 7, 10, 0.6)');
        vignette.addColorStop(1, 'rgba(4, 5, 8, 0.92)');
        offCtx.fillStyle = vignette;
        offCtx.fillRect(0, 0, width, height);

        this.vignetteCanvas = offCanvas;
        return offCanvas;
    }

    // Render Real-World Parallax Image Background (bg1.webp - bg5.webp) with Level Theme Tint
    drawParallaxBackground(ctx, cameraOffset, canvasWidth, canvasHeight, currentLevel = 1) {
        const theme = this.getTheme(currentLevel);

        ctx.save();

        // 1. Level-Matched Deep Base Gradient (Cached per theme)
        if (!this.bgGradients[currentLevel]) {
            const bgGrad = ctx.createRadialGradient(
                canvasWidth / 2, canvasHeight / 2, 100,
                canvasWidth / 2, canvasHeight / 2, canvasWidth
            );
            bgGrad.addColorStop(0, theme.bgGradStart);
            bgGrad.addColorStop(1, theme.bgGradEnd);
            this.bgGradients[currentLevel] = bgGrad;
        }
        ctx.fillStyle = this.bgGradients[currentLevel];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Select Real-World Image based on current level
        const bgImg = this.getBgImage(currentLevel);

        if (bgImg && (bgImg.loaded || bgImg.complete) && bgImg.width > 0 && bgImg.height > 0) {
            ctx.save();
            ctx.globalAlpha = 0.75; // Crisp opacity blend with level atmosphere
            
            // Parallax movement calculation
            const imgWidth = bgImg.width;
            const imgHeight = bgImg.height;

            const scaleY = (canvasHeight * 1.25) / imgHeight;
            const scaleX = canvasWidth / imgWidth;
            const scale = Math.max(scaleX, scaleY, 1.25);

            const scaledW = imgWidth * scale;
            const scaledH = imgHeight * scale;

            const scrollRangeY = Math.max(1, scaledH - canvasHeight);
            const scrollRangeX = Math.max(1, scaledW);

            let startX = -((cameraOffset.x * 0.25) % scrollRangeX);
            let startY = -((cameraOffset.y * 0.15) % scrollRangeY);

            if (!isFinite(startX) || isNaN(startX)) startX = 0;
            if (!isFinite(startY) || isNaN(startY)) startY = 0;

            for (let x = startX - scaledW; x < canvasWidth + scaledW; x += scaledW) {
                ctx.drawImage(bgImg, x, startY, scaledW, scaledH);
            }
            ctx.restore();
        }

        // 3. Atmosphere Vignette (Using Cached Offscreen Canvas)
        const vignetteImg = this.getVignetteCanvas(canvasWidth, canvasHeight);
        ctx.drawImage(vignetteImg, 0, 0);

        // 4. Subtle Grid Overlay with Level Theme Tint
        const offsetX = (cameraOffset.x * 0.35) % 80;
        const offsetY = (cameraOffset.y * 0.35) % 80;

        ctx.strokeStyle = `rgba(${theme.ambientRgb}, 0.06)`;
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

    // Render Ambient Fog & Built-In Light Beams tailored to Level Theme
    drawAmbientLighting(ctx, canvasWidth, canvasHeight, time, currentLevel = 1) {
        const theme = this.getTheme(currentLevel);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Pulsing level-themed ambient light beam
        const alpha = 0.07 + Math.sin(time * 1.5) * 0.03;
        const beamGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        beamGrad.addColorStop(0, `rgba(${theme.ambientRgb}, ${alpha})`);
        beamGrad.addColorStop(0.6, `rgba(${theme.ambientRgb}, ${alpha * 0.5})`);
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
}

const renderer2D3D = new Renderer2D3D();
window.renderer2D3D = renderer2D3D;
