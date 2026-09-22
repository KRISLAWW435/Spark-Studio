// src/pages/MainMenu.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkle,
  ArrowRight,
  Play,
  Plus,
  Key,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { sound, soundManager } from '../utils/soundManager';
import { SPARK_MENU_PHRASES } from '../data/sparkMenuPhrases';
import { sparkVoice } from '../utils/sparkVoicePlayer';
import { SettingsModal } from '../components/SettingsModal';
import { useResponsiveLayout, useIsPortrait } from '../hooks/useResponsiveLayout';
import { SparkBubble } from '../components/SparkBubble';

const MENU_BG = `${import.meta.env.BASE_URL}assets/backgrounds/menu-bg-clean.webp`;
const LOGO_URL = 'https://cdn.jsdelivr.net/gh/KRISLAWW435/Spark-assets@main/assets/logo/logo-converted.webp';

export function MainMenu() {
  const navigate = useNavigate();
  const {
    userName,
    player,
    hasSavedProgress,
    importSaveKey,
    startNewGame,
  } = usePlayer();

  const layout = useResponsiveLayout();
  const isPortrait = useIsPortrait();

  const [messageIndex, setMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.isVoiceMuted());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return Boolean(document.fullscreenElement);
    }
    return false;
  });

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 2. Автоповорот для планшета и мобильного (Landscape Lock)
  useEffect(() => {
    if (screen.orientation && 'lock' in screen.orientation) {
      (screen.orientation as any).lock('landscape').catch(() => {});
    }
  }, []);

  // 3. Запуск фоновой музыки при входе
  useEffect(() => {
    soundManager.playMusic('menu_bg');
  }, []);

  // 4. Слушатель изменения громкости / mute из настроек
  useEffect(() => {
    const handleVoiceMuteChange = () => {
      setIsMuted(soundManager.isVoiceMuted());
    };

    window.addEventListener('voice-muted-change', handleVoiceMuteChange);
    window.addEventListener('spark-sound-toggle', handleVoiceMuteChange);

    return () => {
      window.removeEventListener('voice-muted-change', handleVoiceMuteChange);
      window.removeEventListener('spark-sound-toggle', handleVoiceMuteChange);
    };
  }, []);

  // 5. Баг 3: Таймер смены сообщений Спарка строго каждые 9 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SPARK_MENU_PHRASES.length);
    }, 9000); // 9 секунд — чтобы ребёнок успел прочитать
    return () => clearInterval(timer);
  }, []);

  // 6. Баг 2 и 3: Озвучка фразы Спарка при смене индекса
  useEffect(() => {
    if (!soundManager.isVoiceMuted()) {
      const phraseId = `menu_${String(messageIndex + 1).padStart(2, '0')}`;
      sparkVoice.play(phraseId);
    }
  }, [messageIndex, isMuted]);

  // Очистка голоса при размонтировании
  useEffect(() => {
    return () => {
      sparkVoice.stop();
    };
  }, []);

  // Переключение Mute в облачке
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setVoiceMuted(newMuted);

    if (newMuted) {
      sparkVoice.stop();
    } else {
      const phraseId = `menu_${String(messageIndex + 1).padStart(2, '0')}`;
      sparkVoice.play(phraseId);
    }
  };

  // Клик по облачку — смена сообщения
  const handleBubbleClick = () => {
    tryEnterFullscreen();
    sound.playClick();
    setMessageIndex((prev) => (prev + 1) % SPARK_MENU_PHRASES.length);
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
    sparkVoice.stop();
    startNewGame();
    navigate('/intro');
  };

  // Кнопка «Продолжить»
  const handleContinue = () => {
    tryEnterFullscreen();
    sound.playClick();
    sparkVoice.stop();
    navigate('/map');
  };

  // Проверка наличия сохранения
  const hasSave = hasSavedProgress || Boolean(userName) || player.coins > 0;

  // ================= АДАПТИВНЫЕ ПАРАМЕТРЫ ДЛЯ МЕНЮ =================
  const logoConfig = {
    mobile: { top: '16px', width: '160px' },
    tablet: { top: '32px', width: '340px' },
    desktop: { top: '40px', width: '420px' },
  }[layout];

  const buttonsConfig = {
    mobile: {
      containerClass: 'absolute left-1/2 -translate-x-1/2 bottom-3 flex flex-col items-center gap-1.5 z-20',
      buttonWidth: 'w-[140px]',
      buttonHeight: 'h-[32px]',
      buttonFont: 'text-xs font-bold',
      keyFont: 'text-[10px] font-bold',
      iconSize: 12,
      subTextFont: 'hidden',
      subTextMargin: '',
      showKeySubtext: false,
      keyButtonLabel: 'Загрузить ключ',
    },
    tablet: {
      containerClass: 'absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 w-full px-4',
      buttonWidth: 'w-[320px]',
      buttonHeight: 'min-h-[48px] h-[50px]',
      buttonFont: 'text-base font-bold',
      keyFont: 'text-base font-bold',
      iconSize: 20,
      subTextFont: 'text-sm',
      subTextMargin: 'mt-2.5',
      showKeySubtext: true,
      keyButtonLabel: 'Загрузить ключ от студии',
    },
    desktop: {
      containerClass: 'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 w-full px-4',
      buttonWidth: 'w-[380px]',
      buttonHeight: 'min-h-[52px] h-[58px]',
      buttonFont: 'text-lg font-bold',
      keyFont: 'text-lg font-bold',
      iconSize: 22,
      subTextFont: 'text-base',
      subTextMargin: 'mt-3',
      showKeySubtext: true,
      keyButtonLabel: 'Загрузить ключ от студии',
    },
  }[layout];

  return (
    <div
      onClick={tryEnterFullscreen}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#EEF2FF]"
    >
      {/* ================= БАННЕР «ПОВЕРНИ УСТРОЙСТВО» ДЛЯ ПОРТРЕТА ================= */}
      {isPortrait && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
          <p className="text-white text-2xl text-center px-8 font-medium">
            Поверни устройство горизонтально 📱
          </p>
        </div>
      )}

      {/* 1. ФОН */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MENU_BG})` }}
      />

      {/* 2. ЛОГОТИП СТУДИИ (Точное позиционирование через inline-стиль) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center"
        style={{
          top: logoConfig.top,
        }}
      >
        {!logoError ? (
          <img
            src={LOGO_URL}
            alt="Spark Studio"
            onError={() => setLogoError(true)}
            className="h-auto object-contain drop-shadow-md"
            style={{
              width: logoConfig.width,
              height: 'auto',
            }}
          />
        ) : (
          <div
            className="text-center px-4 py-1.5 bg-white/85 rounded-2xl border border-purple-200 shadow-sm"
            style={{ width: logoConfig.width }}
          >
            <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              SPARK STUDIO
            </span>
          </div>
        )}
      </motion.div>

      {/* 3. ВЕРХНИЕ ПРАВЫЕ КНОПКИ И БЕЙДЖ ИГРОКА */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 z-30 flex items-center gap-2 sm:gap-2.5">
        {/* Бейдж игрока: вынесен из кнопки [👤 Имя · 💰 Монеты] */}
        {hasSave && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-slate-800 shadow-sm text-xs sm:text-sm font-semibold select-none">
            <span>👤 {userName || 'Кристина'}</span>
            <span className="text-slate-400">·</span>
            <span>💰 {player.coins || 0}</span>
          </div>
        )}

        {/* Кнопка настроек */}
        <motion.button
          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setIsSettingsOpen(true);
          }}
          title="Настройки звука"
          className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-all active:scale-95 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
          }}
        >
          <Settings size={18} className="text-white" />
        </motion.button>

        {/* Кнопка Fullscreen */}
        <motion.button
          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            toggleFullscreen();
          }}
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-all active:scale-95 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
          }}
        >
          {isFullscreen ? <Minimize2 size={18} className="text-white" /> : <Maximize2 size={18} className="text-white" />}
        </motion.button>
      </div>

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

      {/* 4. ДИАЛОГОВОЕ ОБЛАЧКО СПАРКА (Ровное, точное, хвостик SVG, адаптивное) */}
      <SparkBubble
        message={SPARK_MENU_PHRASES[messageIndex]?.text || ''}
        layout={layout}
        onClick={handleBubbleClick}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showVoiceIcon={true}
      />

      {/* 5. КНОПКИ ВНИЗУ ЭКРАНА (Адаптивные отступы и размеры) */}
      <div className={buttonsConfig.containerClass}>
        {/* Кнопка 1: «Продолжить» (Без имени и монет, только текст и стрелка) */}
        {hasSave && (
          <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className={`${buttonsConfig.buttonWidth} ${buttonsConfig.buttonHeight} px-3 sm:px-5 rounded-full flex items-center justify-between text-white shadow-[0_8px_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer`}
            style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #C084FC 50%, #22D3EE 100%)',
            }}
          >
            <div className="flex items-center gap-1.5">
              {layout === 'mobile' && (
                <Play size={buttonsConfig.iconSize} className="text-white fill-white shrink-0" />
              )}
              <span className={`${buttonsConfig.buttonFont} tracking-wide`}>
                Продолжить
              </span>
            </div>
            {layout !== 'mobile' && (
              <ArrowRight size={buttonsConfig.iconSize} className="text-white shrink-0" />
            )}
          </motion.button>
        )}

        {/* Кнопка 2: «Новая студия» (Вторичная) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewStudio}
          className={`${buttonsConfig.buttonWidth} ${buttonsConfig.buttonHeight} rounded-full flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-[#A855F7] text-[#A855F7] bg-white/10 backdrop-blur-xs hover:bg-[#A855F7]/15 transition-colors shadow-sm cursor-pointer`}
        >
          <Plus size={buttonsConfig.iconSize} className="text-[#A855F7] stroke-[2.5]" />
          <span className={buttonsConfig.buttonFont}>
            Новая студия
          </span>
        </motion.button>

        {/* Кнопка 3: «Загрузить ключ от студии» (Третичная) */}
        <div className={`flex flex-col items-center ${buttonsConfig.buttonWidth}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              tryEnterFullscreen();
              fileInputRef.current?.click();
            }}
            className={`w-full ${buttonsConfig.buttonHeight} rounded-full flex items-center justify-center gap-1.5 sm:gap-2 border border-[#A855F7]/40 text-[#A855F7] bg-white/10 backdrop-blur-xs ${buttonsConfig.keyFont} hover:bg-[#A855F7]/15 transition-colors cursor-pointer`}
          >
            <Key size={buttonsConfig.iconSize} className="text-[#A855F7]" />
            <span>{buttonsConfig.keyButtonLabel}</span>
          </motion.button>
          {buttonsConfig.showKeySubtext && (
            <p className={`${buttonsConfig.subTextFont} ${buttonsConfig.subTextMargin} text-slate-600 font-medium tracking-normal text-center`}>
              Продолжить на другом устройстве
            </p>
          )}
        </div>
      </div>

      {/* МОДАЛКА НАСТРОЕК ЗВУКА */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default MainMenu;
