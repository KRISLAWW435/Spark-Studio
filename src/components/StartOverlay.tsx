// src/components/StartOverlay.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';
import {
  MagicButton,
  ParticleBurst,
  IdleParticles,
} from './effects';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface StartOverlayProps {
  onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  // Фазы: 'idle' -> 'press' -> 'burst' -> 'transition'
  const [phase, setPhase] = useState<'idle' | 'press' | 'burst' | 'transition'>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const layout = useResponsiveLayout();
  const isMobile = layout === 'mobile';

  // Размеры для экрана: mobile < 768px vs desktop/tablet
  const buttonSize = isMobile ? 120 : 200;
  const sparklesSize = isMobile ? 50 : 90;

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
  const handleStart = async () => {
    if (phase !== 'idle') return;

    // 1. Разблокировать AudioContext
    await soundManager.initCtx();

    // 2. Форсировать resume (для Chrome / Safari)
    if (soundManager.ctx && soundManager.ctx.state === 'suspended') {
      try {
        await soundManager.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume failed:', e);
      }
    }

    // 3. Воспроизвести пустой звук для «активации» контекста
    if (soundManager.ctx) {
      try {
        const buffer = soundManager.ctx.createBuffer(1, 1, 22050);
        const source = soundManager.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(soundManager.ctx.destination);
        source.start(0);
      } catch (e) {
        console.warn('Silent buffer activation failed:', e);
      }
    }

    // 4. Запустить звуки и фоновую музыку
    soundManager.playClick();
    soundManager.playCelebration();
    soundManager.playMusic('loading_loop');
    setPhase('press');

    // 2. Взрыв (0.14–0.55 сек): Вспышка звезды и выплеск краски
    setTimeout(() => {
      setShowFlash(true);
      setPhase('burst');
    }, 140);

    // 3. Плавный переход в приложение (0.55–0.9 сек)
    setTimeout(() => {
      setPhase('transition');
    }, 550);

    // 4. Завершение оверлея и переход к SplashScreen
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
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden p-4 sm:p-6 cursor-default"
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
          {/* Область шара с парящими искрами и рукой */}
          <div className="relative flex items-center justify-center w-[160px] h-[160px] md:w-[320px] md:h-[320px]">
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
                sparklesSize={sparklesSize}
              />
            )}
          </div>

          {/* ================= БЕЛАЯ ПЛАШКА ПОД КНОПКОЙ (слой z-20 поверх частиц) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: phase === 'idle' ? 1 : 0,
              y: phase === 'idle' ? 0 : 15,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-20 mt-4 md:mt-12 pointer-events-none select-none max-w-[260px] md:max-w-md w-full mx-auto"
          >
            <div className="px-4 py-3 md:px-8 md:py-6 rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_10px_30px_rgba(67,56,202,0.12)] text-center">
              <h1 className="text-lg md:text-3xl font-black text-slate-800 tracking-tight whitespace-nowrap">
                Нажми, чтобы начать
              </h1>
              <p className="text-xs md:text-base text-slate-500 font-medium mt-0.5 md:mt-1 whitespace-nowrap">
                Магия творчества
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StartOverlay;
