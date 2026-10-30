// Synthesized Arcade Sound Engine (Web Audio API)
class SoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freqStart, freqEnd, duration = 0.12, type = 'sine', gainVal = 0.14) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
    }

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  jump(isDouble = false) {
    if (isDouble) {
      this.playTone(360, 680, 0.13, 'triangle', 0.14);
    } else {
      this.playTone(240, 480, 0.12, 'sine', 0.14);
    }
  }

  bouncePad() {
    this.playTone(180, 820, 0.24, 'triangle', 0.18);
  }

  portal() {
    this.playTone(620, 260, 0.18, 'sine', 0.15);
    setTimeout(() => this.playTone(320, 790, 0.15, 'sine', 0.12), 60);
  }

  tag() {
    this.playTone(520, 110, 0.22, 'sawtooth', 0.18);
    setTimeout(() => this.playTone(280, 90, 0.16, 'square', 0.14), 50);
  }

  powerup() {
    this.playTone(440, 880, 0.18, 'triangle', 0.15);
  }

  tick(urgent = false) {
    this.playTone(urgent ? 780 : 520, urgent ? 720 : 500, 0.06, 'sine', 0.1);
  }

  roundEnd() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, n * 1.02, 0.18, 'triangle', 0.16), idx * 90);
    });
  }
}

export const sound = new SoundEngine();
