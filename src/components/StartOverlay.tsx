// src/components/StartOverlay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';
import {
  MagicButton,
  ParticleBurst,
  IdleParticles,
} from './effects';

interface StartOverlayProps {
  onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  // Фазы: 'idle' -> 'press' -> 'burst' -> 'transition'
  const [phase, setPhase] = useState<'idle' | 'press' | 'burst' | 'transition'>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [buttonSize, setButtonSize] = useState(220);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateSize = () => {
        const w = window.innerWidth;
        if (w < 640) {
          setButtonSize(180);
        } else if (w < 1024) {
          setButtonSize(205);
        } else {
          setButtonSize(230);
        }
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const handleHoverStart = useCallback(() => {
    if (phase !== 'idle') return;
    setIsHovered(true);
    soundManager.playClick();
  }, [phase]);

  const handleHoverEnd = useCallback(() => {
    if (phase !== 'idle') return;
    setIsHovered(false);
  }, [phase]);

  // Запуск сценария ТОЛЬКО при нажатии на магическую 3D-кнопку
  const handleStart = () => {
    if (phase !== 'idle') return;

    // 1. Нажатие (0.0–0.14 сек): легкое сжатие, разблокировка звука
    soundManager.initCtx();
    soundManager.playClick();
    setPhase('press');

    // 2. Взрыв (0.14–0.55 сек): Вспышка звезды и выплеск краски
    setTimeout(() => {
      setShowFlash(true);
      soundManager.playCelebration();
      setPhase('burst');
    }, 140);

    // 3. Плавный переход в приложение (0.55–0.9 сек)
    setTimeout(() => {
      soundManager.playMusic('loading_loop');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('audio-unlocked'));
      }
      setPhase('transition');
    }, 550);

    // 4. Завершение оверлея
    setTimeout(() => {
      onStart();
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="start-magic-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'transition' ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden p-6 cursor-default"
        style={{
          // Чистый пастельный фон как на референсе
          background: 'linear-gradient(145deg, #EEF2FF 0%, #F5F3FF 45%, #FDF2F8 100%)',
        }}
      >
        {/* ================= СВЕТОВАЯ ВСПЫШКА ВЗРЫВА ================= */}
        {showFlash && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, #FFFFFF 0%, #FEF08A 25%, #F472B6 55%, rgba(139, 92, 246, 0.4) 85%, rgba(255,255,255,0) 100%)',
              willChange: 'opacity',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.45, times: [0, 0.25, 1], ease: 'easeOut' }}
          />
        )}

        {/* ================= ЦЕНТРАЛЬНАЯ СЦЕНА С 3D-ШАРОМ ================= */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Область шара с парящими искрами */}
          <div className="relative flex items-center justify-center w-[290px] h-[290px] sm:w-[350px] sm:h-[350px]">
            {/* 1. Парящие золотые звезды, мазки краски и бусины вокруг шара */}
            {phase === 'idle' && (
              <IdleParticles buttonRadius={buttonSize / 2} isHovered={isHovered} />
            )}

            {/* 2. Мощный выплеск щупалец краски и звездный взрыв при клике */}
            <ParticleBurst active={phase === 'burst'} />

            {/* 3. Магический 3D шар с краской — ЕДИНСТВЕННЫЙ интерактивный элемент для клика */}
            {(phase === 'idle' || phase === 'press' || phase === 'burst') && (
              <MagicButton
                phase={phase}
                isHovered={isHovered}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onClick={handleStart}
                size={buttonSize}
              />
            )}
          </div>

          {/* ================= ТАБЛИЧКА «НАЖМИ, ЧТОБЫ НАЧАТЬ ТВОРИТЬ» (НЕ КЛИКАБЕЛЬНА) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: phase === 'idle' ? 1 : 0,
              y: phase === 'idle' ? 0 : 15,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mt-8 sm:mt-12 pointer-events-none select-none"
          >
            <div className="px-8 py-3.5 rounded-2xl bg-[#EDE9FE]/90 border border-[#DDD6FE]/80 text-[#4338CA] font-extrabold text-sm sm:text-base tracking-wider shadow-none">
              Нажми, чтобы начать творить
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StartOverlay;
