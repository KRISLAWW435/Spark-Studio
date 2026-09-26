// src/components/StartOverlay.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';
import {
  MagicButton,
  ParticleBurst,
  IdleParticles,
} from './effects';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface StartOverlayProps {
  onStart?: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  const navigate = useNavigate();
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

  // Запрос полноэкранного режима при первом клике пользователя
  const requestFullscreenMode = () => {
    const elem = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        /* Safari / iOS */
        elem.webkitRequestFullscreen().catch(() => {});
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen().catch(() => {});
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen().catch(() => {});
      }
    }
  };

  // Запуск сценария ТОЛЬКО при нажатии на магическую 3D-кнопку
  const handleStart = async () => {
    if (phase !== 'idle') return;

    // Вход в Fullscreen API по первому взаимодействию
    requestFullscreenMode();

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

    // 4. Завершение оверлея и переход к заставке SplashScreen (/splash)
    setTimeout(() => {
      if (onStart) onStart();
      navigate('/splash', { replace: true });
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
            <IdleParticles
              buttonRadius={buttonSize / 2}
              isHovered={isHovered}
            />

            {/* 2. 3D Сфера-кнопка (Магия Творчества) */}
            <MagicButton
              size={buttonSize}
              phase={phase}
              isHovered={isHovered}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onClick={handleStart}
            />

            {/* 3. Эффект взрыва красок и вспышки звезд */}
            <ParticleBurst
              active={phase === 'burst' || phase === 'transition'}
            />
          </div>
        </div>

        {/* ================= БЕЛАЯ ПЛАШКА С ТЕКСТОМ ================= */}
        <motion.div
          className="absolute bottom-4 mb-4 pb-[env(safe-area-inset-bottom)] z-20 flex flex-col items-center pointer-events-auto max-w-[90vw] cursor-pointer"
          onClick={handleStart}
          animate={{
            opacity: phase === 'idle' ? 1 : 0,
            y: phase === 'idle' ? 0 : 15,
          }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl md:rounded-3xl shadow-lg border border-white/80 flex flex-col items-center text-center active:scale-95 transition-transform">
            <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#17345F] tracking-tight leading-tight">
              Нажми, чтобы начать
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium mt-0.5 sm:mt-1">
              Магия творчества
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StartOverlay;
