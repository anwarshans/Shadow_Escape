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

        this.bgmTimeout = null;
        this.homeBgmTimeout = null;
        this.activeNodes = [];
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.ctx = new AudioContext();
            this.loadSettings();
        }
    }

    loadSettings() {
        if (window.storage) {
            const settings = window.storage.getSettings();
            this.sfxVol = settings.sfxVolume !== undefined ? settings.sfxVolume : 1.0;
            this.musicVol = settings.musicVolume !== undefined ? settings.musicVolume : 0.72;
            this.isMuted = settings.isMuted !== undefined ? settings.isMuted : false;
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
        } else {
            this.ensureContext();
        }
        return this.isMuted;
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
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

    // =========================================================================
    // PROFESSIONAL HOME SCREEN BACKGROUND SONG (BGM)
    // =========================================================================
    startHomeBGM() {
        if (this.isPlayingHomeBGM || this.isMuted || !this.ctx || this.musicVol <= 0) return;
        this.ensureContext();
        this.stopBGM(); // Ensure in-game BGM is stopped
        this.isPlayingHomeBGM = true;

        // Cyberpunk Ambient Title Theme Synth Loop (F Minor Atmospheric Motif)
        const runHomeLoop = () => {
            if (!this.isPlayingHomeBGM || this.isMuted || !this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const barDuration = 4.0; // 4 seconds loop pattern

                // 1. Ambient Synth Bass Drone (F1 -> Ab1 -> Eb1 -> C1)
                const bassSequence = [87.31, 103.83, 77.78, 65.41]; // F2, Ab2, Eb2, C2
                bassSequence.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq / 2, now + idx * 1.0); // Sub octave

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(260, now + idx * 1.0);
                    filter.frequency.linearRampToValueAtTime(420, now + idx * 1.0 + 0.5);
                    filter.frequency.linearRampToValueAtTime(220, now + idx * 1.0 + 0.95);

                    gain.gain.setValueAtTime(0.001, now + idx * 1.0);
                    gain.gain.linearRampToValueAtTime(0.24 * this.musicVol, now + idx * 1.0 + 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 1.0 + 0.95);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 1.0);
                    osc.stop(now + idx * 1.0 + 0.98);
                });

                // 2. Sci-Fi Ringing Ambient Arpeggio Sequence (F Minor 7th motif)
                // Notes: F4, Ab4, C5, Eb5, C5, Ab4, F4, G4
                const arpNotes = [349.23, 415.30, 523.25, 622.25, 523.25, 415.30, 349.23, 392.00];
                arpNotes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const ringOsc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.5);

                    ringOsc.type = 'sine';
                    ringOsc.frequency.setValueAtTime(freq * 2.0, now + idx * 0.5); // Octave ring harmonic

                    gain.gain.setValueAtTime(0.12 * this.musicVol, now + idx * 0.5);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.5 + 0.45);

                    osc.connect(gain);
                    ringOsc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 0.5);
                    ringOsc.start(now + idx * 0.5);
                    osc.stop(now + idx * 0.5 + 0.45);
                    ringOsc.stop(now + idx * 0.5 + 0.45);
                });

                // 3. Ambient Pad Swell (F Minor Triad)
                const padNotes = [174.61, 207.65, 261.63]; // F3, Ab3, C4
                padNotes.forEach((freq) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(320, now);
                    filter.frequency.linearRampToValueAtTime(750, now + 2.0);
                    filter.frequency.linearRampToValueAtTime(280, now + 3.8);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.11 * this.musicVol, now + 1.8);
                    gain.gain.linearRampToValueAtTime(0.001, now + 3.9);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 3.95);
                });

                this.homeBgmTimeout = setTimeout(runHomeLoop, barDuration * 1000 - 50);
            } catch(e){}
        };

        runHomeLoop();
    }

    stopHomeBGM() {
        this.isPlayingHomeBGM = false;
        if (this.homeBgmTimeout) {
            clearTimeout(this.homeBgmTimeout);
            this.homeBgmTimeout = null;
        }
    }

    // =========================================================================
    // IN-GAME BACKGROUND MUSIC (BGM) - Disabled per user preference for silent gameplay
    // =========================================================================
    startBGM() {
        this.stopHomeBGM();
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
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
