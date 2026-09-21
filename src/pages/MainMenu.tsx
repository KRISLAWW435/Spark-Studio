// src/pages/MainMenu.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkle,
  ArrowRight,
  Plus,
  Key,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { sound } from '../utils/soundManager';

const MENU_BG = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/backgrounds/menu-converted.webp';

const SPARK_MESSAGES = [
  'Заходи скорее — пора создавать новый дизайн!',
  'Ты знал? Персонажей для Roblox придумывают дизайнеры-художники 🎨',
  'Здесь ты научишься делать крутые штуки своими руками.',
  'Факт: логотип Apple нарисовали за 2 недели, а он — самый узнаваемый в мире.',
  'Не забывай: даже самый крутой дизайнер когда-то был новичком.',
  'Что если сегодня ты создашь свой первый логотип?',
  'Ошибся? Отлично! Дизайнеры учатся на ошибках.',
  'У Roblox 200+ миллионов игроков. И каждого зацепил чей-то дизайн.',
  'Идеи приходят, когда ты не боишься экспериментировать.',
  'Знаешь? Первый эмодзи создал дизайнер по имени Сигэтака Курита.',
  'Каждый раз, когда ты выбираешь цвет — ты уже дизайнер.',
  'Не бойся странных идей. Именно так рождаются бренды.',
];

/**
 * Подбор лучшего женского русского голоса
 * Приоритет: Google русский -> Milena -> Alena -> первый доступный ru-RU
 */
function getRussianFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const ruVoices = voices.filter(
    (v) => v.lang.startsWith('ru') || v.lang === 'ru-RU' || v.lang.toLowerCase().includes('rus')
  );
  if (ruVoices.length === 0) return null;

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

