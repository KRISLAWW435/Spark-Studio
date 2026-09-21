// src/pages/Intro.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { Mascot, MascotMood } from '../components/mascot/Mascot';
import { SparkEmotionSprite } from '../components/mascot/SparkEmotionSprite';
import { sound } from '../utils/soundManager';
import { speech } from '../utils/speechManager';
import { SpeechButton } from '../components/ui/SpeechButton';
import { GlobalAudioControls } from '../components/ui/GlobalAudioControls';
import { SkyBackground } from '../components/ui/SkyBackground';
import { ProfessionModal, PROFESSIONS_DATA, ProfessionInfo } from '../components/ui/ProfessionModal';
import { SparkBirth } from '../components/intro/SparkBirth';

type IntroStage = 'spark' | 'slides';

interface SlideItem {
  title: string;
  sparkMood: MascotMood;
  subtitle?: string;
  speechText: string;
  buttonText?: string;
}

export const Intro: React.FC = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState<IntroStage>('spark');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [flippedCardIds, setFlippedCardIds] = useState<Set<string>>(new Set());

  const toggleCardFlip = (id: string, replica: string) => {
    sound.playClick();
    const next = new Set(flippedCardIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      if (speech.isAutoSpeak()) {
        speech.speak(replica);
      }
    }
    setFlippedCardIds(next);
  };

  // Состояние модалки профессии
  const [selectedProfession, setSelectedProfession] = useState<ProfessionInfo | null>(null);
  const [isProfessionModalOpen, setIsProfessionModalOpen] = useState<boolean>(false);

  const handleOpenProfession = (id: 'web' | 'gamedev' | 'graphic' | 'uiux') => {
    sound.playClick();
    setSelectedProfession(PROFESSIONS_DATA[id]);
    setIsProfessionModalOpen(true);
  };

  // Озвучка при смене слайда
  useEffect(() => {
    if (speech.isAutoSpeak()) {
      if (stage === 'slides') {
        speech.speak(slides[slideIndex].speechText);
      }
    }
  }, [stage, slideIndex]);

  // Слайд 2: 6 карточек
  const slide2Cards = [
    {
      id: 'minecraft',
      title: 'Minecraft (Стив)',
      tag: 'Персонаж',
      replica: 'Ты играл в Minecraft? Персонажа Стива придумал дизайнер!',
      color: 'bg-emerald-50 border-emerald-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          {/* Пиксельная голова Стива */}
          <rect x="15" y="15" width="30" height="30" fill="#B48259" rx="2" />
          <rect x="15" y="15" width="30" height="10" fill="#3A2312" />
          <rect x="15" y="25" width="5" height="5" fill="#3A2312" />
          <rect x="40" y="25" width="5" height="5" fill="#3A2312" />
          <rect x="20" y="28" width="5" height="3" fill="#FFFFFF" />
          <rect x="23" y="28" width="2" height="3" fill="#2563EB" />
          <rect x="35" y="28" width="5" height="3" fill="#FFFFFF" />
          <rect x="35" y="28" width="2" height="3" fill="#2563EB" />
          <rect x="27" y="32" width="6" height="4" fill="#935B38" />
          <rect x="25" y="37" width="10" height="3" fill="#4A2810" />
        </svg>
      )
    },
    {
      id: 'roblox',
      title: 'Roblox (Аватар)',
      tag: 'Скины и миры',
      replica: 'А Roblox? Каждый скин, каждая аватарка — работа дизайнера.',
      color: 'bg-red-50 border-red-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <rect x="18" y="14" width="24" height="24" fill="#E2E8F0" rx="4" stroke="#0F172A" strokeWidth="2" />
          <circle cx="25" cy="24" r="2.5" fill="#0F172A" />
          <circle cx="35" cy="24" r="2.5" fill="#0F172A" />
          <path d="M 24 30 Q 30 35 36 30" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="14" y="39" width="32" height="14" rx="3" fill="#EF4444" />
        </svg>
      )
    },
    {
      id: 'tshirt',
      title: 'Футболка с принтом',
      tag: 'Одежда и мерч',
      replica: 'Одежда, которую ты носишь? Кто-то придумал принт, крой, цвет.',
      color: 'bg-amber-50 border-amber-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <path d="M 22 15 L 12 24 L 18 30 L 22 26 L 22 46 L 38 46 L 38 26 L 42 30 L 48 24 L 38 15 C 34 20, 26 20, 22 15 Z" fill="#F59E0B" />
          <polygon points="30,26 32,30 36,31 33,34 34,38 30,36 26,38 27,34 24,31 28,30" fill="#FEF08A" />
        </svg>
      )
    },
    {
      id: 'toyshop',
      title: 'Магазин игрушек',
      tag: 'Витрины и бренд',
      replica: 'Магазин игрушек, куда ты ходишь? Витрину, логотип, плакаты — дизайнер.',
      color: 'bg-purple-50 border-purple-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <rect x="12" y="14" width="36" height="14" rx="3" fill="#8B5CF6" />
          <text x="30" y="24" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">TOYS</text>
          <rect x="10" y="30" width="40" height="4" fill="#D97706" rx="1" />
          <circle cx="22" cy="40" r="7" fill="#F472B6" />
          <circle cx="38" cy="41" r="6" fill="#38BDF8" />
          <rect x="10" y="48" width="40" height="4" fill="#D97706" rx="1" />
        </svg>
      )
    },
    {
      id: 'laptop',
      title: 'Компьютер / Телефон',
      tag: 'Гаджеты и девайсы',
      replica: 'Компьютер или телефон, на котором ты сидишь? Его форму и кнопки придумал дизайнер.',
      color: 'bg-sky-50 border-sky-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <rect x="15" y="16" width="30" height="20" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <rect x="18" y="19" width="24" height="14" rx="1" fill="#E0F2FE" />
          <path d="M 10 38 L 50 38 L 46 44 L 14 44 Z" fill="#94A3B8" />
        </svg>
      )
    },
    {
      id: 'game_site',
      title: 'Сайт или игра',
      tag: 'Интерфейсы',
      replica: 'И даже сайт, на котором ты сейчас играешь, — его тоже сделал дизайнер!',
      color: 'bg-orange-50 border-orange-300',
      icon: (
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <rect x="12" y="14" width="36" height="28" rx="4" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
          <rect x="12" y="14" width="36" height="8" rx="2" fill="#EA580C" />
          <circle cx="17" cy="18" r="1.5" fill="#FED7AA" />
          <circle cx="22" cy="18" r="1.5" fill="#FED7AA" />
          <circle cx="27" cy="18" r="1.5" fill="#FED7AA" />
          <rect x="16" y="26" width="14" height="6" rx="2" fill="#F97316" />
          <rect x="16" y="34" width="28" height="3" rx="1" fill="#E2E8F0" />
        </svg>
      )
    }
  ];

  // Слайды для Этапа 2
  const slides: SlideItem[] = [
    {
      title: 'Кто такие дизайнеры?',
      subtitle: 'А ты знаешь, кто такие дизайнеры? Давай расскажу!',
      speechText: 'А ты знаешь, кто такие дизайнеры? Это не просто художники! Дизайнеры придумывают всё, чем мы пользуемся каждый день: от персонажей игр до кнопок в телефоне. Давай покажу!',
      sparkMood: 'thinking',
      buttonText: 'Давай! →'
    },
    {
      title: 'Ты видишь работу дизайнеров каждый день!',
      subtitle: 'Всё, что ты видишь и любишь — это работа дизайнеров!',
      speechText: 'Ты видишь работу дизайнеров каждый день! Нажимай на карточки, чтобы узнать секрет.',
      sparkMood: 'happy',
      buttonText: 'Дальше →'
    },
    {
      title: 'Дизайн окружает тебя везде',
      subtitle: 'Куда бы ты ни посмотрел — кто-то подумал о форме, цвете и удобстве',
      speechText: 'Дизайн окружает тебя везде: стаканчик сока, смартфон, геймпад и любимая книга!',
      sparkMood: 'pointing',
      buttonText: 'Дальше →'
    },
    {
      title: 'Профессии в дизайне',
      subtitle: 'Дизайнеры бывают разными. Каждый создаёт что-то своё!',
      speechText: 'Профессии в дизайне! Веб-дизайнер, геймдизайнер, графический дизайнер и UI UX дизайнер. Нажми на карточку, чтобы узнать подробнее.',
      sparkMood: 'thinking',
      buttonText: 'Дальше →'
    },
    {
      title: 'Ты тоже можешь стать дизайнером!',
      subtitle: 'Пора открыть собственную дизайн-студию и отправиться в мир дизайна!',
      speechText: 'И ты тоже можешь стать дизайнером! Для этого не нужно быть академическим художником. Главное — понимать, как сделать вещь удобной и приятной для людей!',
      sparkMood: 'happy',
      buttonText: 'Создать студию! 🚀'
    }
  ];

  const handleNextSlide = () => {
    sound.playClick();
    speech.stop();
    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      sound.playSuccess();
      navigate('/studio');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans bg-[#17345F] text-white">
      {/* Кнопка «Назад в меню» для режима слайдов (в SparkBirth встроена своя верхняя панель) */}
      {stage === 'slides' && (
        <div className="absolute top-5 left-5 z-30">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              speech.stop();
              navigate('/');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Меню</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ЭТАП: РОЖДЕНИЕ СПАРКА (8-кадровый сценарий с анимацией и озвучкой)        */}
      {/* ========================================================================= */}
      {stage === 'spark' && (
        <SparkBirth
          onComplete={() => {
            sound.playSuccess();
            speech.stop();
            setStage('slides');
          }}
          onSkip={() => {
            speech.stop();
            setStage('slides');
          }}
          onBackToMenu={() => {
            speech.stop();
            navigate('/');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* ЭТАП 2: СЛАЙД-ШОУ «ЧТО ТАКОЕ ДИЗАЙН?» (5 Слайдов, чистый фон)              */}
      {/* ========================================================================= */}
      {stage === 'slides' && (
        <SkyBackground className="p-4 sm:p-6 text-[#17345F]">
          {/* Индикатор прогресса слайдов в Duolingo-стиле + Глобальный звук */}
          <header className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 pt-2 sm:pt-4 z-10 mb-2">
            <div className="flex-1 flex items-center gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-full transition-all duration-300 border-2 ${
                    i <= slideIndex
                      ? 'bg-[#FF9600] border-[#D97706] shadow-sm'
                      : 'bg-white/40 border-white/60'
                  }`}
                />
              ))}
            </div>
            <GlobalAudioControls compact={true} />
          </header>

          {/* Центральный контент слайда в увеличенной белой карточке */}
          <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col items-center justify-center my-auto py-2 z-10">
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-white/90 border-b-8 border-b-sky-700/20 text-[#17345F] flex flex-col items-center justify-center relative">
              {/* Кнопка озвучки в правом верхнем углу карточки */}
              <div className="absolute top-4 right-5 z-20">
                <SpeechButton text={slides[slideIndex].speechText} size={18} label="Озвучить" />
              </div>

              <AnimatePresence mode="wait">
                {/* СЛАЙД 1: Вопрос (Спарк рядом с текстом: 300x360px) */}
                {slideIndex === 0 && (
                  <motion.div
                    key="slide-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center max-w-2xl w-full"
                  >
                    <div
                      className="relative mb-4 cursor-pointer"
                      onClick={() => speech.speak(slides[0].speechText)}
                      title="Нажми на Спарка, чтобы услышать вопрос"
                    >
                      <Mascot mood="thinking" size={300} />
                      <motion.div
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 right-4 text-5xl"
                      >
                        ❓
                      </motion.div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-3">
                      А ты знаешь, кто такие дизайнеры?
                    </h2>
                    <p className="text-lg sm:text-xl font-bold text-slate-600 leading-relaxed">
                      Это не просто художники! Дизайнеры придумывают всё, чем мы пользуемся каждый день: от персонажей любимых игр до удобных кнопок в телефоне. Давай покажу!
                    </p>
                  </motion.div>
                )}

                {/* СЛАЙД 2: «Ты видишь работу дизайнеров каждый день!» (ЗАДАЧА 7: ТОЧНЫЕ ОТСТУПЫ И РАЗМЕРЫ) */}
                {slideIndex === 1 && (
                  <motion.div
                    key="slide-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Заголовок -> mb-4 -> Подзаголовок -> mb-6 -> Карточки */}
                    <div className="text-center w-full">
                      <h2 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-3">
                        Ты видишь работу дизайнеров каждый день!
                      </h2>
                      <p className="text-sm sm:text-base font-black text-[#B45309] uppercase tracking-wider mb-6">
                        Нажимай на карточки, чтобы перевернуть их и узнать секрет:
                      </p>
                    </div>

                    {/* Сетка переворотных карточек (3D-флип эффект на клик) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
                      {slide2Cards.map((card) => {
                        const isFlipped = flippedCardIds.has(card.id);
                        return (
                          <motion.div
                            key={card.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCardFlip(card.id, card.replica)}
                            className={`min-h-[200px] sm:min-h-[220px] p-4.5 rounded-3xl border-2 border-b-4 transition-all cursor-pointer shadow-xs flex flex-col items-center justify-center text-center select-none ${
                              card.color
                            } ${
                              isFlipped
                                ? 'ring-4 ring-[#FF9600] border-b-[#D97706] bg-amber-50/95'
                                : 'border-[#E5D5BA] border-b-[#D4C3A3] hover:shadow-md'
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {isFlipped ? (
                                <motion.div
                                  key="back"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col items-center justify-between h-full w-full py-1"
                                >
                                  <div className="flex items-center gap-1 text-[11px] font-black text-[#B45309] uppercase tracking-wider">
                                    <Sparkles size={13} className="text-[#B45309]" />
                                    <span>Секрет дизайнера:</span>
                                  </div>
                                  <p className="text-xs sm:text-sm font-black text-[#17345F] leading-snug my-2">
                                    {card.replica}
                                  </p>
                                  <div className="flex items-center justify-between w-full pt-1.5 border-t border-amber-200/80 text-[10px] font-bold text-slate-500">
                                    <span>Скрыть ↩</span>
                                    <SpeechButton text={card.replica} size={14} />
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="front"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col items-center justify-center"
                                >
                                  <div className="mb-2">{card.icon}</div>
                                  <div className="text-base sm:text-lg font-bold text-[#17345F] leading-tight mb-1">
                                    {card.title}
                                  </div>
                                  <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                                    {card.tag}
                                  </div>
                                  <span className="text-[11px] font-black text-[#B45309] bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
                                    Нажми узнать секрет 👆
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* СЛАЙД 3: «Дизайн вокруг нас» */}
                {slideIndex === 2 && (
                  <motion.div
                    key="slide-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center max-w-3xl w-full"
                  >
                    <h2 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-3">
                      Дизайн окружает тебя везде
                    </h2>
                    <p className="text-base sm:text-lg font-bold text-slate-600 mb-8">
                      Куда бы ты ни посмотрел — кто-то подумал о форме, цвете и удобстве
                    </p>

                    <div className="grid grid-cols-2 gap-5 w-full mb-2">
                      <div className="p-6 rounded-3xl bg-[#FFF9EA] border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] shadow-xs flex flex-col items-center">
                        <span className="text-5xl mb-3">🥤</span>
                        <span className="font-black text-lg text-[#17345F]">Стаканчик сока</span>
                        <span className="text-sm text-[#475569] font-bold mt-1">Логотип и форма</span>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FFF9EA] border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] shadow-xs flex flex-col items-center">
                        <span className="text-5xl mb-3">📱</span>
                        <span className="font-black text-lg text-[#17345F]">Смартфон</span>
                        <span className="text-sm text-[#475569] font-bold mt-1">Иконки и свайпы</span>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FFF9EA] border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] shadow-xs flex flex-col items-center">
                        <span className="text-5xl mb-3">🎮</span>
                        <span className="font-black text-lg text-[#17345F]">Геймпад</span>
                        <span className="text-sm text-[#475569] font-bold mt-1">Удобные кнопки</span>
                      </div>
                      <div className="p-6 rounded-3xl bg-[#FFF9EA] border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] shadow-xs flex flex-col items-center">
                        <span className="text-5xl mb-3">📚</span>
                        <span className="font-black text-lg text-[#17345F]">Любимая книга</span>
                        <span className="text-sm text-[#475569] font-bold mt-1">Обложка и шрифт</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* СЛАЙД 4: «Разные дизайнеры» */}
                {slideIndex === 3 && (
                  <motion.div
                    key="slide-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center max-w-3xl w-full"
                  >
                    <h2 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-3">
                      Профессии в дизайне
                    </h2>
                    <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
                      Каждый дизайнер выбирает то, что ему ближе. <span className="text-[#0284C7] font-black">Нажми на карточку</span>, чтобы увидеть подробности!
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-3">
                      {/* 1. Веб-дизайнер */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenProfession('web')}
                        className="p-5 rounded-2xl bg-white border-2 border-[#60A5FA] border-b-4 border-b-[#2563EB] text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            🌐
                          </div>
                          <div>
                            <div className="font-black text-lg text-[#17345F] group-hover:text-[#0284C7] transition-colors">
                              Веб-дизайнер
                            </div>
                            <div className="text-sm text-[#475569] font-semibold leading-tight mt-0.5">
                              Создаёт красивые сайты и порталы
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl shrink-0 border border-blue-200">
                          Инфо 👆
                        </span>
                      </motion.button>

                      {/* 2. Геймдизайнер */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenProfession('gamedev')}
                        className="p-5 rounded-2xl bg-white border-2 border-[#F472B6] border-b-4 border-b-[#DB2777] text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            🎮
                          </div>
                          <div>
                            <div className="font-black text-lg text-[#17345F] group-hover:text-[#DB2777] transition-colors">
                              Геймдизайнер
                            </div>
                            <div className="text-sm text-[#475569] font-semibold leading-tight mt-0.5">
                              Придумывает миры, правила и игры
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-pink-600 bg-pink-50 px-3 py-1.5 rounded-xl shrink-0 border border-pink-200">
                          Инфо 👆
                        </span>
                      </motion.button>

                      {/* 3. Графический дизайнер */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenProfession('graphic')}
                        className="p-5 rounded-2xl bg-white border-2 border-[#FBBF24] border-b-4 border-b-[#D97706] text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            🎨
                          </div>
                          <div>
                            <div className="font-black text-lg text-[#17345F] group-hover:text-[#D97706] transition-colors">
                              Графический дизайнер
                            </div>
                            <div className="text-sm text-[#475569] font-semibold leading-tight mt-0.5">
                              Рисует логотипы, плакаты и упаковку
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl shrink-0 border border-amber-200">
                          Инфо 👆
                        </span>
                      </motion.button>

                      {/* 4. UI/UX-дизайнер */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenProfession('uiux')}
                        className="p-5 rounded-2xl bg-white border-2 border-[#34D399] border-b-4 border-b-[#059669] text-left flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                            📱
                          </div>
                          <div>
                            <div className="font-black text-lg text-[#17345F] group-hover:text-[#059669] transition-colors">
                              UI/UX-дизайнер
                            </div>
                            <div className="text-sm text-[#475569] font-semibold leading-tight mt-0.5">
                              Делает приложения понятными и удобными
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0 border border-emerald-200">
                          Инфо 👆
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* СЛАЙД 5: «Ты тоже можешь!» (Спарк: 320x360px) */}
                {slideIndex === 4 && (
                  <motion.div
                    key="slide-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center max-w-2xl w-full"
                  >
                    <div
                      className="mb-4 cursor-pointer"
                      onClick={() => {
                        sound.playClick();
                        speech.speak(slides[4].speechText);
                      }}
                      title="Нажми на Спарка, чтобы услышать напутствие"
                    >
                      <SparkEmotionSprite emotion="excited" size={240} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-3">
                      И ты тоже можешь стать дизайнером!
                    </h2>
                    <p className="text-lg sm:text-xl font-bold text-slate-600 mb-6 leading-relaxed">
                      Для этого не нужно уметь рисовать как академический художник. Главное — понимать, как сделать вещь удобной и приятной для людей.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Нижняя панель навигации слайдов (Иерархия кнопок: «Дальше» оранжевая text-xl font-black, «Назад» серая text-base) */}
          <footer className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4 pb-2 z-10">
            {slideIndex > 0 ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  speech.stop();
                  setSlideIndex((p) => Math.max(0, p - 1));
                }}
                className="px-6 py-4 rounded-2xl bg-white/40 hover:bg-white/60 text-slate-700 font-bold text-base border-2 border-white/80 border-b-4 border-b-slate-300 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                ← Назад
              </button>
            ) : (
              <div />
            )}

            {/* ЗАДАЧА 5: КНОПКА «ДАВАЙ!» НА СЛАЙДЕ 0 — ОДНА СТРЕЛКА/SPARKLES, СВЕЧЕНИЕ 0 0 25px rgba(255,150,0,0.6), ПУЛЬСАЦИЯ scale [1, 1.03, 1] */}
            {slideIndex === 0 ? (
              <motion.button
                type="button"
                animate={{
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 35px rgba(255, 150, 0, 0.85)'
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextSlide}
                style={{
                  boxShadow: '0 0 25px rgba(255, 150, 0, 0.6)'
                }}
                className="flex-1 max-w-[340px] py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] cursor-pointer flex items-center justify-center gap-2.5 transition-shadow"
                id="btn-intro-davay"
              >
                <Sparkles size={22} className="text-yellow-200" />
                <span>Давай!</span>
                <ArrowRight size={22} />
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={handleNextSlide}
                className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg active:translate-y-1 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-105"
              >
                <span>{slides[slideIndex].buttonText || 'Дальше →'}</span>
                <ChevronRight size={22} />
              </button>
            )}
          </footer>
        </SkyBackground>
      )}

      {/* Модальное окно с подробным описанием профессии */}
      <ProfessionModal
        isOpen={isProfessionModalOpen}
        profession={selectedProfession}
        professionId={selectedProfession?.id}
        onClose={() => setIsProfessionModalOpen(false)}
      />
    </div>
  );
};

export default Intro;
