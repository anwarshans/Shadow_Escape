/* ==========================================================================
   Shadow Escape - Web Audio API Synthesizer (SFX & BGM Generator)
   ========================================================================== */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.sfxVol = 0.8;
        this.musicVol = 0.5;
        this.bgmNode = null;
        this.bgmGain = null;
        this.isPlayingBGM = false;
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
            this.musicVol = settings.musicVolume !== undefined ? settings.musicVolume : 0.5;
        }
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play synthesized tone
    playTone(freq, type, duration, startVol = 0.5, endVol = 0.01) {
        if (this.isMuted || !this.ctx || this.sfxVol <= 0) return;
        this.ensureContext();

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(startVol * this.sfxVol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context safely ignored if user hasn't interacted yet
        }
    }

    // Sound Effects
    playJump() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.4 * this.sfxVol, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch(e){}
    }

    playDoubleJump() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.45 * this.sfxVol, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch(e){}
    }

    playDash() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            // White noise burst for dash
            const bufferSize = this.ctx.sampleRate * 0.15;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.5 * this.sfxVol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
        } catch(e){}
    }

    playFlight() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(340, this.ctx.currentTime + 0.12);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.25 * this.sfxVol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch(e){}
    }

    playCrystal() {
        this.playTone(880, 'sine', 0.1, 0.4, 0.01);
        setTimeout(() => this.playTone(1320, 'sine', 0.15, 0.4, 0.01), 60);
    }

    playKey() {
        this.playTone(523, 'triangle', 0.1, 0.5, 0.01);
        setTimeout(() => this.playTone(659, 'triangle', 0.1, 0.5, 0.01), 70);
        setTimeout(() => this.playTone(784, 'triangle', 0.2, 0.5, 0.01), 140);
    }

    playDoorUnlock() {
        this.playTone(400, 'sawtooth', 0.1, 0.3, 0.01);
        setTimeout(() => this.playTone(600, 'sawtooth', 0.2, 0.4, 0.01), 100);
    }

    playHurt() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.6 * this.sfxVol, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
        } catch(e){}
    }

    playExplosion() {
        if (!this.ctx) return;
        this.ensureContext();
        try {
            const bufferSize = this.ctx.sampleRate * 0.35;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.35);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.7 * this.sfxVol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
        } catch(e){}
    }

    playLevelClear() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.5, 0.01), index * 120);
        });
    }

    // Synth Ambient BGM Generator Loop
    startBGM() {
        if (this.isPlayingBGM || !this.ctx || this.musicVol <= 0) return;
        this.ensureContext();
        this.isPlayingBGM = true;

        const synthBGM = () => {
            if (!this.isPlayingBGM) return;
            try {
                // Dark ambient bass synth loop
                const bassFreqs = [55, 65, 49, 55];
                const now = this.ctx.currentTime;
                
                bassFreqs.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.8);
                    
                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, now + idx * 0.8);
                    
                    gain.gain.setValueAtTime(0.12 * this.musicVol, now + idx * 0.8);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.8 + 0.75);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    
                    osc.start(now + idx * 0.8);
                    osc.stop(now + idx * 0.8 + 0.75);
                });

                this.bgmTimeout = setTimeout(synthBGM, 3200);
            } catch(e){}
        };

        synthBGM();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) clearTimeout(this.bgmTimeout);
    }
}

const audio = new SoundEngine();
window.soundEngine = audio;
