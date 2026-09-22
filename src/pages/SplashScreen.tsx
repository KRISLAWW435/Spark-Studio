// src/pages/SplashScreen.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/soundManager';

const SPARK_URL = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/spark/spark_splash.webp';
const LOGO_URL = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/logo/logo-converted.webp';

export function SplashScreen() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [sparkError, setSparkError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const hasNavigatedRef = useRef(false);

  // Переход на экран загрузки /loading (никогда не на /menu!)
  const proceedToLoading = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      navigate('/loading', { replace: true });
    }, 400);
  }, [navigate]);

  useEffect(() => {
    // Гарантируем запуск фоновой музыки loading_loop
    soundManager.playMusic('loading_loop');

    // 4.5 сек показ + 0.4 сек fade out -> строго на /loading
    const timer = setTimeout(() => {
      proceedToLoading();
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [proceedToLoading]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        onClick={proceedToLoading}
        title="Нажмите для перехода к загрузке"
        className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer"
      >
        {/* ================= ФОН: 3 СЛОЯ ================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Слой 1: базовый градиент */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #DCE9FF 0%, #E8E0FF 50%, #F5E0F0 100%)',
            }}
          />

          {/* Слой 2: розовые пятна */}
          <div
            className="absolute"
            style={{
              left: '-5%',
              bottom: '-15%',
              width: '40vw',
              height: '40vw',
              background: 'radial-gradient(circle, rgba(233, 213, 255, 0.7) 0%, rgba(233, 213, 255, 0) 70%)',
              filter: 'blur(120px)',
              opacity: 0.5,
            }}
          />
          <div
            className="absolute"
            style={{
              right: '-5%',
              top: '-15%',
              width: '40vw',
              height: '40vw',
              background: 'radial-gradient(circle, rgba(251, 207, 232, 0.6) 0%, rgba(251, 207, 232, 0) 70%)',
              filter: 'blur(120px)',
              opacity: 0.5,
            }}
          />

          {/* Слой 3: белое свечение в центре */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '1000px',
              height: '1000px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 65%)',
              filter: 'blur(100px)',
            }}
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* ================= КОНТЕНТ: ЕДИНЫЙ ЦЕНТРИРОВАННЫЙ БЛОК ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 flex flex-col items-center justify-center px-4"
        >
          {/* Персонаж */}
          {!sparkError ? (
            <motion.img
              src={SPARK_URL}
              alt="Spark"
              onError={() => setSparkError(true)}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-[350px] md:w-[500px] xl:w-[750px] max-w-[90vw] max-h-[60vh] h-auto object-contain drop-shadow-sm"
            />
          ) : (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-56 h-56 rounded-full bg-white/80 border-4 border-amber-300 flex flex-col items-center justify-center shadow-lg"
            >
              <span className="text-7xl animate-bounce">⚡</span>
              <span className="text-sm font-black text-amber-700 mt-2">Спарк</span>
            </motion.div>
          )}

          {/* Логотип */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
            className="mt-2 flex items-center justify-center"
          >
            {!logoError ? (
              <img
                src={LOGO_URL}
                alt="Spark Studio"
                onError={() => setLogoError(true)}
                className="w-[280px] md:w-[380px] xl:w-[480px] max-w-[75vw] h-auto object-contain drop-shadow-xs"
              />
            ) : (
              <div className="text-center px-5 py-2 bg-white/80 rounded-2xl border border-purple-200 shadow-sm">
                <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  SPARK STUDIO
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SplashScreen;
