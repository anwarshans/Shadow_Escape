/* ==========================================================================
   Shadow Escape - Professional Web Audio API Synthesizer (SFX & BGM Generator)
   ========================================================================== */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.sfxVol = 1.0;     // Boosted SFX volume
        this.musicVol = 0.72;   // Boosted Music volume

        this.isPlayingBGM = false;
        this.isPlayingHomeBGM = false;
        this.isPlayingStoryMusic = false;
        this.isPlayingCustomSong = false;
        this.pendingHomeBgm = false;
        this.playingMusicAudio = null;

        this.bgmTimeout = null;
        this.homeBgmTimeout = null;
        this.activeNodes = [];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        this.loadSettings();
    }

    loadSettings() {
        if (window.storage) {
            const settings = window.storage.getSettings();
            this.sfxVol = settings.sfxVolume !== undefined ? settings.sfxVolume : 1.0;
            this.musicVol = settings.musicVolume !== undefined ? settings.musicVolume : 0.85;
            this.isMuted = settings.isMuted !== undefined ? settings.isMuted : false;
        } else {
            this.sfxVol = 1.0;
            this.musicVol = 0.85;
            this.isMuted = false;
        }
    }

    saveSettings() {
        if (window.storage) {
            window.storage.updateSettings({
                sfxVolume: this.sfxVol,
                musicVolume: this.musicVol,
                isMuted: this.isMuted
            });
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveSettings();

        if (this.isMuted) {
            this.stopBGM();
            this.stopHomeBGM();
            this.stopStoryMusic();
            this.stopCustomGameMusic();
        } else {
            this.ensureContext();
            const homeView = document.getElementById('homeView');
            if (homeView && homeView.style.display !== 'none') {
                this.startHomeBGM();
            }
        }
        return this.isMuted;
    }

    cleanupAudioNodes() {
        if (this.activeNodes && this.activeNodes.length > 0) {
            this.activeNodes.forEach(node => {
                try {
                    if (node && typeof node.stop === 'function') {
                        node.stop(0);
                    }
                    if (node && typeof node.disconnect === 'function') {
                        node.disconnect();
                    }
                } catch (e) {}
            });
        }
        this.activeNodes = [];
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (!this.ctx) return Promise.resolve(false);

        if (this.ctx.state === 'suspended') {
            return this.ctx.resume().then(() => {
                const homeView = document.getElementById('homeView');
                const isHomeVisible = homeView && homeView.style.display !== 'none';
                if ((this.pendingHomeBgm || isHomeVisible) && (!this.isPlayingHomeBGM || (this.goldenBrownAudio && this.goldenBrownAudio.paused)) && !this.isMuted) {
                    this.pendingHomeBgm = false;
                    this.startHomeBGM();
                }
                return true;
            }).catch(() => false);
        }

        return Promise.resolve(true);
    }

    // Helper: Play synthesized tone with custom envelope & optional ringing harmonic
    playTone(freq, type, duration, startVol = 0.6, endVol = 0.001, ringHarmonic = true) {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();

        try {
            const now = this.ctx.currentTime;
            
            // Fundamental Tone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(startVol * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);

            // Ringing Metallic Harmonic Overtone
            if (ringHarmonic) {
                const ringOsc = this.ctx.createOscillator();
                const ringGain = this.ctx.createGain();

                ringOsc.type = 'sine';
                ringOsc.frequency.setValueAtTime(freq * 2.76, now); // Metallic non-integer ratio ring

                ringGain.gain.setValueAtTime(startVol * 0.35 * this.sfxVol, now);
                ringGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);

                ringOsc.connect(ringGain);
                ringGain.connect(this.ctx.destination);

                ringOsc.start(now);
                ringOsc.stop(now + duration * 0.8);
            }
        } catch (e) {}
    }

    // =========================================================================
    // BRIGHT, RINGING & ATTRACTIVE IN-GAME SOUND EFFECTS (SFX)
    // =========================================================================

    // Jump: Punchy low-end sub pop + bright ringing pitch sweep (180Hz -> 750Hz)
    playJump() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;

            // Bright Ringing Sweep Osc
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);

            gain.gain.setValueAtTime(0.6 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);

            // High Ringing Overtone
            const ringOsc = this.ctx.createOscillator();
            const ringGain = this.ctx.createGain();
            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(450, now);
            ringOsc.frequency.exponentialRampToValueAtTime(1875, now + 0.15);

            ringGain.gain.setValueAtTime(0.25 * this.sfxVol, now);
            ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            // Sub-thump for solid grounding
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subOsc.type = 'triangle';
            subOsc.frequency.setValueAtTime(110, now);
            subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

            subGain.gain.setValueAtTime(0.45 * this.sfxVol, now);
            subGain.gain.exponentialRampToValueAtTime(0.005, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            ringOsc.connect(ringGain);
            ringGain.connect(this.ctx.destination);

            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);

            osc.start(now);
            ringOsc.start(now);
            subOsc.start(now);

            osc.stop(now + 0.15);
            ringOsc.stop(now + 0.15);
            subOsc.stop(now + 0.09);
        } catch(e){}
    }

    // Double Jump: Energetic ringing sci-fi dual surge (420Hz -> 1350Hz)
    playDoubleJump() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const ringOsc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(380, now);
            osc1.frequency.exponentialRampToValueAtTime(950, now + 0.18);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(570, now);
            osc2.frequency.exponentialRampToValueAtTime(1425, now + 0.18);

            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(1140, now);
            ringOsc.frequency.exponentialRampToValueAtTime(2850, now + 0.18);

            gain.gain.setValueAtTime(0.55 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

            osc1.connect(gain);
            osc2.connect(gain);
            ringOsc.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            ringOsc.start(now);

            osc1.stop(now + 0.18);
            osc2.stop(now + 0.18);
            ringOsc.stop(now + 0.18);
        } catch(e){}
    }

    // Dash: High-pass noise burst + ringing energy slice sweep
    playDash() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.16);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 4.5;
            filter.frequency.setValueAtTime(2200, now);
            filter.frequency.exponentialRampToValueAtTime(320, now + 0.16);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.7 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.16);

            // Ringing laser dash sheen
            const sheenOsc = this.ctx.createOscillator();
            const sheenGain = this.ctx.createGain();
            sheenOsc.type = 'sine';
            sheenOsc.frequency.setValueAtTime(1800, now);
            sheenOsc.frequency.exponentialRampToValueAtTime(450, now + 0.16);
            sheenGain.gain.setValueAtTime(0.3 * this.sfxVol, now);
            sheenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            sheenOsc.connect(sheenGain);
            sheenGain.connect(this.ctx.destination);

            noise.start(now);
            sheenOsc.start(now);
            sheenOsc.stop(now + 0.16);
        } catch(e){}
    }

    // Flight / Jetpack: Rich jet thruster hum with high ringing turbine sheen
    playFlight() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const ringOsc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(190, now);
            osc.frequency.linearRampToValueAtTime(320, now + 0.12);

            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(800, now);
            ringOsc.frequency.linearRampToValueAtTime(1400, now + 0.12);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(650, now);

            gain.gain.setValueAtTime(0.38 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.008, now + 0.12);

            osc.connect(filter);
            ringOsc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            ringOsc.start(now);
            osc.stop(now + 0.12);
            ringOsc.stop(now + 0.12);
        } catch(e){}
    }

    // Crystal Collect: Shimmering 5-note ringing glass bell sequence (C6-E6-G6-B6-C7)
    playCrystal() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const notes = [1046.50, 1318.51, 1567.98, 1975.53, 2093.00];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.28, 0.65, 0.001, true);
            }, idx * 40);
        });
    }

    // Keycard Collect: High-tech ringing metallic card chime (E5-G#5-B5-E6-G#6)
    playKey() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.35, 0.7, 0.001, true);
            }, idx * 55);
        });
    }

    // Door Unlock: Heavy pneumatic lock release + ringing mechanical chime unlock
    playDoorUnlock() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            
            // Lock release tone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);
            gain.gain.setValueAtTime(0.5 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

            // Ringing metallic unlock chime
            const ringOsc = this.ctx.createOscillator();
            const ringGain = this.ctx.createGain();
            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(1400, now);
            ringOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.25);
            ringGain.gain.setValueAtTime(0.35 * this.sfxVol, now);
            ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            // Sub thud
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(140, now);
            sub.frequency.exponentialRampToValueAtTime(35, now + 0.28);
            subGain.gain.setValueAtTime(0.65 * this.sfxVol, now);
            subGain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            ringOsc.connect(ringGain);
            ringGain.connect(this.ctx.destination);

            sub.connect(subGain);
            subGain.connect(this.ctx.destination);

            osc.start(now);
            ringOsc.start(now);
            sub.start(now);

            osc.stop(now + 0.25);
            ringOsc.stop(now + 0.25);
            sub.stop(now + 0.28);
        } catch(e){}
    }

    // Hurt / Damage: Sub-bass impact punch + ringing shield crack
    playHurt() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;

            // Sub bass impact drop
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.8 * this.sfxVol, now);
            gain.gain.linearRampToValueAtTime(0.005, now + 0.3);

            // Distortion / Noise punch
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.8;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(750, now);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.6 * this.sfxVol, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            osc.start(now);
            noise.start(now);
            osc.stop(now + 0.3);
        } catch(e){}
    }

    // Explosion: Layered sub-bass kick + metallic crunch + low-pass rumble
    playExplosion() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const duration = 0.5;

            // Noise rumble
            const bufferSize = Math.floor(this.ctx.sampleRate * duration);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);
            filter.frequency.exponentialRampToValueAtTime(45, now + duration);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.9 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

            // Sub kick
            const kick = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kick.type = 'sine';
            kick.frequency.setValueAtTime(170, now);
            kick.frequency.exponentialRampToValueAtTime(30, now + 0.35);
            kickGain.gain.setValueAtTime(0.95 * this.sfxVol, now);
            kickGain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            kick.connect(kickGain);
            kickGain.connect(this.ctx.destination);

            noise.start(now);
            kick.start(now);
            kick.stop(now + 0.35);
        } catch(e){}
    }

    // Level Clear: Glorious 6-note ringing victory fanfare
    playLevelClear() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const chords = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 659.25, time: 100 },  // E5
            { freq: 783.99, time: 200 },  // G5
            { freq: 987.77, time: 300 },  // B5
            { freq: 1046.50, time: 410 }, // C6
            { freq: 1318.51, time: 540 }  // E6
        ];
        chords.forEach(c => {
            setTimeout(() => {
                this.playTone(c.freq, 'sine', 0.5, 0.65, 0.001, true);
                this.playTone(c.freq * 1.5, 'triangle', 0.35, 0.35, 0.001, false);
            }, c.time);
        });
    }

    // Grand Victory: Triumphant multi-stage victory fanfare with brassy synth & chimes
    playGrandVictory() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const sequence = [
            { freq: 440.00, type: 'triangle', duration: 0.3, time: 0 },    // A4
            { freq: 554.37, type: 'triangle', duration: 0.3, time: 120 },  // C#5
            { freq: 659.25, type: 'triangle', duration: 0.3, time: 240 },  // E5
            { freq: 880.00, type: 'sine',     duration: 0.6, time: 360 },  // A5
            { freq: 1108.73, type: 'sine',    duration: 0.8, time: 520 },  // C#6
            { freq: 1318.51, type: 'sine',    duration: 1.2, time: 700 }   // E6 grand sustain
        ];
        sequence.forEach(s => {
            setTimeout(() => {
                this.playTone(s.freq, s.type, s.duration, 0.75, 0.001, true);
                this.playTone(s.freq * 0.5, 'sawtooth', s.duration * 0.6, 0.3, 0.001, false);
            }, s.time);
        });
    }

    // UI Click: Snappy ringing glass button tick
    playUIClick() {
        this.playTone(1400, 'sine', 0.06, 0.45, 0.001, true);
    }

    // UI Hover: Soft ringing chime hover tick
    playUIHover() {
        this.playTone(950, 'triangle', 0.04, 0.2, 0.001, true);
    }

    // Attack / Slash: Sharp blade slash with ringing metallic sheen
    playAttack() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(950, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

            filter.type = 'highpass';
            filter.frequency.setValueAtTime(450, now);

            gain.gain.setValueAtTime(0.6 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

            // Ringing metallic sheen
            const ringOsc = this.ctx.createOscillator();
            const ringGain = this.ctx.createGain();
            ringOsc.type = 'sine';
            ringOsc.frequency.setValueAtTime(2400, now);
            ringOsc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
            ringGain.gain.setValueAtTime(0.35 * this.sfxVol, now);
            ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            ringOsc.connect(ringGain);
            ringGain.connect(this.ctx.destination);

            osc.start(now);
            ringOsc.start(now);
            osc.stop(now + 0.12);
            ringOsc.stop(now + 0.12);
        } catch(e){}
    }

    // Enemy Hit: Punchy impact thump for enemy hits
    playEnemyHit() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(130, now + 0.13);

            gain.gain.setValueAtTime(0.48 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.13);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.13);
        } catch(e){}
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
                const homeView = document.getElementById('homeView');
                const isHomeVisible = homeView && homeView.style.display !== 'none';
                if ((this.pendingHomeBgm || isHomeVisible) && !this.isPlayingHomeBGM && !this.isMuted) {
                    this.pendingHomeBgm = false;
                    this.startHomeBGM();
                }
            }).catch(() => {});
        }
    }

    // =========================================================================
    // PROFESSIONAL HOME SCREEN BACKGROUND SONG (BGM): THE STRANGLERS - GOLDEN BROWN
    // =========================================================================
    startHomeBGM() {
        this.stopCustomGameMusic();
        if (this.isMuted || this.musicVol <= 0) return;

        if (this.ctx && this.ctx.state === 'suspended') {
            this.pendingHomeBgm = true;
            this.ensureContext();
        }

        this.stopStoryMusic();
        this.isPlayingHomeBGM = true;
        this.pendingHomeBgm = false;

        try {
            if (!this.goldenBrownAudio) {
                this.goldenBrownAudio = new Audio('uploads/golden_brown.mp4');
                this.goldenBrownAudio.loop = true;
            }
            this.goldenBrownAudio.volume = Math.min(1.0, (this.musicVol || 0.85) * 0.95);
            if (this.goldenBrownAudio.paused) {
                const playPromise = this.goldenBrownAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('Home BGM autoplay info:', e);
                        this.pendingHomeBgm = true;
                    });
                }
            }
        } catch (e) {
            console.warn('Home BGM audio error:', e);
        }
    }

    stopHomeBGM() {
        this.isPlayingHomeBGM = false;
        this.pendingHomeBgm = false;
        if (this.homeBgmTimeout) {
            clearTimeout(this.homeBgmTimeout);
            this.homeBgmTimeout = null;
        }
        if (this.goldenBrownAudio) {
            try {
                this.goldenBrownAudio.pause();
                this.goldenBrownAudio.currentTime = 0;
            } catch (e) {}
        }
        this.cleanupAudioNodes();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
        this.cleanupAudioNodes();
    }

    // =========================================================================
    // IN-GAME BACKGROUND MUSIC (BGM) - Play song from uploads/playing music.mp4
    // =========================================================================
    startBGM() {
        this.stopHomeBGM();
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    }

    toggleGameMusic() {
        if (this.isMuted) {
            this.isMuted = false;
            this.saveSettings();
        }
        this.ensureContext();

        if (!this.playingMusicAudio) {
            this.playingMusicAudio = new Audio('uploads/playing music.mp4');
            this.playingMusicAudio.loop = true;
        }

        this.playingMusicAudio.volume = Math.min(1.0, (this.musicVol || 0.85));

        if (this.playingMusicAudio.paused) {
            this.stopHomeBGM();
            this.stopStoryMusic();

            const playPromise = this.playingMusicAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlayingCustomSong = true;
                    this.updateMusicButtonUI(true);
                }).catch(e => {
                    console.warn('Custom game song playback info:', e);
                    this.isPlayingCustomSong = false;
                    this.updateMusicButtonUI(false);
                });
            } else {
                this.isPlayingCustomSong = true;
                this.updateMusicButtonUI(true);
            }
        } else {
            this.playingMusicAudio.pause();
            this.isPlayingCustomSong = false;
            this.updateMusicButtonUI(false);
        }

        return this.isPlayingCustomSong;
    }

    stopCustomGameMusic() {
        if (this.playingMusicAudio) {
            try {
                this.playingMusicAudio.pause();
            } catch (e) {}
        }
        this.isPlayingCustomSong = false;
        this.updateMusicButtonUI(false);
    }

    updateMusicButtonUI(isPlaying) {
        const btn = document.getElementById('btnGameMusicToggle');
        if (btn) {
            if (isPlaying) {
                btn.classList.add('playing');
                btn.setAttribute('title', 'Pause Music (playing music.mp4)');
                btn.setAttribute('aria-label', 'Pause Music');
            } else {
                btn.classList.remove('playing');
                btn.setAttribute('title', 'Play Music (playing music.mp4)');
                btn.setAttribute('aria-label', 'Play Music');
            }
        }
    }

    // =========================================================================
    // THE STRANGLERS - GOLDEN BROWN (Exact Song Audio Playback)
    // =========================================================================
    playGoldenBrownLoveStory() {
        this.startHomeBGM();
    }

    stopStoryMusic() {
        this.isPlayingStoryMusic = false;
        if (this.goldenBrownAudio) {
            try {
                this.goldenBrownAudio.pause();
                this.goldenBrownAudio.currentTime = 0;
            } catch (e) {}
        }
        this.cleanupAudioNodes();
    }

    // =========================================================================
    // DEDICATED STORY BRIEFING PAGE MUSIC TRACKS (Synthesized for Levels 1 - 5)
    // =========================================================================
    playStoryBriefingMusic(levelId = 1) {
        this.stopCustomGameMusic();
        if (this.isMuted || !this.ctx || this.musicVol <= 0) return;
        this.ensureContext();
        this.stopStoryMusic();

        this.isPlayingStoryMusic = true;
        const now = this.ctx.currentTime;
        const lvl = Math.min(Math.max(levelId || 1, 1), 5);

        try {
            // Level 1: Green Valley Outskirts (Warm Ethereal Countryside Motif)
            if (lvl === 1) {
                const chordNotes = [146.83, 185.00, 220.00, 277.18, 329.63]; // D Maj9
                chordNotes.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + i * 0.12);
                    gain.gain.setValueAtTime(0.001, now + i * 0.12);
                    gain.gain.linearRampToValueAtTime(0.18 * this.musicVol, now + i * 0.12 + 0.35);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 3.8);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.12);
                    osc.stop(now + i * 0.12 + 3.9);
                });

                const chimes = [587.33, 739.99, 880.00, 1108.73, 880.00, 739.99];
                chimes.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + 0.6 + i * 0.32);
                    gain.gain.setValueAtTime(0.001, now + 0.6 + i * 0.32);
                    gain.gain.linearRampToValueAtTime(0.12 * this.musicVol, now + 0.6 + i * 0.32 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.32 + 0.85);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + 0.6 + i * 0.32);
                    osc.stop(now + 0.6 + i * 0.32 + 0.9);
                });
            }

            // Level 2: Metro Skyline District (Futuristic Cyberpunk Neon Synth)
            else if (lvl === 2) {
                const bassLine = [82.41, 98.00, 110.00, 123.47]; // E2 -> G2 -> A2 -> B2
                bassLine.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, now + i * 0.65);
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(320, now + i * 0.65);
                    filter.frequency.exponentialRampToValueAtTime(1400, now + i * 0.65 + 0.3);
                    gain.gain.setValueAtTime(0.24 * this.musicVol, now + i * 0.65);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.65 + 0.6);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.65);
                    osc.stop(now + i * 0.65 + 0.62);
                });

                const neonArp = [659.25, 783.99, 987.77, 1174.66, 987.77, 783.99, 659.25, 523.25];
                neonArp.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + i * 0.2);
                    gain.gain.setValueAtTime(0.14 * this.musicVol, now + i * 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.32);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.2);
                    osc.stop(now + i * 0.2 + 0.35);
                });
            }

            // Level 3: Industrial Power Zone (Heavy Industrial Resonant Grid)
            else if (lvl === 3) {
                const subOsc = this.ctx.createOscillator();
                const subFilter = this.ctx.createBiquadFilter();
                const subGain = this.ctx.createGain();
                subOsc.type = 'sawtooth';
                subOsc.frequency.setValueAtTime(65.41, now);
                subFilter.type = 'lowpass';
                subFilter.frequency.setValueAtTime(160, now);
                subFilter.frequency.linearRampToValueAtTime(650, now + 1.6);
                subFilter.frequency.linearRampToValueAtTime(180, now + 3.5);
                subGain.gain.setValueAtTime(0.001, now);
                subGain.gain.linearRampToValueAtTime(0.28 * this.musicVol, now + 1.0);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.7);
                subOsc.connect(subFilter);
                subFilter.connect(subGain);
                subGain.connect(this.ctx.destination);
                subOsc.start(now);
                subOsc.stop(now + 3.8);

                const alarms = [261.63, 311.13, 392.00, 523.25];
                alarms.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(f, now + 0.4 + i * 0.55);
                    gain.gain.setValueAtTime(0.001, now + 0.4 + i * 0.55);
                    gain.gain.linearRampToValueAtTime(0.12 * this.musicVol, now + 0.4 + i * 0.55 + 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.55 + 0.48);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + 0.4 + i * 0.55);
                    osc.stop(now + 0.4 + i * 0.55 + 0.5);
                });
            }

            // Level 4: Research Facility Core (Subterranean Lab Ethereal Plasma)
            else if (lvl === 4) {
                const labNotes = [207.65, 261.63, 311.13, 392.00];
                labNotes.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + i * 0.18);
                    gain.gain.setValueAtTime(0.001, now + i * 0.18);
                    gain.gain.linearRampToValueAtTime(0.16 * this.musicVol, now + i * 0.18 + 0.4);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 3.5);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.18);
                    osc.stop(now + i * 0.18 + 3.6);
                });

                const plasmaPulses = [830.61, 1046.50, 1244.51, 1661.22];
                plasmaPulses.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const ringOsc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + 0.5 + i * 0.45);
                    ringOsc.type = 'sine';
                    ringOsc.frequency.setValueAtTime(f * 1.5, now + 0.5 + i * 0.45);
                    gain.gain.setValueAtTime(0.001, now + 0.5 + i * 0.45);
                    gain.gain.linearRampToValueAtTime(0.1 * this.musicVol, now + 0.5 + i * 0.45 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.45 + 0.55);
                    osc.connect(gain);
                    ringOsc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + 0.5 + i * 0.45);
                    ringOsc.start(now + 0.5 + i * 0.45);
                    osc.stop(now + 0.5 + i * 0.45 + 0.58);
                    ringOsc.stop(now + 0.5 + i * 0.45 + 0.58);
                });
            }

            // Level 5: Shadow Nexus (Cyberpunk Reactor Citadel - Dark Epic Tactical Motif)
            else if (lvl === 5) {
                const brassNotes = [92.50, 110.00, 138.59, 185.00];
                brassNotes.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, now + i * 0.38);
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(420, now + i * 0.38);
                    filter.frequency.linearRampToValueAtTime(1700, now + i * 0.38 + 0.14);
                    filter.frequency.exponentialRampToValueAtTime(360, now + i * 0.38 + 0.65);
                    gain.gain.setValueAtTime(0.001, now + i * 0.38);
                    gain.gain.linearRampToValueAtTime(0.28 * this.musicVol, now + i * 0.38 + 0.07);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.38 + 0.8);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.38);
                    osc.stop(now + i * 0.38 + 0.83);
                });

                const epicCascade = [370.00, 440.00, 554.37, 739.99, 880.00, 1108.73];
                epicCascade.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + 1.6 + i * 0.16);
                    gain.gain.setValueAtTime(0.001, now + 1.6 + i * 0.16);
                    gain.gain.linearRampToValueAtTime(0.16 * this.musicVol, now + 1.6 + i * 0.16 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6 + i * 0.16 + 0.48);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + 1.6 + i * 0.16);
                    osc.stop(now + 1.6 + i * 0.16 + 0.5);
                });
            }
        } catch(e){}
    }

    stopStoryMusic() {
        this.isPlayingStoryMusic = false;
        this.cleanupAudioNodes();
    }
}

const audio = new SoundEngine();
window.soundEngine = audio;

// Automatically initialize sound engine & attempt playback on site load
document.addEventListener('DOMContentLoaded', () => {
    if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.ensureContext();
        window.soundEngine.startHomeBGM();
    }
});
