// src/utils/soundManager.ts

class SoundManager {
  private ctx: AudioContext | null = null;
  private currentMusicAudio: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;

  constructor() {
    // Инициализация дефолтных значений в localStorage при первом запуске
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('music_volume') === null) {
        localStorage.setItem('music_volume', '0.5');
      }
      if (localStorage.getItem('voice_volume') === null) {
        localStorage.setItem('voice_volume', '1.0');
      }
      if (localStorage.getItem('music_muted') === null) {
        localStorage.setItem('music_muted', 'false');
      }
      if (localStorage.getItem('voice_muted') === null) {
        // Поддержка существующего флага spark_voice_muted
        const existingSparkMuted = localStorage.getItem('spark_voice_muted') === 'true';
        localStorage.setItem('voice_muted', String(existingSparkMuted));
      }

      // Глобальный обработчик разблокировки звука при первом клике/касании
      this.attachGlobalUnlockListener();
    }
  }

  /**
   * Разблокировка и инициализация AudioContext
   */
  public initCtx() {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Если фоновая музыка была поставлена на паузу браузером — возобновляем
    if (this.currentMusicAudio && this.currentMusicAudio.paused && !this.isMusicMuted()) {
      this.currentMusicAudio.play().catch(() => {});
    }
  }

  /**
   * Прикрепляет глобальный слушатель первого пользовательского взаимодействия
   */
  private attachGlobalUnlockListener() {
    const unlock = () => {
      this.initCtx();
      if (typeof window !== 'undefined') {
        localStorage.setItem('audio_unlocked', 'true');
        window.dispatchEvent(new Event('audio-unlocked'));
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  // --- ФОНОВАЯ МУЗЫКА ---

  /**
   * Запускает фоновую музыку зациклено
   * @param trackId Имя файла без расширения (например, 'menu_bg' или 'loading_loop')
   */
  playMusic(trackId: string) {
    if (typeof window === 'undefined') return;

    // Если этот же трек уже играет — не перезапускаем
    if (this.currentMusicAudio && this.currentTrackId === trackId && !this.currentMusicAudio.paused) {
      return;
    }

    this.stopMusic();
    this.currentTrackId = trackId;

    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    const musicUrl = `${baseUrl}audio/music/${trackId}.mp3`;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = this.isMusicMuted() ? 0 : this.getMusicVolume();
    this.currentMusicAudio = audio;

    audio.play().catch((err) => {
      // Игнорируем ошибку автоплея браузера до первого пользовательского взаимодействия
      console.warn('[SoundManager] Автовоспроизведение музыки ожидает взаимодействия:', err);
    });
  }

  /**
   * Возвращает ID текущего трека
   */
  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  /**
   * Останавливает фоновую музыку
   */
  stopMusic() {
    if (this.currentMusicAudio) {
      this.currentMusicAudio.pause();
      this.currentMusicAudio.currentTime = 0;
      this.currentMusicAudio = null;
      this.currentTrackId = null;
    }
  }

  /**
   * Плавно уменьшает громкость музыки до 0 за указанное время и останавливает трек
   * @param duration Длительность затухания в миллисекундах (по умолчанию 500мс)
   */
  fadeOutMusic(duration = 500): Promise<void> {
    return new Promise((resolve) => {
      const audio = this.currentMusicAudio;
      if (!audio || audio.paused || this.isMusicMuted()) {
        this.stopMusic();
        resolve();
        return;
      }

      const startVolume = audio.volume;
      const startTime = performance.now();
      const stepInterval = 20;

      const fadeInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const newVolume = Math.max(0, startVolume * (1 - progress));

        if (this.currentMusicAudio === audio) {
          audio.volume = newVolume;
        }

        if (progress >= 1) {
          clearInterval(fadeInterval);
          if (this.currentMusicAudio === audio) {
            this.stopMusic();
          }
          resolve();
        }
      }, stepInterval);
    });
  }

  // --- УПРАВЛЕНИЕ ГРОМКОСТЬЮ И MUTE ---

  getMusicVolume(): number {
    if (typeof window === 'undefined') return 0.5;
    const v = localStorage.getItem('music_volume');
    return v !== null ? parseFloat(v) : 0.5;
  }

  setMusicVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    if (typeof window !== 'undefined') {
      localStorage.setItem('music_volume', clamped.toFixed(2));
      window.dispatchEvent(new CustomEvent('music-volume-change', { detail: { volume: clamped } }));
    }
    if (this.currentMusicAudio) {
      this.currentMusicAudio.volume = this.isMusicMuted() ? 0 : clamped;
    }
  }

  getVoiceVolume(): number {
    if (typeof window === 'undefined') return 1.0;
    const v = localStorage.getItem('voice_volume');
    return v !== null ? parseFloat(v) : 1.0;
  }

  setVoiceVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    if (typeof window !== 'undefined') {
      localStorage.setItem('voice_volume', clamped.toFixed(2));
      window.dispatchEvent(new CustomEvent('voice-volume-change', { detail: { volume: clamped } }));
    }
  }

  isMusicMuted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('music_muted') === 'true';
  }

  setMusicMuted(muted: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('music_muted', String(muted));
      window.dispatchEvent(new CustomEvent('music-muted-change', { detail: { muted } }));
    }
    if (this.currentMusicAudio) {
      this.currentMusicAudio.volume = muted ? 0 : this.getMusicVolume();
      if (!muted && this.currentMusicAudio.paused) {
        this.currentMusicAudio.play().catch(() => {});
      }
    }
  }

  isVoiceMuted(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('voice_muted') === 'true' ||
      localStorage.getItem('spark_voice_muted') === 'true'
    );
  }

  setVoiceMuted(muted: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('voice_muted', String(muted));
      localStorage.setItem('spark_voice_muted', String(muted));
      window.dispatchEvent(new CustomEvent('voice-muted-change', { detail: { muted } }));
      window.dispatchEvent(new CustomEvent('spark-sound-toggle', { detail: { muted } }));
    }
  }

  setMuted(muted: boolean) {
    this.setMusicMuted(muted);
    this.setVoiceMuted(muted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_muted', String(muted));
      window.dispatchEvent(new Event('sound-muted-change'));
    }
  }

  // --- ЗВУКОВЫЕ ЭФФЕКТЫ (SFX) ---

  playClick() {
    if (this.isSoundMuted()) return;
    try {
      this.initCtx();
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

  playSuccess() {
    if (this.isSoundMuted()) return;
    try {
      this.initCtx();
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

  playCelebration() {
    if (this.isSoundMuted()) return;
    try {
      this.initCtx();
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

  playWhoosh() {
    if (this.isSoundMuted()) return;
    try {
      this.initCtx();
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

  playError() {
    if (this.isSoundMuted()) return;
    try {
      this.initCtx();
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

  isSoundMuted(): boolean {
    return this.isMusicMuted();
  }
}

export const sound = new SoundManager();
export const soundManager = sound;
