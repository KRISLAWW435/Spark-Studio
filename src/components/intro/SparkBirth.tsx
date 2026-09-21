// src/components/intro/SparkBirth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { SparkSprite } from '../mascot/SparkSprite';
import { sound } from '../../utils/soundManager';
import { speech } from '../../utils/speechManager';

export interface SparkBirthProps {
  onComplete?: () => void;
  onSkip?: () => void;
  onBackToMenu?: () => void;
}

// 8 этапов таймлайна (замедленная версия ~26-30 секунд):
// 1: Тишина (0.0 с, длит. 1.5 с)
// 2: Первая искра (1.5 с, длит. 4.0 с)
// 3: Рост идеи (5.5 с, длит. 4.0 с)
// 4: Вспышка и вжух (9.5 с, длит. 2.0 с)
// 5: Рождение Спарка (11.5 с, длит. 4.5 с)
// 6: Приветствие и взмах рукой (16.0 с, длит. 5.0 с)
// 7: Появление заголовка «Привет! Я Спарк» (21.0 с, длит. 5.0 с)
// 8: Финал (26.0 с+) — кнопка «Давай! →» ждёт клика
export type FrameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const SparkBirth: React.FC<SparkBirthProps> = ({
  onComplete,
  onSkip,
  onBackToMenu
}) => {
  const navigate = useNavigate();

  const [frame, setFrame] = useState<FrameNumber>(1);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    return speech.isAutoSpeak() !== false;
  });
  const [flashOpacity, setFlashOpacity] = useState<number>(0);

  // Реф для проверки статуса озвучки внутри замыканий таймеров
  const isAudioEnabledRef = useRef<boolean>(true);
  isAudioEnabledRef.current = isAudioEnabled;

  // Реф флага активного говорения для синхронизации кадров
  const isSpeakingRef = useRef<boolean>(false);
  // Реф для принудительного перехода к следующему кадру вручную
  const advanceFrameRef = useRef<(() => void) | null>(null);

  // Реплики по кадрам
  const frameTexts: Record<FrameNumber, string> = {
    1: 'В тишине космоса зарождается новая идея...',
    2: 'Сначала была лишь маленькая искра...',
    3: '...идея, которая хотела появиться на свет.',
    4: 'И произошла яркая вспышка вдохновения!',
    5: 'Так родился Спарк — огонёк дизайна.',
    6: 'Он здесь, чтобы помочь тебе стать настоящим дизайнером.',
    7: 'Привет! Я Спарк. Хочешь начать своё приключение в дизайне?',
    8: 'Привет! Я Спарк. Хочешь начать своё приключение в дизайне?'
  };

  // Минимальная длительность каждого кадра (в миллисекундах)
  // Кадр 1: 1.5 с
  // Кадр 2: 4.0 с
  // Кадр 3: 4.0 с
  // Кадр 4: 2.0 с
  // Кадр 5: 4.5 с
  // Кадр 6: 5.0 с
  // Кадр 7: 5.0 с
  const FRAME_MIN_DURATIONS: Record<FrameNumber, number> = {
    1: 1500,
    2: 4000,
    3: 4000,
    4: 2000,
    5: 4500,
    6: 5000,
    7: 5000,
    8: Infinity
  };

  // Озвучивание отдельной фразы через SpeechSynthesis с поддержкой onend
  const speakFramePhrase = (text: string, onEnd?: () => void) => {
    if (!isAudioEnabledRef.current) {
      onEnd?.();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();
      if (!cleanText) {
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ru-RU';
      utterance.pitch = 1.1;
      utterance.rate = 1.0;

      const voice = speech.getVoice();
      if (voice) {
        utterance.voice = voice;
      }

      isSpeakingRef.current = true;

      const handleEnd = () => {
        isSpeakingRef.current = false;
        onEnd?.();
      };

      utterance.onend = handleEnd;
      utterance.onerror = handleEnd;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      isSpeakingRef.current = false;
      onEnd?.();
    }
  };

  // Покадровая оркестровка с синхронизацией озвучки и минимальных таймингов
  useEffect(() => {
    console.log('🚀 Заставка запущена');
    console.log('🎬 Кадр 1: тишина (0.0 с)');

    let isDisposed = false;
    let activeTimer: number | null = null;
    let flashTimer: number | null = null;

    const runFrame = (current: FrameNumber) => {
      if (isDisposed) return;
      setFrame(current);

      // Логи каждого кадра с новыми таймингами
      if (current === 2) {
        console.log('✨ Кадр 2: первая искра (1.5 с)');
      } else if (current === 3) {
        console.log('🌱 Кадр 3: рост идеи (5.5 с)');
      } else if (current === 4) {
        console.log('⚡ Кадр 4: вспышка и вжух (9.5 с)');
        sound.playWhoosh();
        setFlashOpacity(1);
        flashTimer = window.setTimeout(() => {
          setFlashOpacity(0);
        }, 400);
      } else if (current === 5) {
        console.log('🔥 Кадр 5: рождение Спарка (11.5 с)');
      } else if (current === 6) {
        console.log('👋 Кадр 6: приветствие и взмах рукой (16.0 с)');
      } else if (current === 7) {
        console.log('🎉 Кадр 7: появление заголовка «Привет! Я Спарк» (21.0 с)');
      } else if (current === 8) {
        console.log('🔘 Кадр 8: кнопка Давай готова (26.0 с) — ждёт клика');
        return; // Кадр 8 остаётся активным навсегда, ожидая клика ребёнка
      }

      let minTimePassed = false;
      let speechDone = !isAudioEnabledRef.current;

      const tryAdvance = () => {
        if (isDisposed) return;
        // Переход происходит только тогда, когда:
        // 1. Прошло минимальное время кадра
        // 2. Озвучка закончила говорить (если она включена)
        if (minTimePassed && (!isSpeakingRef.current || speechDone)) {
          const next = (current + 1) as FrameNumber;
          runFrame(next);
        }
      };

      // Сохраняем колбэк для ручного перелистывания реплики («Далее →»)
      advanceFrameRef.current = () => {
        if (isDisposed) return;
        if (activeTimer !== null) clearTimeout(activeTimer);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        isSpeakingRef.current = false;
        if (current < 8) {
          const next = (current + 1) as FrameNumber;
          runFrame(next);
        }
      };

      // Запуск озвучки кадра (если включена)
      if (isAudioEnabledRef.current && current >= 2 && current <= 7) {
        speechDone = false;
        speakFramePhrase(frameTexts[current], () => {
          speechDone = true;
          tryAdvance();
        });
      } else {
        speechDone = true;
      }

      // Запуск таймера минимальной длительности кадра
      const duration = FRAME_MIN_DURATIONS[current];
      if (duration !== Infinity) {
        activeTimer = window.setTimeout(() => {
          minTimePassed = true;
          tryAdvance();
        }, duration);
      }
    };

    // Старт с 1-го кадра
    runFrame(1);

    return () => {
      console.log('🛑 Очистка заставки');
      isDisposed = true;
      if (activeTimer !== null) clearTimeout(activeTimer);
      if (flashTimer !== null) clearTimeout(flashTimer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Клик по кнопке «Озвучка» (Пользовательский жест для разблокировки звука браузером)
  const handleToggleVoice = () => {
    sound.playClick();
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    isAudioEnabledRef.current = nextState;
    speech.setAutoSpeak(nextState);

    if (nextState) {
      speakFramePhrase(frameTexts[frame]);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Кнопка «Пропустить»
  const handleSkip = () => {
    sound.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setFlashOpacity(0);
    setFrame(8);

    if (onSkip) {
      onSkip();
    } else {
      navigate('/studio');
    }
  };

  // Ручное перелистывание реплики («Далее →»)
  const handleNextPhrase = () => {
    sound.playClick();
    if (advanceFrameRef.current) {
      advanceFrameRef.current();
    }
  };

  // Кнопка «← Меню»
  const handleBackToMenu = () => {
    sound.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (onBackToMenu) {
      onBackToMenu();
    } else {
      navigate('/');
    }
  };

  // Кнопка «Давай! →»
  const handleProceed = () => {
    sound.playSuccess();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (onComplete) {
      onComplete();
    } else {
      navigate('/studio');
    }
  };

  // 18 звёзд на фоне
  const stars = [
    { top: '12%', left: '15%', size: 3, delay: 0.1 },
    { top: '22%', left: '78%', size: 4, delay: 0.4 },
    { top: '18%', left: '42%', size: 2, delay: 0.7 },
    { top: '35%', left: '10%', size: 3, delay: 0.2 },
    { top: '48%', left: '88%', size: 4, delay: 0.5 },
    { top: '65%', left: '22%', size: 2, delay: 0.9 },
    { top: '78%', left: '70%', size: 3, delay: 0.3 },
    { top: '85%', left: '35%', size: 4, delay: 0.6 },
    { top: '28%', left: '60%', size: 3, delay: 0.8 },
    { top: '55%', left: '6%', size: 2, delay: 0.2 },
    { top: '72%', left: '92%', size: 3, delay: 0.5 },
    { top: '14%', left: '88%', size: 2, delay: 0.7 },
    { top: '40%', left: '75%', size: 3, delay: 0.1 },
    { top: '60%', left: '80%', size: 2, delay: 0.4 },
    { top: '82%', left: '12%', size: 3, delay: 0.8 },
    { top: '8%', left: '32%', size: 2, delay: 0.3 },
    { top: '92%', left: '55%', size: 3, delay: 0.6 },
    { top: '30%', left: '26%', size: 4, delay: 0.5 }
  ];

  // Искорки, разлетающиеся при Кадре 3 («Рост»)
  const burstSparks = [
    { angle: 30, dist: 55, delay: 0 },
    { angle: 90, dist: 65, delay: 0.05 },
    { angle: 150, dist: 50, delay: 0.1 },
    { angle: 210, dist: 60, delay: 0.02 },
    { angle: 270, dist: 55, delay: 0.08 },
    { angle: 330, dist: 65, delay: 0.04 }
  ];

  const currentSpeechText = frameTexts[frame];

  return (
    <div
      id="spark-birth-screen"
      data-testid="spark-birth-screen"
      className="relative w-screen h-screen overflow-hidden select-none font-sans bg-gradient-to-b from-[#1E1B4B] to-[#0F172A] text-white flex flex-col justify-between items-center p-4 sm:p-6"
    >
      {/* 1. Верхняя панель: Меню (слева), Озвучка и Пропустить (справа) */}
      <header className="w-full max-w-5xl flex items-center justify-between z-30 pt-1">
        <button
          type="button"
          onClick={handleBackToMenu}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Меню</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Кнопка «Озвучить» (пользовательский клик разблокирует аудио) */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl backdrop-blur-md text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer active:scale-95 shadow-xs ${
              isAudioEnabled
                ? 'bg-amber-400 text-slate-900 border-amber-300 hover:bg-amber-300'
                : 'bg-white/15 text-white/90 border-white/30 hover:bg-white/25 hover:text-white'
            }`}
            title="Включить или выключить озвучку реплик"
          >
            {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioEnabled ? 'Озвучка включена' : 'Включить озвучку'}</span>
          </button>

          {/* Кнопка «Пропустить заставку» */}
          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <span>Пропустить</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 2. Мерцающие звёзды фона */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star, idx) => (
          <motion.div
            key={`star-${idx}`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 2.2 + (idx % 3) * 0.4,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
            className="rounded-full bg-[#FFD54F]"
          />
        ))}
      </div>

      {/* 3. Центральная сцена */}
      <main className="relative flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10 my-auto">
        {/* Заголовок «Привет! Я Спарк» (Кадр 7+) */}
        <AnimatePresence>
          {frame >= 7 && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center mb-3 sm:mb-4 select-none"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-300 drop-shadow-[0_4px_24px_rgba(255,213,79,0.5)] flex items-center justify-center gap-2">
                <span>Привет! Я Спарк</span>
                <Sparkles size={32} className="text-amber-200" />
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Контейнер персонажа и искры */}
        <div className="relative flex items-center justify-center min-h-[260px] sm:min-h-[290px]">
          {/* ======================================================== */}
          {/* Спарк появляется ТОЛЬКО с кадра 5 (без силуэта в кадрах 1-4)*/}
          {/* На кадрах 5-8: полноцветный Спарк с покачиванием         */}
          {/* ======================================================== */}
          {frame >= 5 && (
            <motion.div
              id="spark-mascot-wrapper"
              data-testid="spark-mascot-wrapper"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ y: [0, -4, 0], opacity: 1, scale: 1 }}
              transition={{
                y: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.4 },
                opacity: { duration: 0.4 }
              }}
              onClick={() => {
                sound.playClick();
                if (isAudioEnabledRef.current) {
                  speakFramePhrase(frameTexts[frame]);
                }
              }}
              className="relative flex items-center justify-center cursor-pointer select-none"
              title="Нажми на Спарка!"
            >
              {/* Теплое свечение вокруг Спарка при рождении */}
              <div className="absolute w-72 h-72 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />

              {/* Искорки радости на Кадре 6 */}
              {frame === 6 && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, idx) => (
                    <motion.div
                      key={`joy-spark-${idx}`}
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.2, 1.2, 0.4],
                        y: [-10, -45 - idx * 5]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: (idx * 0.15) % 1,
                        ease: 'easeOut'
                      }}
                      style={{
                        position: 'absolute',
                        top: `${30 + ((idx * 7) % 40)}%`,
                        left: `${15 + ((idx * 11) % 70)}%`
                      }}
                      className="text-amber-300 text-sm"
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Сам Спарк: режим waving (кадр 6), full (кадры 5, 7, 8) */}
              <SparkSprite
                mode={frame === 6 ? 'waving' : 'full'}
                size={230}
              />
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* СВЕРКАЮЩАЯ ИСКРА (КАДРЫ 1, 2, 3) НАКЛАДЫВАЕТСЯ В ЦЕНТРЕ    */}
          {/* ======================================================== */}
          {frame <= 3 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {/* Кадр 1: зарождающаяся точка */}
              {frame === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] shadow-[0_0_12px_#FFD54F]"
                />
              )}

              {/* Кадр 2: маленькая искра (8 px) со свечением */}
              {frame === 2 && (
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[8px] h-[8px] rounded-full bg-[#FFD54F] shadow-[0_0_24px_#FFD54F]"
                />
              )}

              {/* Кадр 3: рост до 16 px со свечением и вылетающими искорками */}
              {frame === 3 && (
                <div className="relative flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.85, 1, 0.85]
                    }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[16px] h-[16px] rounded-full bg-[#FFD54F] shadow-[0_0_40px_#FFD54F] z-10"
                  />

                  {burstSparks.map((b, i) => {
                    const rad = (b.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * b.dist;
                    const ty = Math.sin(rad) * b.dist;

                    return (
                      <motion.div
                        key={`spark-burst-${i}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: [0, tx],
                          y: [0, ty],
                          opacity: [1, 0.8, 0],
                          scale: [1, 0.4]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: b.delay,
                          ease: 'easeOut'
                        }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[#FFE082] shadow-[0_0_8px_#FFD54F]"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 4. Белое диалоговое окошко с текстом: поднято на ~20%, ширина 800px, текст lg/xl */}
      <footer className="w-full max-w-5xl flex flex-col items-center gap-4 z-20 pb-4 mb-6 sm:mb-14">
        <AnimatePresence mode="wait">
          {currentSpeechText && (
            <motion.div
              key={`speech-box-${frame}`}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              onClick={() => {
                if (isAudioEnabledRef.current) {
                  speakFramePhrase(currentSpeechText);
                }
              }}
              className="w-[92%] max-w-[800px] bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border-2 border-white/90 text-center cursor-pointer transition-transform hover:scale-[1.01]"
              title="Нажми, чтобы повторить фразу"
            >
              <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
                {currentSpeechText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Кнопка «Далее →» для ручного листания реплик (кадры 1-7) */}
        {frame < 8 && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={handleNextPhrase}
            className="px-8 py-3 rounded-2xl bg-white/25 hover:bg-white/35 text-white font-black text-base uppercase tracking-wider border-2 border-white/50 cursor-pointer backdrop-blur-xs transition-all active:scale-95 flex items-center gap-2 shadow-md hover:brightness-110"
            title="Перейти к следующей реплике"
          >
            <span>Далее</span>
            <ArrowRight size={18} />
          </motion.button>
        )}

        {/* Кнопка «Давай! →» (появляется в финале, кадр 8) */}
        {frame === 8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full flex justify-center"
          >
            <button
              type="button"
              onClick={handleProceed}
              className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] hover:from-[#E96820] hover:to-[#CC7700] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-[0_0_25px_rgba(255,150,0,0.5)] active:translate-y-1 active:border-b-2 cursor-pointer transition-all hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <span>Давай!</span>
              <ArrowRight size={24} />
            </button>
          </motion.div>
        )}
      </footer>

      {/* 5. Плавная белая вспышка на весь экран (Кадр 4, длительность 0.4 с) */}
      <motion.div
        animate={{ opacity: flashOpacity }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 bg-white pointer-events-none z-50"
        style={{ opacity: flashOpacity }}
      />
    </div>
  );
};

export default SparkBirth;
