// src/utils/soundManager.ts
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('sound_muted', String(muted));
    window.dispatchEvent(new Event('sound-muted-change'));
    window.dispatchEvent(new CustomEvent('spark-sound-toggle', { detail: { muted } }));
  }

  isSoundMuted() {
    return localStorage.getItem('sound_muted') === 'true';
  }

  // Короткий «клик» (поп)
  playClick() {
    if (this.isSoundMuted()) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Успех (восходящее арпеджио)
  playSuccess() {
    if (this.isSoundMuted()) return;
    try {
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx!.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.08 + 0.3);
        osc.connect(gain).connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.08);
        osc.stop(this.ctx!.currentTime + i * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Праздничные фанфары (конфетти / победа)
  playCelebration() {
    if (this.isSoundMuted()) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx!.currentTime + i * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.07 + 0.35);
        osc.connect(gain).connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.07);
        osc.stop(this.ctx!.currentTime + i * 0.07 + 0.35);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Звук «вжух» (плавный свист/вспышка)
  playWhoosh() {
    if (this.isSoundMuted()) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Ошибка (нисходящий звук)
  playError() {
    if (this.isSoundMuted()) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }
}

export const sound = new SoundManager();
