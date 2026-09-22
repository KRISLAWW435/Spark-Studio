// src/utils/sparkVoicePlayer.ts
import { soundManager } from './soundManager';
import { getAudioUrl } from './audioUrl';

class SparkVoicePlayer {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Воспроизводит фразу Спарка по её ID
   * @param phraseId - например, 'menu_01'
   * @param onEnd - колбэк окончания воспроизведения
   */
  play(phraseId: string, onEnd?: () => void) {
    this.stop();

    // Проверяем флаг Mute из soundManager
    if (soundManager.isVoiceMuted()) {
      return;
    }

    // Формируем надежный абсолютный путь к аудио
    const audioUrl = getAudioUrl(`audio/spark/${phraseId}.mp3`);
    const audio = new Audio(audioUrl);
    audio.volume = soundManager.getVoiceVolume();
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
   * Проверяет, выключен ли голос
   */
  isMuted(): boolean {
    return soundManager.isVoiceMuted();
  }

  /**
   * Устанавливает статус Mute
   */
  setMuted(muted: boolean) {
    soundManager.setVoiceMuted(muted);
    if (muted) {
      this.stop();
    }
  }
}

export const sparkVoice = new SparkVoicePlayer();
