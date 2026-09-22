// src/pages/LoadingScreen.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';

const LOADING_BG = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/backgrounds/Loading%20Screen.webp';

const LOADING_MESSAGES = [
  'Подготовка творческого пространства…',
  'Загрузка креативности…',
  'Настройка волшебных кистей…',
  'Смешиваем цвета…',
  'Почти готово…',
];

const PRELOAD_ASSETS = [
  'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/spark/spark_splash.webp',
  'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/logo/logo-converted.webp',
  LOADING_BG,
];

export function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Если трек loading_loop уже играет (продолжение со Splash) — не перезапускаем, иначе запускаем
    soundManager.playMusic('loading_loop');

    // Неблокирующая предзагрузка ресурсов в фоне
    const preloadAssets = async () => {
      try {
        const imagePromises = PRELOAD_ASSETS.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // не блокируем при ошибке сети
              img.src = src;
            })
        );
        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
        await Promise.all([...imagePromises, fontPromise]);
      } catch {
        // Фоновая предзагрузка завершается тихо
      }
    };
    preloadAssets();

    // Прогресс ровно за 5 секунд (0 -> 100%)
    const start = Date.now();
    const duration = 5000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
    }, 50);

    // Смена сообщений каждую 1 секунду (0-1с, 1-2с, 2-3с, 3-4с, 4-5с)
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1000);

    // Переход строго через 5 секунд + 0.5с fade out музыки и экрана
    const timer = setTimeout(() => {
      setIsExiting(true);
      soundManager.fadeOutMusic(500);
      setTimeout(() => {
        navigate('/menu', { replace: true });
      }, 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-end select-none"
      >
        {/* Фоновое изображение */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${LOADING_BG})` }}
        />

        {/* Затемнение/градиент внизу для читаемости текста и полосы */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/40 via-black/15 to-transparent pointer-events-none" />

        {/* Контент внизу: текст, прогресс-бар, проценты */}
        <div className="relative z-10 w-full max-w-[90vw] sm:max-w-[450px] lg:max-w-[600px] px-4 sm:px-8 pb-12 sm:pb-16 flex flex-col items-center gap-3 sm:gap-4">
          {/* Сменяющийся текст над шкалой */}
          <div className="h-8 flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-md text-center"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Горизонтальный органический прогресс-бар */}
          <div className="w-full h-3 sm:h-3.5 bg-white/30 backdrop-blur-xs rounded-full overflow-hidden relative shadow-inner p-[1px]">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FFD54F 0%, #FF9600 40%, #FF6B9D 70%, #A855F7 100%)',
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>

          {/* Проценты под шкалой */}
          <span className="text-white/90 text-sm sm:text-base font-semibold tracking-wider drop-shadow-sm">
            {progress}%
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LoadingScreen;
