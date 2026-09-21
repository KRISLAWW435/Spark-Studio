// src/hooks/useSpeech.ts
import { useState, useCallback, useEffect } from 'react';

export interface SpeechOptions {
  rate?: number;   // скорость (0.5 – 2)
  pitch?: number;  // тон (0 – 2)
  volume?: number; // громкость (0 – 1)
  useIntonationEnhancer?: boolean;
}

/**
 * Преобразует текст в живую эмоциональную речь со смысловыми паузами (многоточия)
 * и интонационными акцентами для задорного маленького огонька Спарка
 */
export function formatSpeechWithIntonation(rawText: string): string {
  if (!rawText) return '';
  
  let formatted = rawText.trim();

  // Заменяем технические аббревиатуры на дружелюбное фонетическое произношение
  formatted = formatted
    .replace(/\b50\s*XP\b/gi, 'пятьдесят икс-пи')
    .replace(/\b100\s*XP\b/gi, 'сто икс-пи')
    .replace(/\bXP\b/gi, 'икс-пи')
    .replace(/\b8pt\b/gi, 'восьмиточечную')
    .replace(/\bUI\b/g, 'Ю-Ай')
    .replace(/\bUX\b/g, 'Ю-Икс')
    .replace(/\bZzz\b/gi, 'хр-р-р… сплю…');

  // Добавляем выразительные микро-паузы в приветствиях и вопросах
  formatted = formatted
    .replace(/Привет[!,.]?\s*(?:я\s+Спарк)/i, 'Привет… я Спарк!')
    .replace(/Погнали\?/gi, 'Погнали?!')
    .replace(/\s+—\s+/g, '… ')
    .replace(/\s+-\s+/g, '… ');

  return formatted;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setIsSupported(true);

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Проверяем глобальный мут
    if (localStorage.getItem('sound_muted') === 'true') return;

    // Останавливаем любую текущую речь
    window.speechSynthesis.cancel();

    // Добавляем выразительные смысловые паузы и интонации Спарка
    const textToSpeak = options.useIntonationEnhancer !== false 
      ? formatSpeechWithIntonation(text) 
      : text;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ru-RU';
    
    // Настройки голоса Спарка: чуть быстрее и чуть выше, чтобы голос «улыбался»
    utterance.rate = options.rate ?? 1.05;   // ~1.05 (живой, бодрый темп)
    utterance.pitch = options.pitch ?? 1.1; // 1.05–1.15 (звонкий тон огонька)
    utterance.volume = options.volume ?? 1.0;

    // Получаем голоса
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const russianVoices = currentVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ru'));
    
    // ПРИОРИТЕТ #1: «Google русский» (Chrome/Android) — самый естественный и приятный
    let preferred = russianVoices.find(v => 
      v.name.toLowerCase().includes('google') && 
      (v.lang.toLowerCase().includes('ru') || v.name.toLowerCase().includes('рус'))
    ) || russianVoices.find(v => v.name.toLowerCase().includes('google'));

    // ПРИОРИТЕТ #2: Натуральные женские/дружелюбные голоса (Yandex, Milena, Alena, Daria)
    if (!preferred) {
      preferred = russianVoices.find(v => 
        v.name.toLowerCase().includes('yandex') ||  // Яндекс Браузер
        v.name.toLowerCase().includes('milena') ||  // macOS
        v.name.toLowerCase().includes('alena') ||   // Windows
        v.name.toLowerCase().includes('daria') ||   // Windows
        v.name.toLowerCase().includes('tatiana') ||
        v.name.toLowerCase().includes('svetlana')
      );
    }

    // ПРИОРИТЕТ #3: Любой доступный русский голос
    if (!preferred && russianVoices.length > 0) {
      preferred = russianVoices[0];
    }

    // ПРИОРИТЕТ #4: Любой голос, содержащий "ru" или "russian"
    if (!preferred) {
      preferred = currentVoices.find(v => 
        v.name.toLowerCase().includes('russian') || 
        v.name.toLowerCase().includes('русский')
      );
    }

    if (preferred) {
      utterance.voice = preferred;
      if (preferred.lang) {
        utterance.lang = preferred.lang;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Останавливаем речь при размонтировании
  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported };
}

