// src/components/practice/VictoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, ChevronRight, ShoppingCart, RotateCcw, Map } from 'lucide-react';
import { SparkEmotionSprite } from '../mascot/SparkEmotionSprite';
import { MaxCharacter } from '../mascot/MaxCharacter';
import { sound } from '../../utils/soundManager';
import { speech } from '../../utils/speechManager';
import { SpeechButton } from '../ui/SpeechButton';

interface VictoryScreenProps {
  userName: string;
  buttonColor: string;
  buttonSize: number;
  buttonText: string;
  onNextOrder: () => void;
  onRetest: () => void;
  onMap: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  userName,
  buttonColor,
  buttonSize,
  buttonText,
  onNextOrder,
  onRetest,
  onMap
}) => {
  const [coinsCount, setCoinsCount] = useState(0);
  const [xpCount, setXpCount] = useState(0);

  const victorySpeech = `Поздравляю, ${userName || 'мастер'}! Твоя кнопка спасла магазин игрушек Макса! Ты заработал 5 монет и 10 очков опыта, а также получил медаль Мастера Кнопок!`;

  useEffect(() => {
    sound.playCelebration();
    if (speech.isAutoSpeak()) {
      speech.speak(victorySpeech);
    }

    // Анимация счета монет и XP
    const interval = setInterval(() => {
      setCoinsCount((prev) => (prev < 5 ? prev + 1 : 5));
      setXpCount((prev) => (prev < 10 ? prev + 2 : 10));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-white rounded-3xl p-6 sm:p-10 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl flex flex-col items-center justify-between min-h-[560px] relative overflow-hidden text-center">
      {/* Праздничный градиентный фон сверху */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 opacity-80" />

      {/* Анимация конфетти */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`confetti-vic-${i}`}
            initial={{
              top: '10%',
              left: `${5 + i * 4.8}%`,
              scale: 0.4,
              opacity: 1
            }}
            animate={{
              top: `${80 + (i % 4) * 5}%`,
              left: `${10 + i * 4.5 + ((i % 2 === 0 ? 1 : -1) * 8)}%`,
              rotate: [0, 360],
              opacity: [1, 0.7, 0]
            }}
            transition={{
              duration: 2.8 + (i % 3) * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
              delay: (i % 5) * 0.3
            }}
            className="absolute w-3.5 h-3.5 rounded-md"
            style={{
              backgroundColor: ['#FF9600', '#10B981', '#8B5CF6', '#F43F5E', '#0EA5E9', '#FBBF24'][i % 6]
            }}
          />
        ))}
      </div>

      {/* Верхний заголовок победы */}
      <div className="relative z-10 flex flex-col items-center gap-2 max-w-2xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs"
        >
          <Sparkles size={16} className="text-amber-600" />
          <span>Практика успешно завершена!</span>
        </motion.div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#17345F] tracking-tight">
          Отличная работа, {userName || 'Дизайнер'}! 🎉
        </h2>

        <div className="flex items-center gap-2 justify-center">
          <p className="text-xs sm:text-base font-bold text-slate-600">
            Покупатели в восторге, магазин спасён, а витрина работает без сбоев!
          </p>
          <SpeechButton text={victorySpeech} size={18} />
        </div>
      </div>

      {/* Центральный блок: Персонажи, медаль и созданная кнопка */}
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6">
        {/* Левая часть: Макс с благодарностью */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center text-center"
        >
          <MaxCharacter mood="grateful" size={100} />
          <span className="text-xs font-black text-slate-400 uppercase tracking-wide mt-2">Владелец магазина</span>
          <h4 className="text-sm font-black text-[#17345F]">Макс</h4>
          <p className="text-xs font-semibold text-slate-600 mt-2 italic">
            «С твоей новой кнопкой мои мишки разлетаются за секунды! Спасибо огромное за помощь!»
          </p>
        </motion.div>

        {/* Центр: Награды и Медаль */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50/50 border-2 border-amber-300 flex flex-col items-center text-center shadow-lg"
        >
          {/* Медаль */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl select-none">
              🥇
            </div>
            <div className="absolute -bottom-2 -right-1 bg-white px-2 py-0.5 rounded-full border border-amber-300 text-[10px] font-black text-amber-800 shadow-xs flex items-center gap-0.5">
              <Award size={12} className="text-amber-600" />
              <span>Ранг 1</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-amber-950 mb-1">
            Медаль «Мастер Кнопок»
          </h3>
          <span className="text-xs font-semibold text-amber-800 mb-4">
            За идеальный баланс цвета, размера и призыва к действию
          </span>

          {/* Карточки наград монет и XP */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="text-base font-black text-[#17345F]">+{coinsCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">монет</span>
            </div>

            <div className="px-4 py-2 bg-white rounded-2xl border-2 border-purple-200 shadow-xs flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <span className="text-base font-black text-purple-700">+{xpCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">XP</span>
            </div>
          </div>
        </motion.div>

        {/* Правая часть: Спарк и созданная кнопка */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center text-center"
        >
          <SparkEmotionSprite emotion="proud" size={100} interactive={false} />
          <span className="text-xs font-black text-slate-400 uppercase tracking-wide mt-2">Твой наставник</span>
          <h4 className="text-sm font-black text-[#17345F]">Спарк</h4>

          {/* Превью созданной кнопки на подставке */}
          <div className="mt-3 w-full p-2.5 bg-white rounded-xl border border-slate-200 shadow-inner flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Твой шедевр:</span>
            <div
              style={{
                backgroundColor: buttonColor,
                padding:
                  buttonSize === 1
                    ? '6px 16px'
                    : buttonSize === 2
                    ? '8px 22px'
                    : '10px 28px',
                fontSize: buttonSize === 1 ? '11px' : buttonSize === 2 ? '13px' : '14px'
              }}
              className="rounded-xl text-white font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-white/60 select-none"
            >
              <ShoppingCart size={14} />
              <span className="truncate max-w-[130px]">{buttonText}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Нижняя панель действий */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetest}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-slate-300 cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>Протестировать кнопку ещё раз</span>
        </button>

        <button
          type="button"
          onClick={onMap}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-slate-300 cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <Map size={16} />
          <span>Карта мира</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playSuccess();
            onNextOrder();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] hover:from-[#E96820] hover:to-[#CC7700] text-white font-black text-sm sm:text-base uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
        >
          <span>Новый заказ: Кондитерская 🧁</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
