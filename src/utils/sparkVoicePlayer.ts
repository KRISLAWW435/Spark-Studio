// src/utils/sparkVoicePlayer.ts

class SparkVoicePlayer {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Воспроизводит фразу Спарка по её ID
   * @param phraseId - например, 'menu_01'
   * @param onEnd - колбэк окончания воспроизведения
   */
  play(phraseId: string, onEnd?: () => void) {
    this.stop();

    // Проверяем флаг Mute
    if (this.isMuted()) {
      return;
    }

    // Формируем путь с учетом базового URL (GitHub Pages / Spark-Studio / локально)
    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    const audioUrl = `${baseUrl}audio/spark/${phraseId}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;

    audio.onended = () => {
      this.currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn(`[SparkVoicePlayer] Не удалось загрузить/воспроизвести аудио: ${audioUrl}`, e);
      this.currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.play().catch((err) => {
      // Игнорируем автоплей блокировку до первого взаимодействия
      console.warn('[SparkVoicePlayer] Автовоспроизведение ограничено браузером:', err);
    });
  }

  /**
   * Останавливает текущее воспроизведение
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Проверяет, выключен ли звук
   */
  isMuted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('spark_voice_muted') === 'true';
  }

  /**
   * Устанавливает статус Mute
   */
  setMuted(muted: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spark_voice_muted', String(muted));
    }
    if (muted) {
      this.stop();
    }
  }
}

export const sparkVoice = new SparkVoicePlayer();
