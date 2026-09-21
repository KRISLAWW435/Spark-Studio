// src/pages/Practice.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  Palette,
  Maximize2,
  Type,
  PartyPopper,
  Info,
  Tag
} from 'lucide-react';
import { Mascot } from '../components/mascot/Mascot';
import { SparkEmotionSprite } from '../components/mascot/SparkEmotionSprite';
import { MaxCharacter, MaxMood } from '../components/mascot/MaxCharacter';
import { MariaOrderModal } from '../components/order/MariaOrderModal';
import { FindProblem } from '../components/practice/FindProblem';
import { VictoryScreen } from '../components/practice/VictoryScreen';
import { TermDiscoveryModal } from '../components/ui/TermDiscoveryModal';
import { DESIGN_TERMS, DesignTerm } from '../data/terminology';
import { GlobalAudioControls } from '../components/ui/GlobalAudioControls';
import { ChoiceCard } from '../components/ui/ChoiceCard';
import { usePlayer } from '../context/PlayerContext';
import { sound } from '../utils/soundManager';
import { speech } from '../utils/speechManager';
import { SpeechButton } from '../components/ui/SpeechButton';
import { SkyBackground } from '../components/ui/SkyBackground';

// 6 шагов практики:
// 1: Поиск ошибок (Мини-детектив витрины)
// 2: Цвет кнопки
// 3: Размер кнопки
// 4: Текст кнопки
// 5: Тест покупки
// 6: Результат работы
type PracticeStep = 1 | 2 | 3 | 4 | 5 | 6;

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { player, userName, addCoins, addXp } = usePlayer();

  const [currentStep, setCurrentStep] = useState<PracticeStep>(1);

  // Дизайн-термины (Sprint 7)
  const [discoveredTerm, setDiscoveredTerm] = useState<DesignTerm | null>(null);
  const [isTermModalOpen, setIsTermModalOpen] = useState<boolean>(false);

  const handleOpenTerm = (termId: string) => {
    if (DESIGN_TERMS[termId]) {
      setDiscoveredTerm(DESIGN_TERMS[termId]);
      setIsTermModalOpen(true);
      sound.playSuccess();
    }
  };

  // Параметры кнопки витрины с сохранением в localStorage (B11)
  const [buttonColor, setButtonColor] = useState<string>(() => {
    return localStorage.getItem('spark_practice_btn_color') || '#10B981';
  });
  const [isColorConfirmed, setIsColorConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('spark_practice_color_confirmed') === 'true';
  });

  const [buttonSize, setButtonSize] = useState<number>(() => {
    const saved = localStorage.getItem('spark_practice_btn_size');
    return saved ? Number(saved) : 2; // 1 - компактный, 2 - стандартный, 3 - большой
  });
  const [isSizeConfirmed, setIsSizeConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('spark_practice_size_confirmed') === 'true';
  });

  const [buttonText, setButtonText] = useState<string>(() => {
    return localStorage.getItem('spark_practice_btn_text') || 'Купить игрушку!';
  });
  const [isTextConfirmed, setIsTextConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('spark_practice_text_confirmed') === 'true';
  });

  // Витрина: выбранная игрушка и корзина
  const [selectedToy, setSelectedToy] = useState<'bear' | 'car' | 'robot'>('bear');
  const [cartCount, setCartCount] = useState<number>(0);
  const [isToyBought, setIsToyBought] = useState<boolean>(false);
  const [hasTestedPurchase, setHasTestedPurchase] = useState<boolean>(false);

  // Конфетти и награда
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showRewardToast, setShowRewardToast] = useState<boolean>(false);

  // Модалка нового заказа Марии (Задача 3)
  const [showMariaModal, setShowMariaModal] = useState<boolean>(false);

  // При смене шага гарантируем, что игрушка не скрыта (B3)
  useEffect(() => {
    setIsToyBought(false);
  }, [currentStep]);

  // Определение настроения Макса
  const maxMood: MaxMood =
    currentStep === 1
      ? 'worried'
      : currentStep >= 2 && currentStep <= 4
      ? 'thinking'
      : currentStep === 5 && isToyBought
      ? 'excited'
      : currentStep === 6
      ? 'grateful'
      : 'thinking';

  // Реплики для Спарка и Макса на каждом шаге
  const stepSpeechTexts: Record<PracticeStep, string> = {
    1: 'Макс говорит: Покупатели заходят в магазин, смотрят на полки, но ничего не покупают! Помоги сделать кнопку такой, чтобы её хотелось нажать!',
    2: 'Серая кнопка теряется на витрине. Выбери сочный цвет, чтобы привлечь взгляд покупателя!',
    3: 'Отличный цвет! Теперь настрой размер кнопки, чтобы по ней было удобно нажимать.',
    4: 'Напиши понятный призыв к действию! Выбери вариант или введи свой текст для кнопки.',
    5: 'Кнопка создана! Нажми на неё в витрине магазина, чтобы протестировать покупку!',
    6: 'Макс говорит: Ура! Теперь у меня очередь из покупателей! Спасибо за отличную кнопку!'
  };

  useEffect(() => {
    if (speech.isAutoSpeak()) {
      speech.speak(stepSpeechTexts[currentStep]);
    }
  }, [currentStep]);

  // Палитра сочных цветов
  const colorPalette = [
    { name: 'Изумруд', value: '#10B981', border: '#059669' },
    { name: 'Мандарин', value: '#FF9600', border: '#D97706' },
    { name: 'Фиолетовый', value: '#8B5CF6', border: '#6D28D9' },
    { name: 'Коралл', value: '#F43F5E', border: '#E11D48' },
    { name: 'Лазурь', value: '#0EA5E9', border: '#0284C7' },
    { name: 'Солнечный', value: '#F59E0B', border: '#B45309' }
  ];

  // Варианты готового текста
  const textPresets = [
    'Купить игрушку!',
    'Хочу мишку! 🧸',
    'В корзину ✨',
    'Забрать подарок 🎁'
  ];

  // Обработчик выбора цвета (B11 persistence)
  const handleSelectColor = (val: string) => {
    sound.playClick();
    setButtonColor(val);
    setIsColorConfirmed(true);
    localStorage.setItem('spark_practice_btn_color', val);
    localStorage.setItem('spark_practice_color_confirmed', 'true');
  };

  // Обработчик выбора размера (B11 persistence)
  const handleSelectSize = (val: number) => {
    sound.playClick();
    setButtonSize(val);
    setIsSizeConfirmed(true);
    localStorage.setItem('spark_practice_btn_size', String(val));
    localStorage.setItem('spark_practice_size_confirmed', 'true');
  };

  // Обработчик выбора текста кнопки (B11 persistence)
  const handleSelectText = (val: string) => {
    sound.playClick();
    setButtonText(val);
    setIsTextConfirmed(true);
    localStorage.setItem('spark_practice_btn_text', val);
    localStorage.setItem('spark_practice_text_confirmed', 'true');
  };

  // Названия текущего стиля для чипа над витриной (B11)
  const currentColorObj = colorPalette.find((c) => c.value.toLowerCase() === buttonColor.toLowerCase());
  const activeColorName = currentColorObj ? currentColorObj.name : 'Изумруд';
  const activeSizeName = buttonSize === 1 ? 'Компакт' : buttonSize === 2 ? 'Стандарт' : 'Большой';

  // Обработчик покупки (клик по кнопке на Шаге 5 или 6)
  const handleExecutePurchase = () => {
    sound.playCelebration();
    setIsToyBought(true);
    setHasTestedPurchase(true);
    setCartCount((prev) => prev + 1);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 2500);

    setTimeout(() => {
      setIsToyBought(false);
    }, 1800);
  };

  // Обработчик перехода по шагам практики
  const handleProceedStep = () => {
    sound.playClick();

    if (currentStep === 1) {
      setCurrentStep(2);
      if (!localStorage.getItem('spark_practice_btn_color')) {
        setButtonColor('#10B981');
        setIsColorConfirmed(true);
        localStorage.setItem('spark_practice_btn_color', '#10B981');
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
      addCoins(5);
      addXp(10);
      setShowRewardToast(true);
      sound.playSuccess();
      setTimeout(() => setShowRewardToast(false), 3000);
    } else if (currentStep === 6) {
      setShowMariaModal(true);
    }
  };

  // Переход к следующему сюжетному заказу
  const handleAcceptMariaOrder = () => {
    setShowMariaModal(false);
    sound.playSuccess();
    navigate('/map');
  };

  return (
    <SkyBackground className="p-3 sm:p-5 flex flex-col justify-between overflow-x-hidden relative">
      {/* 1. Верхняя панель: Навигация, статус, монеты, звук */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-3 z-10 pb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Кнопка «Назад на карту» */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              navigate('/map');
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white hover:bg-slate-50 border-2 border-white/90 border-b-4 border-b-slate-300 text-slate-700 flex items-center justify-center shadow-md active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer"
            title="Вернуться на карту"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Название практики */}
          <div className="bg-white/95 backdrop-blur-xs px-3 sm:px-4 py-1.5 rounded-2xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-sm flex items-center gap-2">
            <span className="text-base sm:text-lg">🧸</span>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-[#17345F] leading-tight">
                Магазин игрушек Макса
              </h1>
              <span className="text-[10px] font-bold text-slate-500 block leading-none">
                Практика: Первая кнопка
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Индикатор прогресса шагов (B1: без текста «Шаг N из 6», только точки) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-sm">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={`dot-${s}`}
                  className={`h-2 rounded-full transition-all ${
                    s === currentStep
                      ? 'w-5 bg-[#FF9600]'
                      : s < currentStep
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Монеты */}
          <div className="flex items-center gap-1.5 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-sm">
            <span className="text-base sm:text-lg">💰</span>
            <span className="text-xs sm:text-base font-black text-[#17345F]">{player.coins}</span>
          </div>

          {/* Корзина покупок */}
          <div className="flex items-center gap-1.5 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-sm">
            <ShoppingCart size={16} className="text-[#E07A00]" />
            <span className="text-xs sm:text-base font-black text-[#17345F]">
              Куплено: {cartCount}
            </span>
          </div>

          {/* Глобальный звук (B7: единственный центр управления звуком) */}
          <GlobalAudioControls compact={true} />
        </div>
      </header>

      {/* Всплывающее уведомление о награде */}
      <AnimatePresence>
        {showRewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl border-2 border-white flex items-center gap-2.5"
          >
            <PartyPopper size={22} />
            <span>+5 монет & +10 XP! Отличный дизайн кнопки!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Анимация конфетти при покупке */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              initial={{
                top: '50%',
                left: `${40 + (i % 5) * 5}%`,
                scale: 0.5,
                opacity: 1
              }}
              animate={{
                top: `${20 + (i % 6) * 12}%`,
                left: `${15 + i * 3.5}%`,
                scale: [0.5, 1.2, 0.8],
                rotate: [0, 180, 360],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1.5 + (i % 4) * 0.3, ease: 'easeOut' }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: [
                  '#FF9600',
                  '#10B981',
                  '#8B5CF6',
                  '#F43F5E',
                  '#0EA5E9',
                  '#FDE047'
                ][i % 6]
              }}
            />
          ))}
        </div>
      )}

      {/* 2. Основная рабочая область: Рельса шагов (P1.3) + Содержимое задания (P1.2) */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col md:flex-row items-stretch gap-4 my-auto z-10 py-2">
        {/* Рельса шагов (B1 & P1.3: единый прогресс, возврат кликом, иконки 28px, подсказки) */}
        <nav
          aria-label="Этапы практики"
          className="flex md:flex-col justify-center items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-md shrink-0 self-center"
        >
          {[
            { step: 1, icon: '🔍', label: 'Ошибки', desc: 'Поиск ошибок' },
            { step: 2, icon: '🎨', label: 'Цвет', desc: 'Цвет кнопки' },
            { step: 3, icon: '📐', label: 'Размер', desc: 'Размер кнопки' },
            { step: 4, icon: '✍️', label: 'Текст', desc: 'Текст кнопки' },
            { step: 5, icon: '🛍️', label: 'Тест', desc: 'Тест покупки' },
            { step: 6, icon: '🎉', label: 'Финал', desc: 'Результат работы' }
          ].map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            return (
              <button
                key={s.step}
                type="button"
                disabled={s.step > currentStep}
                onClick={() => {
                  if (s.step < currentStep) {
                    sound.playClick();
                    setCurrentStep(s.step as PracticeStep);
                  }
                }}
                title={`${s.desc}${isCompleted ? ' (нажми, чтобы изменить выбор)' : ''}`}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex flex-col items-center justify-center font-black transition-all select-none ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-[#FF9600] to-[#E96820] text-white shadow-md ring-4 ring-[#FF9600]/30 scale-105 z-10'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer border-2 border-emerald-300 hover:scale-102'
                    : 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed border border-slate-200'
                }`}
              >
                <span className="text-base sm:text-lg leading-none">
                  {isCompleted ? '✓' : s.icon}
                </span>
                <span className="text-[9px] sm:text-[10px] font-black mt-0.5 leading-none">
                  {s.step}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Интерактивное тело: либо Шаг 1 (Мини-игра FindProblem), либо Шаги 2-5 (Панель + Витрина), либо Шаг 6 (Экран Победы) */}
        {currentStep === 1 ? (
          <div className="flex-1 w-full flex items-center justify-center">
            <FindProblem
              onComplete={() => {
                handleProceedStep();
              }}
              onDiscoverTerm={handleOpenTerm}
            />
          </div>
        ) : currentStep === 6 ? (
          <div className="flex-1 w-full flex items-center justify-center">
            <VictoryScreen
              userName={userName}
              buttonColor={buttonColor}
              buttonSize={buttonSize}
              buttonText={buttonText}
              onNextOrder={() => setShowMariaModal(true)}
              onRetest={() => setCurrentStep(5)}
              onMap={() => navigate('/map')}
            />
          </div>
        ) : (
          <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Левая колонка: Панель текущего задания (P1.2: вертикально сбалансирована, "Почему это важно", кнопка действия) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3.5 my-auto">
                {/* Заголовок этапа (B1: без «ШАГ N», только понятное название действия) */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h2 className="text-sm sm:text-base font-black uppercase text-[#17345F] tracking-wide flex items-center gap-2">
                    <span className="text-lg">
                      {currentStep === 2 && '🎨'}
                      {currentStep === 3 && '📐'}
                      {currentStep === 4 && '✍️'}
                      {currentStep === 5 && '🛍️'}
                      {currentStep === 6 && '🎉'}
                    </span>
                    <span>
                      {currentStep === 2 && 'Цвет кнопки'}
                      {currentStep === 3 && 'Размер кнопки'}
                      {currentStep === 4 && 'Текст кнопки'}
                      {currentStep === 5 && 'Тест покупки'}
                      {currentStep === 6 && 'Результат работы'}
                    </span>
                  </h2>

                  <SpeechButton text={stepSpeechTexts[currentStep]} size={16} />
                </div>

                {/* Контент шага 2: Цвет */}
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      Выбери яркий сочный цвет из палитры. Кнопка в витрине обновится моментально:
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {colorPalette.map((col) => (
                        <button
                          key={col.value}
                          type="button"
                          onClick={() => handleSelectColor(col.value)}
                          style={{ backgroundColor: col.value }}
                          className={`h-12 sm:h-13 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs border-2 transition-transform active:scale-95 shadow-xs cursor-pointer ${
                            buttonColor.toLowerCase() === col.value.toLowerCase()
                              ? 'ring-4 ring-[#17345F] scale-105 border-white'
                              : 'border-black/10 hover:scale-[1.02]'
                          }`}
                        >
                          {buttonColor.toLowerCase() === col.value.toLowerCase() && (
                            <Check size={18} strokeWidth={3.5} />
                          )}
                          <span className="drop-shadow-xs text-[11px] font-bold">{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Контент шага 3: Размер (B8 & P1.1: используется единый ChoiceCard) */}
                {currentStep === 3 && (
                  <div className="space-y-2.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      По маленькой кнопке трудно попасть пальцем. Настрой удобный размер:
                    </p>

                    <div className="space-y-2">
                      {[
                        { id: 1, label: 'Компактный', desc: 'Для небольших мобильных экранов' },
                        {
                          id: 2,
                          label: 'Стандартный',
                          desc: 'Самый удобный и сбалансированный',
                          badge: 'Рекомендуем'
                        },
                        { id: 3, label: 'Большой', desc: 'Максимально заметный для покупателя' }
                      ].map((s) => (
                        <ChoiceCard
                          key={s.id}
                          selected={buttonSize === s.id}
                          label={s.label}
                          description={s.desc}
                          badge={s.badge}
                          onClick={() => handleSelectSize(s.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Контент шага 4: Текст кнопки (P1.1: используется ChoiceCard) */}
                {currentStep === 4 && (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      Текст должен объяснять действие! Выбери готовый вариант или введи свой:
                    </p>

                    {/* Поле свободного ввода */}
                    <div className="relative">
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => {
                          setButtonText(e.target.value);
                          setIsTextConfirmed(true);
                          localStorage.setItem('spark_practice_btn_text', e.target.value);
                        }}
                        placeholder="Напиши текст кнопки..."
                        maxLength={25}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-[#17345F] focus:bg-white focus:border-[#FF9600] outline-hidden shadow-inner"
                      />
                      <Type size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                    </div>

                    {/* Готовые пресеты текстов через ChoiceCard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {textPresets.map((preset) => (
                        <ChoiceCard
                          key={preset}
                          selected={buttonText === preset}
                          label={preset}
                          onClick={() => handleSelectText(preset)}
                          className="p-3"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Контент шага 5: Тестирование покупки */}
                {currentStep === 5 && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-purple-50 rounded-2xl border-2 border-purple-200 text-purple-950 text-xs sm:text-sm font-semibold leading-relaxed">
                      «Отличная кнопка получилась! Теперь нажми на неё прямо в окне витрины справа, чтобы проверить покупку!»
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-600 shrink-0" />
                      <span>
                        {hasTestedPurchase
                          ? 'Покупка успешно совершена! Можно переходить к финалу.'
                          : 'Нажми на созданную кнопку в витрине!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Контент шага 6: Благодарность */}
                {currentStep === 6 && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold leading-relaxed">
                      «Ура! Благодаря твоей яркой и удобной кнопке покупатели с удовольствием заказывают игрушки! Ты настоящий мастер интерфейсов. Задание успешно выполнено!»
                    </div>

                    <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-between text-xs font-black text-slate-700">
                      <span>Награда за работу:</span>
                      <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                        💰 +5 монет • 🌟 +10 XP
                      </span>
                    </div>
                  </div>
                )}

                {/* Блок «Почему это важно» (P1.2) */}
                <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 text-sky-950 flex items-start gap-2.5">
                  <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] sm:text-xs font-semibold leading-snug">
                    <strong className="font-bold text-sky-900 block">Почему это важно:</strong>
                    {currentStep === 2 &&
                      'Контрастный цвет сразу направляет взгляд пользователя на целевое действие, а блеклый серый сливается с окружением.'}
                    {currentStep === 3 &&
                      'Кнопка должна быть не менее 44px, чтобы по ней было легко попасть пальцем на телефоне или планшете без промахов.'}
                    {currentStep === 4 &&
                      'Чёткий глагол в тексте объясняет результат нажатия и избавляет пользователя от страха ошибиться.'}
                    {currentStep === 5 &&
                      'Тестирование интерфейса позволяет дизайнеру убедиться, что отклик кнопки плавный, а покупка приносит радость.'}
                    {currentStep === 6 &&
                      'Удобные интерфейсы делают жизнь людей проще и помогают магазинам развиваться!'}
                  </div>
                </div>
              </div>

              {/* Кнопка перехода к следующему шагу (B4: whitespace-nowrap для предотвращения переноса эмодзи) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedStep}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] hover:from-[#E96820] hover:to-[#CC7700] text-white font-black text-sm sm:text-base uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>
                    {currentStep === 2 && 'Дальше к размеру →'}
                    {currentStep === 3 && 'Дальше к тексту →'}
                    {currentStep === 4 && 'Протестировать кнопку! 🎯'}
                    {currentStep === 5 && (hasTestedPurchase ? 'Посмотреть результат →' : 'Перейти к итогу →')}
                    {currentStep === 6 && 'Новый заказ: Кондитерская 🧁'}
                  </span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Правая колонка: Витрина магазина игрушек (P1.2: полка-подиум, ценник, бейдж, покупатели, чип стиля B11) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden">
              {/* Фоновые декоративные гирлянды витрины */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-200 via-rose-200 to-sky-200 opacity-60 pointer-events-none" />

              {/* Верхняя плашка витрины: название магазина и переключатель игрушек */}
              <div className="w-full flex items-center justify-between mb-2 border-b border-slate-100 pb-2.5">
                <span className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏪</span>
                  <span>Витрина: «Мир Игрушек Макса»</span>
                </span>

                <div className="flex gap-1.5">
                  {[
                    { id: 'bear', icon: '🧸', label: 'Мишка' },
                    { id: 'car', icon: '🏎️', label: 'Машинка' },
                    { id: 'robot', icon: '🤖', label: 'Робот' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedToy(t.id as any);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                        selectedToy === t.id
                          ? 'bg-amber-100 border-amber-300 text-amber-900 scale-105 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {t.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Чип текущего стиля над витриной (B11: подтверждение сохранения цвета и параметров) */}
              <div className="w-full flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100/90 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 shadow-2xs">
                  <span className="text-slate-400">Текущий стиль:</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full border border-white shadow-2xs inline-block"
                      style={{ backgroundColor: buttonColor }}
                    />
                    <span className="font-black text-slate-800">{activeColorName}</span>
                  </div>
                  <span>·</span>
                  <span>Размер: <strong className="text-slate-800">{activeSizeName}</strong></span>
                  <span>·</span>
                  <span>Текст: <strong className="text-slate-800 truncate max-w-[120px]">«{buttonText}»</strong></span>
                </div>
              </div>

              {/* Центральная часть витрины: Сцена с полкой/подиумом, ценником, наличием и покупателями (P1.2 & B3) */}
              <div className="relative my-auto flex flex-col items-center py-3 w-full">
                {/* Анимированные покупатели-агенты у витрины (P1.2) */}
                <div className="w-full flex items-center justify-between px-4 mb-2">
                  {/* Покупатель 1 */}
                  <motion.div
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-1.5 bg-white/90 backdrop-blur-2xs px-2.5 py-1 rounded-2xl border border-slate-200 shadow-2xs"
                  >
                    <span className="text-lg select-none">👧</span>
                    <span className="text-[10px] font-black text-slate-700">
                      {currentStep >= 4 ? '«Всё понятно! ✨»' : '«Где кнопка? 🤔»'}
                    </span>
                  </motion.div>

                  {/* Покупатель 2 */}
                  <motion.div
                    animate={{ x: [5, -5, 5] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-1.5 bg-white/90 backdrop-blur-2xs px-2.5 py-1 rounded-2xl border border-slate-200 shadow-2xs"
                  >
                    <span className="text-[10px] font-black text-slate-700">
                      {cartCount > 0 ? '«Я тоже беру! 🛍️»' : '«Хочу эту игрушку! 👀»'}
                    </span>
                    <span className="text-lg select-none">👦</span>
                  </motion.div>
                </div>

                {/* Товар на витрине: гарантированная видимость на шаге 6 с fallback (B3) */}
                <motion.div
                  animate={
                    isToyBought
                      ? { scale: [1, 1.25, 0.4], y: [0, -40, -120], opacity: [1, 1, 0] }
                      : { scale: [1, 1.04, 1], y: [0, -6, 0], opacity: 1 }
                  }
                  transition={{
                    duration: isToyBought ? 0.9 : 3,
                    repeat: isToyBought ? 0 : Infinity,
                    ease: 'easeInOut'
                  }}
                  className="text-8xl sm:text-9xl select-none filter drop-shadow-xl z-10"
                >
                  {selectedToy === 'bear' ? '🧸' : selectedToy === 'car' ? '🏎️' : '🤖'}
                </motion.div>

                {/* Стилизованный деревянный подиум/полка под товаром (P1.2) */}
                <div className="w-52 h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-xl shadow-md border-b-2 border-amber-950 flex items-center justify-center -mt-2">
                  <div className="w-44 h-1 bg-amber-500/40 rounded-full" />
                </div>

                {/* Ценник и бейдж наличия (P1.2) */}
                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-2xs">
                    <Tag size={12} className="text-amber-700" />
                    <span>150 💰</span>
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    ✨ В наличии на полке
                  </span>
                </div>
              </div>

              {/* Интерактивная живая кнопка в витрине */}
              <div className="w-full flex flex-col items-center mt-3 pt-3 border-t-2 border-slate-100">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (currentStep === 5 || currentStep === 6) {
                      handleExecutePurchase();
                    } else {
                      sound.playClick();
                    }
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    backgroundColor: buttonColor,
                    padding:
                      buttonSize === 1
                        ? '10px 24px'
                        : buttonSize === 2
                        ? '14px 38px'
                        : '18px 52px',
                    fontSize: buttonSize === 1 ? '14px' : buttonSize === 2 ? '17px' : '20px'
                  }}
                  className={`rounded-2xl text-white font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg border-2 border-white/60 border-b-4 border-b-black/30 cursor-pointer active:border-b-2 active:translate-y-1 ${
                    currentStep === 5 ? 'animate-bounce ring-4 ring-purple-300 ring-offset-2' : ''
                  }`}
                >
                  <ShoppingCart size={buttonSize === 1 ? 16 : buttonSize === 2 ? 20 : 24} />
                  <span>{buttonText || 'Купить игрушку!'}</span>
                  {isToyBought && <span>🎉</span>}
                </motion.button>

                <span className="text-xs font-bold text-slate-500 mt-2 text-center">
                  {currentStep === 2 && '✨ Цвет обновлён! Оцени, как кнопка выделилась на витрине'}
                  {currentStep === 3 && '📐 Размер обновлён! Кнопка стала удобнее для нажатия'}
                  {currentStep === 4 && '✍️ Текст обновлён! Призыв к действию понятен покупателю'}
                  {currentStep === 5 && '🎯 Нажми на кнопку прямо сейчас, чтобы совершить покупку!'}
                  {currentStep === 6 && '🏆 Кнопка работает идеально — покупатели довольны!'}
                </span>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* 3. Футер с персонажами: Макс слева, реплика по центру, Спарк справа (P1.2) */}
      {currentStep < 6 && (
        <footer className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4 pb-1 z-10">
          <div className="flex items-center gap-4">
            {/* Персонаж Макс с эмоциями */}
            <div className="relative">
              <MaxCharacter mood={maxMood} size={70} />
            </div>

            {/* Диалоговый баббл Макса и Спарка */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-4 py-2.5 border-2 border-white/90 border-b-4 border-b-slate-300 shadow-md text-xs sm:text-sm font-bold text-[#17345F] max-w-xl">
              {currentStep === 1 && (
                <span>
                  <strong className="text-sky-700">Макс:</strong> «Помоги настроить кнопку так, чтобы она привлекала покупателей!»
                </span>
              )}
              {currentStep === 2 && (
                <span>
                  <strong className="text-emerald-700">Макс:</strong> «Ого, какой яркий цвет! Теперь кнопку сразу видно на полке!»
                </span>
              )}
              {currentStep === 3 && (
                <span>
                  <strong className="text-purple-700">Макс:</strong> «Отличный размер! Теперь по ней удобно нажимать даже с телефона!»
                </span>
              )}
              {currentStep === 4 && (
                <span>
                  <strong className="text-amber-700">Макс:</strong> «С таким текстом сразу понятно, что получит покупатель!»
                </span>
              )}
              {currentStep === 5 && (
                <span>
                  <strong className="text-indigo-700">Спарк:</strong> «Кнопка создана! Нажми на неё в витрине магазина для проверки!»
                </span>
              )}
            </div>
          </div>

          {/* Талисман Спарк */}
          <div className="hidden sm:flex items-center gap-2">
            <SparkEmotionSprite
              emotion={currentStep === 1 ? 'thinking' : currentStep >= 5 ? 'happy' : 'excited'}
              size={70}
            />
          </div>
        </footer>
      )}

      {/* 4. Модальное окно нового сюжетного заказа Марии */}
      <MariaOrderModal
        isOpen={showMariaModal}
        userName={userName}
        onAccept={handleAcceptMariaOrder}
      />

      {/* 5. Модальное окно открытия нового дизайн-термина (Sprint 7) */}
      <TermDiscoveryModal
        term={discoveredTerm}
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
      />
    </SkyBackground>
  );
};

export default Practice;
