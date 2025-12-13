// Sound effect utilities using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
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
    // Quick clicking sound for spinning
    this.playTone(800, 0.05, 'square', 0.1);
  }

  reelStop() {
    // Thunk sound when reel stops
    this.playTone(200, 0.15, 'triangle', 0.3);
  }

  win() {
    // Victory fanfare
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.2), i * 100);
    });
  }

  bigWin() {
    // Extended victory sound
    const notes = [523, 659, 784, 880, 1047, 1175, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.25), i * 120);
    });
  }

  lose() {
    // Sad trombone descending
    this.playTone(300, 0.3, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(250, 0.4, 'sawtooth', 0.12), 200);
  }

  cardDeal() {
    // Quick swoosh for card dealing
    this.playTone(1200, 0.08, 'triangle', 0.15);
  }

  cardFlip() {
    // Card flip sound
    this.playTone(600, 0.1, 'square', 0.1);
  }

  chipPlace() {
    // Chip clicking sound
    this.playTone(1500, 0.05, 'sine', 0.2);
  }

  blackjack() {
    // Special blackjack win sound
    const notes = [659, 784, 988, 1175, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.35, 'sine', 0.22), i * 80);
    });
  }

  bust() {
    // Bust sound - descending
    this.playTone(400, 0.2, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.15), 150);
    setTimeout(() => this.playTone(200, 0.4, 'sawtooth', 0.1), 300);
  }

  buttonClick() {
    this.playTone(1000, 0.05, 'sine', 0.1);
  }
}

export const soundManager = new SoundManager();
