/* ==========================================================================
   Shadow Escape - Professional Web Audio API Synthesizer (SFX & BGM Generator)
   ========================================================================== */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.sfxVol = 0.8;
        this.musicVol = 0.55;

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
            this.sfxVol = settings.sfxVolume !== undefined ? settings.sfxVolume : 0.8;
            this.musicVol = settings.musicVolume !== undefined ? settings.musicVolume : 0.55;
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

    // Helper: Play synthesized tone with custom envelope
    playTone(freq, type, duration, startVol = 0.5, endVol = 0.001) {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();

        try {
            const now = this.ctx.currentTime;
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
        } catch (e) {}
    }

    // =========================================================================
    // PROFESSIONAL IN-GAME SOUND EFFECTS (SFX)
    // =========================================================================

    // Jump: Punchy low-end sub pop + smooth pitch sweep (140Hz -> 540Hz)
    playJump() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;

            // Pitch Sweep Osc
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(540, now + 0.14);

            gain.gain.setValueAtTime(0.45 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

            // Sub-thump for solid feel
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subOsc.type = 'triangle';
            subOsc.frequency.setValueAtTime(90, now);
            subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

            subGain.gain.setValueAtTime(0.35 * this.sfxVol, now);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.14);
            subOsc.start(now);
            subOsc.stop(now + 0.08);
        } catch(e){}
    }

    // Double Jump: Energetic dual-tone sci-fi energy surge
    playDoubleJump() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(320, now);
            osc1.frequency.exponentialRampToValueAtTime(840, now + 0.16);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(480, now);
            osc2.frequency.exponentialRampToValueAtTime(1260, now + 0.16);

            gain.gain.setValueAtTime(0.4 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.16);
            osc2.stop(now + 0.16);
        } catch(e){}
    }

    // Dash: Dynamic high-pass noise burst with air thrust sweep
    playDash() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 3.0;
            filter.frequency.setValueAtTime(1600, now);
            filter.frequency.exponentialRampToValueAtTime(250, now + 0.15);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.55 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch(e){}
    }

    // Flight / Jetpack: Rich low-frequency jet thruster hum with LFO modulation
    playFlight() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(280, now + 0.11);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now);

            gain.gain.setValueAtTime(0.28 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.11);
        } catch(e){}
    }

    // Crystal Collect: Shimmering 4-note crystalline arpeggio (C6-E6-G6-C7)
    playCrystal() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const notes = [1046.50, 1318.51, 1567.98, 2093.00];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.12, 0.45, 0.005);
            }, idx * 45);
        });
    }

    // Keycard Collect: High-tech metallic card chime with major 7th interval
    playKey() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const notes = [659.25, 830.61, 987.77, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.18, 0.5, 0.005);
            }, idx * 60);
        });
    }

    // Door Unlock: Heavy pneumatic lock release + hydraulic thud
    playDoorUnlock() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            
            // Lock release tone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(650, now + 0.22);
            gain.gain.setValueAtTime(0.35 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

            // Sub thud
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(120, now);
            sub.frequency.exponentialRampToValueAtTime(30, now + 0.25);
            subGain.gain.setValueAtTime(0.5 * this.sfxVol, now);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            sub.connect(subGain);
            subGain.connect(this.ctx.destination);

            osc.start(now);
            sub.start(now);
            osc.stop(now + 0.22);
            sub.stop(now + 0.25);
        } catch(e){}
    }

    // Hurt / Damage: Sub-bass impact punch + distorted shield crack
    playHurt() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;

            // Sub bass impact drop
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(190, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);
            gain.gain.setValueAtTime(0.65 * this.sfxVol, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.28);

            // Distortion / Noise punch
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.7;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.5 * this.sfxVol, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            osc.start(now);
            noise.start(now);
            osc.stop(now + 0.28);
        } catch(e){}
    }

    // Explosion: Layered sub-bass kick + metallic crunch + low-pass rumble
    playExplosion() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const duration = 0.45;

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
            filter.frequency.setValueAtTime(500, now);
            filter.frequency.exponentialRampToValueAtTime(40, now + duration);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.75 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

            // Sub kick
            const kick = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kick.type = 'sine';
            kick.frequency.setValueAtTime(150, now);
            kick.frequency.exponentialRampToValueAtTime(25, now + 0.3);
            kickGain.gain.setValueAtTime(0.8 * this.sfxVol, now);
            kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            kick.connect(kickGain);
            kickGain.connect(this.ctx.destination);

            noise.start(now);
            kick.start(now);
            kick.stop(now + 0.3);
        } catch(e){}
    }

    // Level Clear: Triumphant polyphonic fanfare arpeggio
    playLevelClear() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        const chords = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 659.25, time: 100 },  // E5
            { freq: 783.99, time: 200 },  // G5
            { freq: 987.77, time: 300 },  // B5
            { freq: 1046.50, time: 420 }  // C6
        ];
        chords.forEach(c => {
            setTimeout(() => {
                this.playTone(c.freq, 'sine', 0.4, 0.5, 0.005);
                this.playTone(c.freq * 1.5, 'triangle', 0.25, 0.25, 0.005);
            }, c.time);
        });
    }

    // UI Click: Snappy sci-fi tick
    playUIClick() {
        this.playTone(1200, 'sine', 0.04, 0.3, 0.001);
    }

    // UI Hover: Subtle soft button hover pulse
    playUIHover() {
        this.playTone(800, 'triangle', 0.03, 0.12, 0.001);
    }

    // Attack / Slash: Sharp sci-fi blade slash
    playAttack() {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(850, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

            filter.type = 'highpass';
            filter.frequency.setValueAtTime(400, now);

            gain.gain.setValueAtTime(0.45 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
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
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

            gain.gain.setValueAtTime(0.35 * this.sfxVol, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
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
                    filter.frequency.setValueAtTime(220, now + idx * 1.0);
                    filter.frequency.linearRampToValueAtTime(380, now + idx * 1.0 + 0.5);
                    filter.frequency.linearRampToValueAtTime(180, now + idx * 1.0 + 0.95);

                    gain.gain.setValueAtTime(0.001, now + idx * 1.0);
                    gain.gain.linearRampToValueAtTime(0.18 * this.musicVol, now + idx * 1.0 + 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 1.0 + 0.95);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 1.0);
                    osc.stop(now + idx * 1.0 + 0.98);
                });

                // 2. Sci-Fi Ambient Arpeggio Sequence (F Minor 7th motif)
                // Notes: F4, Ab4, C5, Eb5, C5, Ab4, F4, G4
                const arpNotes = [349.23, 415.30, 523.25, 622.25, 523.25, 415.30, 349.23, 392.00];
                arpNotes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.5);

                    gain.gain.setValueAtTime(0.08 * this.musicVol, now + idx * 0.5);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.5 + 0.45);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 0.5);
                    osc.stop(now + idx * 0.5 + 0.45);
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
                    filter.frequency.setValueAtTime(300, now);
                    filter.frequency.linearRampToValueAtTime(650, now + 2.0);
                    filter.frequency.linearRampToValueAtTime(250, now + 3.8);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.07 * this.musicVol, now + 1.8);
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
    // IN-GAME BACKGROUND MUSIC (BGM)
    // =========================================================================
    startBGM() {
        if (this.isPlayingBGM || this.isMuted || !this.ctx || this.musicVol <= 0) return;
        this.ensureContext();
        this.stopHomeBGM(); // Ensure Home BGM is stopped
        this.isPlayingBGM = true;

        const synthInGameBGM = () => {
            if (!this.isPlayingBGM || this.isMuted || !this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                // Cyberpunk stealth pulse bassline
                const bassFreqs = [55, 65, 49, 58, 55, 65, 73, 49];
                bassFreqs.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.4);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(320, now + idx * 0.4);
                    filter.frequency.exponentialRampToValueAtTime(120, now + idx * 0.4 + 0.35);

                    gain.gain.setValueAtTime(0.12 * this.musicVol, now + idx * 0.4);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.4 + 0.35);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 0.4);
                    osc.stop(now + idx * 0.4 + 0.35);
                });

                // Subtle hi-hat synth pulse
                for (let i = 0; i < 8; i++) {
                    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
                    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;

                    const noise = this.ctx.createBufferSource();
                    noise.buffer = buffer;
                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.value = 7000;

                    const gain = this.ctx.createGain();
                    gain.gain.setValueAtTime(0.03 * this.musicVol, now + i * 0.4);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.03);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    noise.start(now + i * 0.4);
                }

                this.bgmTimeout = setTimeout(synthInGameBGM, 3200);
            } catch(e){}
        };

        synthInGameBGM();
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
