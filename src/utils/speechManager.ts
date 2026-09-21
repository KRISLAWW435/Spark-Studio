// src/utils/speechManager.ts
export type SpeechSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<SpeechSpeed, number> = {
  slow: 0.85,
  normal: 1.05,
  fast: 1.25
};

class SpeechManager {
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private autoSpeakEnabled = true;
  private speed: SpeechSpeed = 'normal';
  private currentText = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spark_tts_enabled');
      this.autoSpeakEnabled = saved !== null ? saved === 'true' : true;

      const savedSpeed = localStorage.getItem('spark_tts_speed') as SpeechSpeed | null;
      if (savedSpeed && (savedSpeed === 'slow' || savedSpeed === 'normal' || savedSpeed === 'fast')) {
        this.speed = savedSpeed;
      }
    }
  }

  isAutoSpeak(): boolean {
    return this.autoSpeakEnabled;
  }

  setAutoSpeak(val: boolean) {
    this.autoSpeakEnabled = val;
    localStorage.setItem('spark_tts_enabled', String(val));
    window.dispatchEvent(new CustomEvent('spark-tts-toggle', { detail: { enabled: val } }));
  }

  getSpeed(): SpeechSpeed {
    return this.speed;
  }

  setSpeed(val: SpeechSpeed) {
    this.speed = val;
    localStorage.setItem('spark_tts_speed', val);
    window.dispatchEvent(new CustomEvent('spark-tts-speed', { detail: { speed: val } }));
  }

  getCurrentText(): string {
    return this.currentText;
  }

  getVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const ruVoices = voices.filter(
      (v) => v.lang.startsWith('ru') || v.lang === 'ru-RU' || v.lang.toLowerCase().includes('rus')
    );
    if (ruVoices.length === 0) return null;

    // Приоритет: Google русский -> Milena -> Alena -> первый русский
    const google = ruVoices.find((v) => v.name.toLowerCase().includes('google'));
    if (google) return google;
    const milena = ruVoices.find((v) => v.name.toLowerCase().includes('milena'));
    if (milena) return milena;
    const alena = ruVoices.find(
      (v) => v.name.toLowerCase().includes('alena') || v.name.toLowerCase().includes('алёна')
    );
    if (alena) return alena;

    return ruVoices[0];
  }

  speak(text: string, onEnd?: () => void, customOptions?: { pitch?: number; rate?: number }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stop();

    try {
      // Очистить текст от лишних эмодзи для более естественного чтения
      const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      if (!cleanText) return;

      this.currentText = text;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ru-RU';
      utterance.pitch = customOptions?.pitch ?? 1.15;
      utterance.rate = customOptions?.rate ?? (SPEED_RATES[this.speed] || 1.0);

      const voice = this.getVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        window.dispatchEvent(
          new CustomEvent('spark-speech-change', { detail: { speaking: true, text } })
        );
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.currentText = '';
        window.dispatchEvent(
          new CustomEvent('spark-speech-change', { detail: { speaking: false, text: '' } })
        );
        onEnd?.();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.currentText = '';
        window.dispatchEvent(
          new CustomEvent('spark-speech-change', { detail: { speaking: false, text: '' } })
        );
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis failed:', e);
    }
  }

  stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.currentText = '';
    window.dispatchEvent(
      new CustomEvent('spark-speech-change', { detail: { speaking: false, text: '' } })
    );
  }

  speaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking || this.isSpeaking;
    }
    return this.isSpeaking;
  }
}

export const speech = new SpeechManager();
