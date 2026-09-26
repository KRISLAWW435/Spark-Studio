// src/pages/LoadingScreen.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';

const LOADING_BG = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/backgrounds/Loading%20Screen.webp';

// Минимальное время показа экрана загрузки — 3.5 секунды (между 3 и 4 секундами)
const MIN_LOADING_TIME = 3500;

const LOADING_MESSAGES = [
  'Подготовка творческого пространства…',
  'Загрузка креативности…',
  'Настройка волшебных кистей…',
  'Смешиваем цвета…',
  'Почти готово…',
];

// Критичные ассеты для реальной предзагрузки в память браузера
const ASSETS_TO_PRELOAD = [
  // Фоны
  `${import.meta.env.BASE_URL}assets/backgrounds/menu-bg-clean.webp`,
  'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/backgrounds/Loading%20Screen.webp',
  // Логотип
  'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/logo/logo-converted.webp',
  `${import.meta.env.BASE_URL}assets/logo/logo-converted.webp`,
  // Спарк (эмоции и состояния)
  `${import.meta.env.BASE_URL}assets/spark/spark_idle.webp`,
  `${import.meta.env.BASE_URL}assets/spark/spark_happy.webp`,
  `${import.meta.env.BASE_URL}assets/spark/spark_thinking.webp`,
  // Музыка главного меню
  `${import.meta.env.BASE_URL}audio/music/menu_bg.mp3`,
  // Голосовые реплики Спарка для главного меню (12 треков)
  `${import.meta.env.BASE_URL}audio/spark/menu_01.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_02.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_03.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_04.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_05.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_06.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_07.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_08.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_09.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_10.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_11.mp3`,
  `${import.meta.env.BASE_URL}audio/spark/menu_12.mp3`,
];

export function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const actualLoadedCountRef = useRef<number>(0);

  // 1. Реальная предзагрузка ассетов в фоне
  useEffect(() => {
    startTimeRef.current = Date.now();
    soundManager.playMusic('loading_loop');

    let completed = false;
    const total = ASSETS_TO_PRELOAD.length;

    const checkItemLoaded = () => {
      actualLoadedCountRef.current++;
      if (actualLoadedCountRef.current >= total && !completed) {
        completed = true;
        setAllLoaded(true);
      }
    };

    // Запуск предзагрузки изображений и аудио
    ASSETS_TO_PRELOAD.forEach((url) => {
      if (url.endsWith('.mp3')) {
        const audio = new Audio();
        audio.onloadeddata = checkItemLoaded;
        audio.onerror = checkItemLoaded; // защита: не блокировать при ошибке
        audio.src = url;
      } else {
        const img = new Image();
        img.onload = checkItemLoaded;
        img.onerror = checkItemLoaded; // защита: не блокировать при ошибке
        img.src = url;
      }
    });

    // Смена текстовых сообщений
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1100);

    // Защита от вечной загрузки: максимум 10 секунд
    const maxTimer = setTimeout(() => {
      console.warn('Preload timeout — переход без полной загрузки');
      completed = true;
      setAllLoaded(true);
    }, 10000);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(maxTimer);
    };
  }, []);

  // 2. Плавный прогресс шкалы с гарантией показа 3-4 секунды (даже при быстром кэше)
  useEffect(() => {
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const total = ASSETS_TO_PRELOAD.length;
      const fileProgress = Math.round((actualLoadedCountRef.current / total) * 100);
      const timeRatio = Math.min(1, elapsed / MIN_LOADING_TIME);
      const timeProgress = Math.round(timeRatio * 100);

      // Прогресс плавно увеличивается в течение 3.5 секунд, отражая реальную загрузку
      let currentVal: number;
      if (allLoaded) {
        // Если ассеты уже загружены, шкала плавно добегает до 100% за время MIN_LOADING_TIME
        currentVal = Math.max(timeProgress, progress);
        if (elapsed >= MIN_LOADING_TIME) {
          currentVal = 100;
        }
      } else {
        // Пока файлы грузятся, процент ограничен минимумом из времени и файлов
        currentVal = Math.min(95, Math.max(progress, Math.min(fileProgress, timeProgress)));
      }

      setProgress(Math.min(100, Math.max(progress, currentVal)));
    }, 40);

    return () => clearInterval(progressInterval);
  }, [allLoaded, progress]);

  // 3. Выход из экрана после истечения 3-4 секунд И завершения загрузки
  useEffect(() => {
    if (!allLoaded) return;

    const elapsed = Date.now() - startTimeRef.current;
    const delay = Math.max(0, MIN_LOADING_TIME - elapsed);

    const timer = setTimeout(() => {
      setProgress(100);
      setIsExiting(true);
      soundManager.fadeOutMusic(400);
    }, delay);

    return () => clearTimeout(timer);
  }, [allLoaded]);

  // 4. Переход на Главное Меню во время белой вспышки
  useEffect(() => {
    if (!isExiting) return;
    const navTimer = setTimeout(() => {
      navigate('/menu', { replace: true });
    }, 350);
    return () => clearTimeout(navTimer);
  }, [isExiting, navigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-end select-none bg-[#EEF2FF]">
      {/* Белая вспышка поверх всего при переходе в меню (полное исключение чёрного экрана) */}
      <motion.div
        className="fixed inset-0 z-50 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />

      {/* Фоновое изображение экрана загрузки */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOADING_BG})` }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Контент внизу: 1. Полоса загрузки, 2. Текст статуса под ней в плашке */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)] z-10 w-full max-w-[90vw] sm:max-w-xs md:max-w-sm px-4 flex flex-col items-center justify-center space-y-4 mx-auto">
        {/* 1. Полоса загрузки (Progress Bar) */}
        <div className="w-full h-2.5 sm:h-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-full overflow-hidden relative shadow-sm p-[1px]">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #A855F7 0%, #22D3EE 100%)',
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        </div>

        {/* 2. Текст статуса под полосой загрузки в полупрозрачной плашке */}
        <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm animate-pulse text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-medium text-slate-700 text-center"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
