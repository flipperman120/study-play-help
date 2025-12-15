// Sound effect utilities using Web Audio API

// Global sound state check - we'll check the DOM for theme class
const getSoundEnabled = (): boolean => {
  // Check if sound is disabled via data attribute on body
  return !document.body.hasAttribute('data-sound-disabled');
};

class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!getSoundEnabled()) return;
    
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  spin() {
    this.playTone(800, 0.05, 'square', 0.1);
  }

  reelStop() {
    this.playTone(200, 0.15, 'triangle', 0.3);
  }

  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.2), i * 100);
    });
  }

  bigWin() {
    const notes = [523, 659, 784, 880, 1047, 1175, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.25), i * 120);
    });
  }

  lose() {
    this.playTone(300, 0.3, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(250, 0.4, 'sawtooth', 0.12), 200);
  }

  cardDeal() {
    this.playTone(1200, 0.08, 'triangle', 0.15);
  }

  cardFlip() {
    this.playTone(600, 0.1, 'square', 0.1);
  }

  chipPlace() {
    this.playTone(1500, 0.05, 'sine', 0.2);
  }

  blackjack() {
    const notes = [659, 784, 988, 1175, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.35, 'sine', 0.22), i * 80);
    });
  }

  bust() {
    this.playTone(400, 0.2, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.15), 150);
    setTimeout(() => this.playTone(200, 0.4, 'sawtooth', 0.1), 300);
  }

  buttonClick() {
    this.playTone(1000, 0.05, 'sine', 0.1);
  }

  bonus() {
    const notes = [523, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.3), i * 80);
    });
  }
}

export const soundManager = new SoundManager();