export function MainMenu() {
  const navigate = useNavigate();
  const {
    userName,
    player,
    hasSavedProgress,
    importSaveKey,
    startNewGame,
  } = usePlayer();

  const [messageIndex, setMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spark_voice_muted');
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return Boolean(document.fullscreenElement);
    }
    return false;
  });

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAttemptedFullscreenRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMutedRef = useRef(isMuted);
  const messageIndexRef = useRef(messageIndex);

  isMutedRef.current = isMuted;
  messageIndexRef.current = messageIndex;

  // Очистка таймера перехода к следующему сообщению
  const clearNextTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 1. Полноэкранный режим
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  const tryEnterFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 2. Автофуллскрин при первом входе
  useEffect(() => {
    if (!hasAttemptedFullscreenRef.current) {
      hasAttemptedFullscreenRef.current = true;
      tryEnterFullscreen();
    }
  }, [tryEnterFullscreen]);

  // Загрузка доступных голосов Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices refreshed
      };
    }
  }, []);

  // Функция планирования следующего сообщения
  const scheduleNextMessage = useCallback((delayMs: number) => {
    clearNextTimer();
    timerRef.current = setTimeout(() => {
      goToNextMessage();
    }, delayMs);
  }, [clearNextTimer]);

  // Озвучивание текста текущего сообщения
  const speakCurrentMessage = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      scheduleNextMessage(9000);
      return;
    }

    try {
      const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      if (!cleanText) {
        scheduleNextMessage(9000);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ru-RU';
      utterance.pitch = 1.15;
      utterance.rate = 1.0;

      const voice = getRussianFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        // После окончания озвучки ждем 3 секунды и переключаем сообщение
        if (!isMutedRef.current) {
          scheduleNextMessage(3000);
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error/interrupted:', e);
        if (!isMutedRef.current) {
          scheduleNextMessage(9000);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS speak error:', err);
      scheduleNextMessage(9000);
    }
  }, [scheduleNextMessage]);

  // Смена сообщения на следующее без повторений
  const goToNextMessage = useCallback(() => {
    clearNextTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    let next: number;
    const current = messageIndexRef.current;
    do {
      next = Math.floor(Math.random() * SPARK_MESSAGES.length);
    } while (next === current && SPARK_MESSAGES.length > 1);

    setMessageIndex(next);

    if (!isMutedRef.current) {
      speakCurrentMessage(SPARK_MESSAGES[next]);
    } else {
      scheduleNextMessage(9000);
    }
  }, [clearNextTimer, speakCurrentMessage, scheduleNextMessage]);

  // Запуск первого сообщения при монтировании
  useEffect(() => {
    clearNextTimer();
    if (!isMuted) {
      const timer = setTimeout(() => {
        speakCurrentMessage(SPARK_MESSAGES[0]);
      }, 600);
      return () => {
        clearTimeout(timer);
        clearNextTimer();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      scheduleNextMessage(9000);
      return () => {
        clearNextTimer();
      };
    }
  }, [isMuted, speakCurrentMessage, scheduleNextMessage, clearNextTimer]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clearNextTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearNextTimer]);

  // Переключение Mute в облачке
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('spark_voice_muted', String(newMuted));

    clearNextTimer();
    if (newMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      scheduleNextMessage(9000);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      speakCurrentMessage(SPARK_MESSAGES[messageIndex]);
    }
  };

  // Клик по облачку — мгновенная смена сообщения
  const handleBubbleClick = () => {
    tryEnterFullscreen();
    sound.playClick();
    goToNextMessage();
  };

  // Загрузка ключа .spark
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        sound.playError();
        setToast({ type: 'error', text: 'Файл пуст. Выберите корректный ключ .spark' });
        return;
      }

      const result = importSaveKey(content);
      if (result.success) {
        sound.playSuccess();
        setToast({ type: 'success', text: 'Студия успешно загружена!' });
        setTimeout(() => {
          navigate('/map');
        }, 800);
      } else {
        sound.playError();
        setToast({ type: 'error', text: result.error || 'Неверный формат ключа .spark' });
      }
    };

    reader.onerror = () => {
      sound.playError();
      setToast({ type: 'error', text: 'Не удалось прочитать файл.' });
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  // Кнопка «Новая студия»
  const handleNewStudio = () => {
    tryEnterFullscreen();
    sound.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    startNewGame();
    navigate('/intro');
  };

  // Кнопка «Продолжить»
  const handleContinue = () => {
    tryEnterFullscreen();
    sound.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    navigate('/map');
  };

  // Проверка наличия сохранения
  const hasSave = hasSavedProgress || Boolean(userName) || player.coins > 0;

  return (
    <div
      onClick={tryEnterFullscreen}
      className="relative w-screen h-screen overflow-hidden select-none bg-slate-900"
    >
      {/* 1. ФОН: Без наложений и затемнений, логотип уже встроен в фоновое изображение */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MENU_BG})` }}
      />

      {/* 2. ЯРКАЯ FULLSCREEN КНОПКА: В правом верхнем углу (48×48px, градиент, тень) */}
      <motion.button
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          toggleFullscreen();
        }}
        title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
        className="absolute top-5 right-5 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
        }}
      >
        {isFullscreen ? <Minimize2 size={20} className="text-white" /> : <Maximize2 size={20} className="text-white" />}
      </motion.button>

      {/* Скрытый инпут для ключа студии */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".spark,application/json,.json,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Toast уведомление о загрузке ключа */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-600/95 text-white'
                : 'bg-rose-600/95 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-semibold">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ДИАЛОГОВОЕ ОБЛАЧКО СПАРКА: Ширина 460px, top: 42%, right: 28%, padding 24px, text-lg */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        onClick={handleBubbleClick}
        className="absolute z-20 cursor-pointer group"
        style={{
          top: '42%',
          right: 'clamp(4%, 18vw, 28%)',
        }}
      >
        <div className="relative bg-white/95 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] p-6 w-[290px] sm:w-[380px] md:w-[460px] border border-white/70">
          {/* Сменяющийся текст */}
          <div className="min-h-[64px] flex items-center pr-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed"
              >
                {SPARK_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Кнопка Mute / Unmute в правом нижнем углу облачка */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Включить озвучку' : 'Выключить озвучку'}
            className="absolute bottom-3.5 right-3.5 p-2 rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            {isMuted ? (
              <VolumeX size={20} className="text-rose-400 hover:text-rose-600" />
            ) : (
              <Volume2 size={20} className="text-purple-600" />
            )}
          </button>

          {/* Хвостик облачка — указывает влево-вниз на Спарка */}
          <div className="absolute -left-2.5 bottom-6 w-5 h-5 bg-white/95 rotate-45 border-l border-b border-white/70" />
        </div>
      </motion.div>

      {/* 4. КНОПКИ ВНИЗУ ЭКРАНА: 3 штуки друг под другом */}
      <div className="absolute bottom-10 sm:bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 sm:gap-4 z-20 w-full px-4 max-w-[480px]">
        {/* Кнопка 1: «Продолжить» (Главная, видна при наличии сохранения) */}
        {hasSave && (
          <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full max-w-[450px] h-[64px] sm:h-[72px] rounded-full flex items-center justify-between px-6 sm:px-8 text-white shadow-[0_10px_25px_rgba(168,85,247,0.35)] transition-all"
            style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #C084FC 50%, #22D3EE 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <Sparkle size={26} className="text-white fill-white shrink-0" />
              <span className="text-xl sm:text-2xl font-bold tracking-wide">Продолжить</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-white shadow-inner">
                {userName || 'Алиса'} · 💰 {player.coins || 0}
              </span>
              <ArrowRight size={22} className="text-white shrink-0" />
            </div>
          </motion.button>
        )}

        {/* Кнопка 2: «Новая студия» (Вторичная) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewStudio}
          className="w-full max-w-[400px] h-[56px] sm:h-[64px] rounded-full flex items-center justify-center gap-3 border-2 border-[#A855F7] text-[#A855F7] bg-white/5 backdrop-blur-xs hover:bg-[#A855F7]/10 transition-colors shadow-sm"
        >
          <Plus size={22} className="text-[#A855F7] stroke-[2.5]" />
          <span className="text-lg sm:text-xl font-bold">Новая студия</span>
        </motion.button>

        {/* Кнопка 3: «Загрузить ключ от студии» (Третичная) */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[360px]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              tryEnterFullscreen();
              fileInputRef.current?.click();
            }}
            className="w-full max-w-[360px] h-[48px] sm:h-[52px] rounded-full flex items-center justify-center gap-2.5 border border-[#A855F7]/40 text-[#A855F7] bg-white/5 backdrop-blur-xs text-sm sm:text-base font-medium hover:bg-[#A855F7]/8 transition-colors"
          >
            <Key size={18} className="text-[#A855F7]" />
            <span>Загрузить ключ от студии</span>
          </motion.button>
          <p className="text-xs text-[#9CA3AF] font-medium tracking-normal text-center">
            Продолжить на другом устройстве
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
