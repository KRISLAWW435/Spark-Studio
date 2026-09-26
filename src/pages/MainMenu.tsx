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
import {
  isFullscreenActive,
  requestFullscreen,
  toggleFullscreen as toggleFullscreenUtil,
} from '../utils/fullscreen';

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

  // Состояние fullscreen
  const [isFullscreen, setIsFullscreen] = useState(() => isFullscreenActive());

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Следим за изменением fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('mozfullscreenchange', handler);
    document.addEventListener('MSFullscreenChange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('mozfullscreenchange', handler);
      document.removeEventListener('MSFullscreenChange', handler);
    };
  }, []);

  // Функция переключения fullscreen с graceful fallback для iframe
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    sound.playClick();

    const isSupported =
      typeof document !== 'undefined' &&
      Boolean(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );

    if (!isSupported) {
      setToast({
        type: 'error',
        text: 'Полноэкранный режим заблокирован во фрейме. Откройте игру в новой вкладке ↗',
      });
      return;
    }

    try {
      toggleFullscreenUtil();
    } catch (err) {
      console.warn('Fullscreen error:', err);
      setToast({
        type: 'error',
        text: 'Не удалось включить полноэкранный режим. Откройте в новой вкладке ↗',
      });
    }
  };

  const tryEnterFullscreen = useCallback(() => {
    requestFullscreen();
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
      containerClass: 'absolute left-1/2 -translate-x-1/2 bottom-3 flex flex-col items-center gap-3 z-20 w-full px-4',
      buttonWidth: 'w-full max-w-[280px]',
      buttonHeight: 'min-h-[42px] h-[44px]',
      buttonFont: 'text-sm font-bold',
      keyFont: 'text-xs font-bold',
      iconSize: 16,
      subTextFont: 'text-[11px]',
      subTextMargin: 'mt-1',
      showKeySubtext: true,
      keyButtonLabel: 'Загрузить ключ от студии',
    },
    tablet: {
      containerClass: 'absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 w-full px-4',
      buttonWidth: 'w-full max-w-[340px]',
      buttonHeight: 'min-h-[48px] h-[52px]',
      buttonFont: 'text-base font-bold',
      keyFont: 'text-base font-bold',
      iconSize: 20,
      subTextFont: 'text-sm',
      subTextMargin: 'mt-2',
      showKeySubtext: true,
      keyButtonLabel: 'Загрузить ключ от студии',
    },
    desktop: {
      containerClass: 'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 w-full px-4',
      buttonWidth: 'w-full max-w-[380px]',
      buttonHeight: 'min-h-[52px] h-[58px]',
      buttonFont: 'text-lg font-bold',
      keyFont: 'text-lg font-bold',
      iconSize: 22,
      subTextFont: 'text-base',
      subTextMargin: 'mt-2.5',
      showKeySubtext: true,
      keyButtonLabel: 'Загрузить ключ от студии',
    },
  }[layout];

  return (
    <div
      onClick={tryEnterFullscreen}
      className="relative w-full h-screen overflow-hidden select-none pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-[max(12px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      {/* 1. ФОН — картинка со Спарком */}
      <img
        src={MENU_BG}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="Фон меню"
      />

      {/* ================= БАННЕР «ПОВЕРНИ УСТРОЙСТВО» ДЛЯ ПОРТРЕТА ================= */}
      {isPortrait && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
          <p className="text-white text-2xl text-center px-8 font-medium">
            Поверни устройство горизонтально 📱
          </p>
        </div>
      )}

      {/* 2. Лого — по центру сверху (увеличен на десктопе) */}
      <div className="absolute top-3 sm:top-5 md:top-6 left-1/2 -translate-x-1/2 z-30">
        <img
          src="/assets/logo.png"
          alt="Spark Studio"
          onError={(e) => {
            (e.target as HTMLImageElement).src = LOGO_URL;
          }}
          className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto drop-shadow-md object-contain"
        />
      </div>

      {/* 3. Кнопки управления — в ЛЕВЫЙ верхний угол (с комфортным отступом от края) */}
      <div className="absolute top-3.5 sm:top-5 md:top-6 left-6 sm:left-8 md:left-10 lg:left-12 z-30 flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setIsSettingsOpen(true);
          }}
          title="Настройки"
          className="
            w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12
            rounded-full
            bg-white/90 backdrop-blur-md
            border-2 border-[#A855F7]
            text-[#7E22CE]
            flex items-center justify-center
            shadow-lg shadow-purple-900/30
            hover:bg-white hover:scale-105
            active:scale-90
            transition-all
            cursor-pointer
          "
        >
          <Settings size={15} className="md:w-5 md:h-5" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          className="
            w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12
            rounded-full
            bg-white/90 backdrop-blur-md
            border-2 border-[#A855F7]
            text-[#7E22CE]
            flex items-center justify-center
            shadow-lg shadow-purple-900/30
            hover:bg-white hover:scale-105
            active:scale-90
            transition-all
            cursor-pointer
          "
        >
          {isFullscreen ? <Minimize2 size={15} className="md:w-5 md:h-5" /> : <Maximize2 size={15} className="md:w-5 md:h-5" />}
        </button>
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

      {/* 4. Бабл — справа, стрелочка направлена ВЛЕВО на Спарка, увеличен на десктопе */}
      <div
        onClick={handleBubbleClick}
        className="
          absolute z-20
          right-[3%] sm:right-[4%] md:right-[6%] lg:right-[7%]
          top-[14%] sm:top-[15%] md:top-[16%]
          w-auto
          max-w-[190px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[390px]
          bg-white/95 backdrop-blur-md
          p-3 sm:p-3.5 md:p-5
          rounded-2xl md:rounded-3xl
          border-2 md:border-3 border-[#A855F7]
          shadow-xl md:shadow-2xl shadow-purple-900/20
          cursor-pointer
          select-none
        "
      >
        <div className="flex items-center min-h-[22px] md:min-h-[36px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] sm:text-xs md:text-base lg:text-lg font-bold text-slate-800 leading-snug md:leading-normal pr-6 md:pr-8 break-words"
            >
              {SPARK_MENU_PHRASES[messageIndex]?.text || ''}
            </motion.p>
          </AnimatePresence>
        </div>
        {/* Хвостик/стрелочка — строго ВЛЕВО (в сторону Спарка) */}
        <div className="absolute -left-2 md:-left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-5 md:h-5 bg-white border-l-2 md:border-l-3 border-b-2 md:border-b-3 border-[#A855F7] rotate-45 pointer-events-none" />
        {/* Mute */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleMute(e);
          }}
          title={isMuted ? 'Включить озвучку' : 'Выключить озвучку'}
          className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-1 md:p-1.5 rounded-full text-slate-400 hover:text-purple-600 transition-colors z-20 cursor-pointer"
        >
          {isMuted ? <VolumeX size={13} className="md:w-5 md:h-5" /> : <Volume2 size={13} className="md:w-5 md:h-5" />}
        </button>
      </div>

      {/* 5. Кнопки меню — в ряд, приподняты выше, увеличены на десктопе, анимация при наведении */}
      <div className="
        absolute z-20
        bottom-[7%] sm:bottom-[7.5%] md:bottom-[8%] lg:bottom-[9%]
        left-1/2 -translate-x-1/2
        w-[94%] sm:w-[88%] md:w-auto
        max-w-none md:max-w-[960px] lg:max-w-[1060px]
        flex flex-row
        items-center justify-center
        gap-2 sm:gap-3 md:gap-4
      ">
        {!hasSave ? (
          <button
            type="button"
            onClick={handleNewStudio}
            className="
              flex-1 md:flex-initial md:min-w-[320px] lg:min-w-[360px]
              h-11 sm:h-12 md:h-14 lg:h-[60px]
              rounded-2xl md:rounded-3xl
              bg-gradient-to-r from-[#A855F7] to-[#06B6D4]
              text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase
              shadow-[0_4px_0_#6B21A8] md:shadow-[0_5px_0_#6B21A8]
              hover:scale-105
              active:scale-95 active:translate-y-0.5 active:shadow-[0_1px_0_#6B21A8]
              transition-all duration-200
              flex items-center justify-center gap-2
              cursor-pointer
            "
          >
            <Plus size={16} className="md:w-5 md:h-5" /> <span>Создать студию</span>
          </button>
        ) : (
          <>
            {/* 1. Продолжить */}
            <button
              type="button"
              onClick={handleContinue}
              className="
                flex-1 md:flex-initial md:min-w-[240px] lg:min-w-[270px]
                h-11 sm:h-12 md:h-14 lg:h-[60px]
                px-3 sm:px-4 md:px-6
                rounded-2xl md:rounded-3xl
                bg-gradient-to-r from-[#A855F7] to-[#06B6D4]
                text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase
                shadow-[0_4px_0_#6B21A8] md:shadow-[0_5px_0_#6B21A8]
                hover:scale-105
                active:scale-95 active:translate-y-0.5 active:shadow-[0_1px_0_#6B21A8]
                transition-all duration-200
                flex items-center justify-center gap-2
                cursor-pointer
              "
            >
              <Play size={16} className="fill-white md:w-5 md:h-5" /> <span>Продолжить</span>
            </button>

            {/* 2. Новая студия */}
            <button
              type="button"
              onClick={handleNewStudio}
              className="
                flex-1 md:flex-initial md:min-w-[200px] lg:min-w-[230px]
                h-11 sm:h-12 md:h-14 lg:h-[60px]
                px-3 sm:px-4 md:px-6
                rounded-2xl md:rounded-3xl
                bg-white
                text-[#7E22CE] font-bold text-xs sm:text-sm md:text-base lg:text-lg
                border-2 md:border-3 border-[#A855F7]
                shadow-[0_3px_0_#7E22CE] md:shadow-[0_4px_0_#7E22CE]
                hover:scale-105 hover:bg-purple-50/50
                active:scale-95 active:translate-y-0.5 active:shadow-[0_1px_0_#7E22CE]
                transition-all duration-200
                flex items-center justify-center gap-2
                cursor-pointer
              "
            >
              <span>+ Новая студия</span>
            </button>

            {/* 3. Загрузить ключ — БЕЛАЯ, с текстом внутри */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                tryEnterFullscreen();
                fileInputRef.current?.click();
              }}
              className="
                flex-1 md:flex-initial md:min-w-[220px] lg:min-w-[250px]
                h-11 sm:h-12 md:h-14 lg:h-[60px]
                px-2 sm:px-3 md:px-5
                rounded-2xl md:rounded-3xl
                bg-white
                border-2 md:border-3 border-[#22D3EE]
                shadow-[0_3px_0_#0891B2] md:shadow-[0_4px_0_#0891B2]
                hover:bg-cyan-50/70
                hover:scale-105
                active:scale-95 active:translate-y-0.5 active:shadow-[0_1px_0_#0891B2]
                transition-all duration-200
                flex flex-col items-center justify-center
                cursor-pointer
              "
            >
              <div className="flex items-center gap-1.5 leading-tight">
                <Key size={14} className="text-[#0891B2] shrink-0 md:w-4 md:h-4" />
                <span className="text-[#0891B2] font-bold text-xs sm:text-sm md:text-base lg:text-lg">Загрузить ключ</span>
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-[13px] text-[#0891B2]/80 font-medium leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                Продолжить на другом устройстве
              </span>
            </button>
          </>
        )}
      </div>

      {/* Модалка настроек */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default MainMenu;
