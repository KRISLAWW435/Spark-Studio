// src/pages/StudioSetup.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Building2, User, Palette, Smile } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { SparkEmotionSprite } from '../components/mascot/SparkEmotionSprite';
import { sound } from '../utils/soundManager';
import { speech } from '../utils/speechManager';
import { SpeechButton } from '../components/ui/SpeechButton';
import { SkyBackground } from '../components/ui/SkyBackground';
import { GlobalAudioControls } from '../components/ui/GlobalAudioControls';

interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bg: string;
}

export const StudioSetup: React.FC = () => {
  const navigate = useNavigate();
  const {
    userName: currentUserName,
    setUserName,
    studioName: currentStudioName,
    setStudioName,
    avatarId: currentAvatarId,
    setAvatarId,
    studioColor: currentStudioColor,
    setStudioColor
  } = usePlayer();

  // Шаги мастера создания студии (1: Имя, 2: Название студии, 3: Аватар, 4: Цвет -> переход в /practice)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [inputName, setInputName] = useState<string>(currentUserName || 'Алиса');
  const [inputStudioName, setInputStudioName] = useState<string>(currentStudioName || 'Креатив-Лаб');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatarId || 'hero');
  const [selectedColor, setSelectedColor] = useState<string>(currentStudioColor || '#7C3AED');

  const stepPrompts: Record<1 | 2 | 3 | 4, string> = {
    1: 'Как тебя зовут? Я запишу это в сертификат!',
    2: 'Придумай название! Это как имя для твоего корабля.',
    3: 'Кто будет символом твоей команды?',
    4: 'Это цвет твоей студии. Он будет на обложках, кнопках и в сертификате.'
  };

  // Озвучка при смене шага мастера
  useEffect(() => {
    if (speech.isAutoSpeak()) {
      speech.speak(stepPrompts[step]);
    }
  }, [step]);

  // Варианты готовых имен
  const namePresets = ['Саша', 'Артём', 'Алиса', 'Максим', 'София', 'Кристина'];

  // Варианты названий студий (русские названия по ТЗ)
  const studioPresets = ['Волшебная кисть', 'Креатив-Лаб', 'Радуга', 'Пиксель'];

  // 8 аватаров: 5 «взрослых» + 3 «базовых»
  const avatars: AvatarOption[] = [
    { id: 'hero', name: 'Супергерой', emoji: '🦸', bg: 'bg-blue-100' },
    { id: 'robot', name: 'Робот', emoji: '🤖', bg: 'bg-purple-100' },
    { id: 'dragon', name: 'Дракон', emoji: '🐉', bg: 'bg-emerald-100' },
    { id: 'alien', name: 'Пришелец', emoji: '👽', bg: 'bg-teal-100' },
    { id: 'wizard', name: 'Маг', emoji: '🧙', bg: 'bg-indigo-100' },
    { id: 'wolf', name: 'Волк', emoji: '🐺', bg: 'bg-slate-100' },
    { id: 'fox', name: 'Лиса', emoji: '🦊', bg: 'bg-orange-100' },
    { id: 'owl', name: 'Сова', emoji: '🦉', bg: 'bg-amber-100' }
  ];

  // 6 фирменных цветов студии
  const colorOptions = [
    { name: 'Фиолетовый', value: '#7C3AED', label: 'Творческий' },
    { name: 'Оранжевый', value: '#FF9600', label: 'Энергичный' },
    { name: 'Изумрудный', value: '#10B981', label: 'Свежий' },
    { name: 'Коралловый', value: '#F43F5E', label: 'Яркий' },
    { name: 'Лазурный', value: '#0EA5E9', label: 'Технологичный' },
    { name: 'Индиго', value: '#4F46E5', label: 'Глубокий' }
  ];

  const handleNextStep = () => {
    sound.playClick();
    speech.stop();
    if (step === 1) {
      if (!inputName.trim()) return;
      setUserName(inputName.trim());
      setStep(2);
    } else if (step === 2) {
      if (!inputStudioName.trim()) return;
      setStudioName(inputStudioName.trim());
      setStep(3);
    } else if (step === 3) {
      setAvatarId(selectedAvatar);
      setStep(4);
    } else if (step === 4) {
      setStudioColor(selectedColor);
      sound.playSuccess();
      setUserName(inputName.trim() || 'Юный Дизайнер');
      setStudioName(inputStudioName.trim() || 'Креатив-Лаб');
      setAvatarId(selectedAvatar);
      navigate('/practice');
    }
  };

  const currentAvatarObj = avatars.find((a) => a.id === selectedAvatar) || avatars[0];

  return (
    <SkyBackground className="p-4 sm:p-6 min-h-screen flex flex-col justify-between">
      {/* Верхний бар с кнопкой назад и индикатором шагов */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-10 pt-2 px-2 sm:px-6">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            speech.stop();
            if (step > 1) {
              setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            } else {
              navigate('/');
            }
          }}
          className="px-5 py-2.5 rounded-2xl bg-white/50 hover:bg-white/70 text-slate-700 font-bold text-base border-2 border-white/80 border-b-4 border-b-slate-300 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer shadow-sm flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>{step === 1 ? 'Меню' : 'Назад'}</span>
        </button>

        {/* Индикатор шагов */}
        <div className="flex items-center gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 sm:w-14 h-3 rounded-full transition-all duration-300 border-2 ${
                s <= step
                  ? 'bg-[#FF9600] border-[#D97706] shadow-sm'
                  : 'bg-white/40 border-white/60'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-slate-700 bg-white/90 px-3.5 py-1.5 rounded-xl border-2 border-white shadow-sm hidden sm:inline-block">
            Шаг {step} из 4
          </span>
          <GlobalAudioControls compact={true} />
        </div>
      </header>

      {/* Основная рабочая зона 1440px: Спарк слева + Карточка по центру/справа */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 my-6 z-10 px-2 sm:px-6">
        {/* Спарк и его реплика */}
        <aside className="w-full lg:w-[360px] flex flex-col items-center justify-center text-center select-none shrink-0">
          {/* Реплика Спарка */}
          <motion.div
            key={`spark-dialog-${step}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-[340px] bg-white rounded-3xl p-5 border-3 border-white/95 shadow-xl text-left relative mb-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-base sm:text-lg font-black text-[#17345F] leading-snug">
                {stepPrompts[step]}
              </p>
              <SpeechButton text={stepPrompts[step]} size={18} />
            </div>
            {/* Хвостик облачка */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
          </motion.div>

          <div
            onClick={() => {
              sound.playClick();
              if (speech.isAutoSpeak()) {
                speech.speak(stepPrompts[step]);
              }
            }}
            className="cursor-pointer hover:scale-105 transition-transform"
            title="Нажми на Спарка!"
          >
            <SparkEmotionSprite
              emotion={step === 1 ? 'waving' : step === 2 ? 'thinking' : step === 3 ? 'playful' : 'excited'}
              size={220}
            />
          </div>
        </aside>

        {/* Карточка конструктора: ширина 740-800px, без вложенных рамок */}
        <div className="w-full max-w-[780px] flex justify-center">
          <AnimatePresence mode="wait">
            {/* ========================================================================= */}
            {/* ШАГ 1: ИМЯ ДИЗАЙНЕРА                                                      */}
            {/* ========================================================================= */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-white rounded-3xl p-8 sm:p-12 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl text-center text-[#17345F] relative"
              >
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-3xl bg-amber-100 text-amber-600 border-2 border-amber-300 border-b-4 border-b-amber-500 text-4xl shadow-sm">
                  <User size={40} />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black mb-2">
                  Как тебя зовут?
                </h2>
                <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
                  Твоё имя будет указано на сертификатах и проектах
                </p>

                {/* Поле ввода: крупное, text-2xl */}
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Введи своё имя..."
                  maxLength={24}
                  className="w-full py-4.5 px-6 text-center text-2xl sm:text-3xl font-black rounded-2xl border-2 border-[#E2E8F0] border-b-4 border-b-[#CBD5E1] outline-none focus:border-[#7C3AED] focus:border-b-[#5B21B6] transition-all mb-6 bg-slate-50 text-[#17345F]"
                />

                {/* Готовые пресеты имён: py-3, text-lg */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {namePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setInputName(preset);
                      }}
                      className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black border-2 border-b-4 transition-all cursor-pointer active:scale-95 ${
                        inputName === preset
                          ? 'bg-[#7C3AED] text-white border-[#6D28D9] border-b-[#4C1D95] shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 border-b-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!inputName.trim()}
                  onClick={handleNextStep}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg cursor-pointer active:translate-y-1 active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:brightness-105 transition-all"
                >
                  <span>Дальше</span>
                  <ArrowRight size={22} />
                </button>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* ШАГ 2: НАЗВАНИЕ СТУДИИ                                                    */}
            {/* ========================================================================= */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-white rounded-3xl p-8 sm:p-12 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl text-center text-[#17345F] relative"
              >
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-3xl bg-purple-100 text-purple-600 border-2 border-purple-300 border-b-4 border-b-purple-500 text-4xl shadow-sm">
                  <Building2 size={40} />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black mb-2">
                  Название студии
                </h2>
                <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
                  Придумай название или выбери один из вариантов
                </p>

                {/* Поле ввода названия студии */}
                <input
                  type="text"
                  value={inputStudioName}
                  onChange={(e) => setInputStudioName(e.target.value)}
                  placeholder="Название студии..."
                  maxLength={30}
                  className="w-full py-4.5 px-6 text-center text-2xl sm:text-3xl font-black rounded-2xl border-2 border-[#E2E8F0] border-b-4 border-b-[#CBD5E1] outline-none focus:border-[#7C3AED] focus:border-b-[#5B21B6] transition-all mb-6 bg-slate-50 text-[#17345F]"
                />

                {/* Пресеты названий на русском языке: карточки 300x80px */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  {studioPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setInputStudioName(preset);
                      }}
                      className={`min-h-[75px] py-3.5 px-5 rounded-2xl text-lg font-black border-2 border-b-4 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                        inputStudioName === preset
                          ? 'bg-[#7C3AED] text-white border-[#6D28D9] border-b-[#4C1D95] shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 border-b-slate-300'
                      }`}
                    >
                      <span>✨</span>
                      <span>{preset}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!inputStudioName.trim()}
                  onClick={handleNextStep}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg cursor-pointer active:translate-y-1 active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:brightness-105 transition-all"
                >
                  <span>Дальше</span>
                  <ArrowRight size={22} />
                </button>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* ШАГ 3: АВАТАР ДИЗАЙНЕРА                                                   */}
            {/* ========================================================================= */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-white rounded-3xl p-8 sm:p-12 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl text-center text-[#17345F] relative"
              >
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-3xl bg-teal-100 text-teal-600 border-2 border-teal-300 border-b-4 border-b-teal-500 text-4xl shadow-sm">
                  <Smile size={40} />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black mb-2">
                  Аватар команды
                </h2>
                <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
                  Кто станет символом твоей творческой команды?
                </p>

                {/* Сетка из 8 аватаров: 5 взрослых + 3 базовых */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
                  {avatars.map((av) => (
                    <motion.button
                      key={av.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedAvatar(av.id);
                      }}
                      className={`p-4 rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av.id
                          ? 'ring-4 ring-[#7C3AED] bg-purple-50 border-[#7C3AED] border-b-[#5B21B6] shadow-md'
                          : `${av.bg} border-slate-200 border-b-slate-300 opacity-85 hover:opacity-100`
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl mb-1.5">{av.emoji}</span>
                      <span className="text-sm font-black text-slate-800">{av.name}</span>
                    </motion.button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg cursor-pointer active:translate-y-1 active:border-b-2 flex items-center justify-center gap-2.5 hover:brightness-105 transition-all"
                >
                  <span>Дальше</span>
                  <ArrowRight size={22} />
                </button>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* ШАГ 4: ЦВЕТ СТУДИИ + ЖИВОЕ ПРЕВЬЮ ВИЗИТКИ И ЛОГОТИПА                       */}
            {/* ========================================================================= */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-white rounded-3xl p-6 sm:p-10 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl text-center text-[#17345F] relative"
              >
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-3xl bg-rose-100 text-rose-600 border-2 border-rose-300 border-b-4 border-b-rose-500 text-3xl shadow-sm">
                  <Palette size={34} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black mb-1">
                  Цвет твоей студии
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-600 mb-5">
                  Выбери фирменный цвет — посмотри, как обновится твоя визитка
                </p>

                {/* 6 фирменных цветов */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                  {colorOptions.map((c) => (
                    <motion.button
                      key={c.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedColor(c.value);
                      }}
                      style={{ backgroundColor: c.value }}
                      className={`h-16 sm:h-20 rounded-2xl text-white font-black p-2 flex flex-col items-center justify-center border-2 border-white/50 shadow-xs cursor-pointer ${
                        selectedColor === c.value
                          ? 'ring-4 ring-[#17345F] scale-105 shadow-md'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                    >
                      <span className="text-sm font-black drop-shadow-sm">{c.name}</span>
                      <span className="text-xs font-semibold text-white/90">{c.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* ЖИВОЕ ПРЕВЬЮ: Карточка «Так будет выглядеть твой логотип и визитка» */}
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-left">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#FF9600]" />
                    <span>Так будет выглядеть твой логотип и стиль студии:</span>
                  </p>

                  <motion.div
                    animate={{ backgroundColor: selectedColor }}
                    transition={{ duration: 0.35 }}
                    className="w-full rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between gap-4 border-2 border-white/20"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-sm border border-white/40">
                        {currentAvatarObj.emoji}
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-black leading-tight drop-shadow-sm">
                          {inputStudioName || 'Студия дизайна'}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-white/90">
                          Дизайнер: {inputName || 'Юный мастер'}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 backdrop-blur-xs">
                        Архипелаг UX
                      </span>
                    </div>
                  </motion.div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-xl uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg cursor-pointer active:translate-y-1 active:border-b-2 flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <span>К первой практике! 🚀</span>
                  <Sparkles size={22} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Нижняя плашка */}
      <footer className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-10 text-xs font-bold text-white/80 px-2 sm:px-6 pb-2">
        <span>Спарк Студия • Архипелаг UX</span>
        <span>Остров Кнопок • Шаг создания</span>
      </footer>
    </SkyBackground>
  );
};

export default StudioSetup;
