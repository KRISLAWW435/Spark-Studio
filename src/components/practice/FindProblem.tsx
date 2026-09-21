// src/components/practice/FindProblem.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { SparkEmotionSprite } from '../mascot/SparkEmotionSprite';
import { sound } from '../../utils/soundManager';
import { speech } from '../../utils/speechManager';
import { SpeechButton } from '../ui/SpeechButton';
import { getRandomReplica } from '../../data/sparkReplicas';
import { emitSparkEvent } from '../../utils/sparkEvents';

export interface FindProblemProps {
  onComplete: () => void;
  onDiscoverTerm?: (termId: string) => void;
}

interface ProblemItem {
  id: 'color' | 'size' | 'text';
  title: string;
  shortDesc: string;
  foundMessage: string;
  sparkEmotion: 'happy' | 'excited' | 'proud';
}

const PROBLEMS: Record<'color' | 'size' | 'text', ProblemItem> = {
  color: {
    id: 'color',
    title: 'Серая незаметная кнопка',
    shortDesc: 'Сливается со стеллажом',
    foundMessage: 'Точно! Серая кнопка теряется на сером фоне. Покупатели её просто не видят!',
    sparkEmotion: 'excited'
  },
  size: {
    id: 'size',
    title: 'Слишком крошечный размер',
    shortDesc: 'Пальчиком не попасть',
    foundMessage: 'Отлично замечено! По такой микроскопической кнопке почти невозможно попасть пальцем!',
    sparkEmotion: 'happy'
  },
  text: {
    id: 'text',
    title: 'Непонятная надпись «кнопка 1»',
    shortDesc: 'Не говорит, что произойдёт',
    foundMessage: 'В точку! Надпись «кнопка» не объясняет, что получит покупатель при нажатии!',
    sparkEmotion: 'proud'
  }
};

export const FindProblem: React.FC<FindProblemProps> = ({ onComplete, onDiscoverTerm }) => {
  const [foundProblems, setFoundProblems] = useState<Set<'color' | 'size' | 'text'>>(new Set());
  const [activeHighlight, setActiveHighlight] = useState<'color' | 'size' | 'text' | null>(null);
  const [activeMessage, setActiveMessage] = useState<string>(
    'Посмотри на витрину магазина Макса. Нажми на пункты списка проблем внизу или на саму кнопку, чтобы исследовать ошибки!'
  );
  const [sparkEmotion, setSparkEmotion] = useState<'thinking' | 'excited' | 'happy' | 'proud'>('thinking');

  const handleProblemClick = (id: 'color' | 'size' | 'text') => {
    setActiveHighlight(id);

    if (foundProblems.has(id)) {
      setActiveMessage(`Ты уже исследовал эту проблему: ${PROBLEMS[id].title}!`);
      return;
    }

    sound.playSuccess();
    emitSparkEvent('FIND_PROBLEM');
    const updated = new Set(foundProblems);
    updated.add(id);
    setFoundProblems(updated);

    const problem = PROBLEMS[id];
    setSparkEmotion(problem.sparkEmotion);
    setActiveMessage(problem.foundMessage);

    if (speech.isAutoSpeak()) {
      speech.speak(problem.foundMessage);
    }

    if (updated.size === 3) {
      setTimeout(() => {
        sound.playCelebration();
        emitSparkEvent('ALL_PROBLEMS_FOUND');
        setSparkEmotion('proud');
        setActiveMessage(getRandomReplica('all_problems_found'));
        onDiscoverTerm?.('usability');
      }, 900);
    }
  };

  const isAllFound = foundProblems.size === 3;

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-white rounded-3xl p-5 sm:p-8 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl flex flex-col gap-6">
      {/* Шапка задания */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-sm font-black shadow-xs">
            🔍
          </span>
          <div>
            <h3 className="text-base sm:text-xl font-black text-[#17345F] leading-tight">
              Мини-детектив: «Найди 3 ошибки витрины»
            </h3>
            <p className="text-xs font-semibold text-slate-500 hidden sm:block">
              Покупатели смотрят на полки, но ничего не покупают. Исследуй проблему!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-2xs">
            <Sparkles size={14} className="text-amber-600" />
            <span>Найдено: {foundProblems.size} из 3</span>
          </div>
          <SpeechButton text={activeMessage} size={18} />
        </div>
      </div>

      {/* 2-колоночный широкий layout для 1440px */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Левая колонка (7 колонок): Интерактивная витрина с проблемами */}
        <div className="lg:col-span-7 bg-slate-100 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200/80 pb-2">
            <span className="flex items-center gap-1.5">
              <span>🏪</span>
              <span>Витрина магазина Макса (до ремонта)</span>
            </span>
            <span className="text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-2xs">
              Кликни на кнопку или на список справа! 👆
            </span>
          </div>

          {/* Анимированные покупатели */}
          <div className="w-full flex items-center justify-between px-3 mt-2">
            <motion.div
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 bg-white/90 backdrop-blur-2xs px-2.5 py-1 rounded-2xl border border-slate-200 text-[11px] font-black text-slate-700 shadow-2xs"
            >
              <span>👧</span>
              <span>«Хочу мишку, а куда жать? 🤔»</span>
            </motion.div>

            <motion.div
              animate={{ x: [4, -4, 4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 bg-white/90 backdrop-blur-2xs px-2.5 py-1 rounded-2xl border border-slate-200 text-[11px] font-black text-slate-700 shadow-2xs"
            >
              <span>«Не вижу кнопку покупки! 🔍»</span>
              <span>👦</span>
            </motion.div>
          </div>

          {/* Игрушка на полке */}
          <div className="my-auto flex flex-col items-center py-4">
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl sm:text-9xl filter drop-shadow-md select-none"
            >
              🧸
            </motion.div>
            
            {/* Полка под товаром */}
            <div className="w-52 h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-xl shadow-md border-b-2 border-amber-950 flex items-center justify-center -mt-2">
              <div className="w-44 h-1 bg-amber-500/40 rounded-full" />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-black text-[#17345F]">Плюшевый Мишка</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                150 💰
              </span>
            </div>
          </div>

          {/* Проблемная зона: кнопка с мягкой подсветкой пульсирующим кольцом */}
          <div className="w-full flex flex-col items-center gap-2 pt-3 border-t border-slate-200">
            <div className="relative flex items-center justify-center p-3">
              {/* Пульсирующее кольцо мягкой подсветки активной/проблемной зоны */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.75, 0.35]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute inset-0 rounded-2xl pointer-events-none transition-all ${
                  activeHighlight || !isAllFound
                    ? 'ring-4 ring-rose-400 bg-rose-400/10'
                    : 'ring-2 ring-emerald-400 bg-emerald-400/10'
                }`}
              />

              {/* Проблемная кнопка */}
              <button
                type="button"
                onClick={() => {
                  if (!foundProblems.has('color')) handleProblemClick('color');
                  else if (!foundProblems.has('size')) handleProblemClick('size');
                  else if (!foundProblems.has('text')) handleProblemClick('text');
                  else {
                    sound.playClick();
                    setActiveHighlight('color');
                  }
                }}
                className="relative z-10 px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-500 rounded-lg font-bold text-xs border border-slate-400 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                title="Нажми, чтобы исследовать проблему кнопки"
              >
                <span>кнопка 123</span>
              </button>
            </div>

            <span className="text-[11px] font-bold text-slate-400 text-center">
              ⚠️ Серая, микроскопическая, с непонятной надписью
            </span>
          </div>
        </div>

        {/* Правая колонка (5 колонок): Список улик детектива + Реакция Спарка */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Улики и проблемы дизайна:
            </span>

            {/* 3 пункта проблем */}
            <div className="flex flex-col gap-2.5">
              {(['color', 'size', 'text'] as const).map((key) => {
                const isFound = foundProblems.has(key);
                const isHighlighted = activeHighlight === key;
                const prob = PROBLEMS[key];
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleProblemClick(key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleProblemClick(key);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer select-none text-left ${
                      isFound
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs'
                        : isHighlighted
                        ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isFound ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black text-xs">
                          {key === 'color' ? '1' : key === 'size' ? '2' : '3'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black leading-tight flex items-center justify-between gap-2">
                        <span>{prob.title}</span>
                        {isFound && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">
                            Найдено ✓
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold opacity-80 mt-1">
                        {prob.shortDesc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Реакция Спарка */}
          <div className="bg-[#FFF9EA] rounded-2xl p-4 sm:p-5 border-2 border-[#E5D5BA] flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <div className="shrink-0">
                <SparkEmotionSprite emotion={sparkEmotion} size={70} interactive={false} />
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#17345F] leading-snug">
                <span className="font-black text-[#E96820] block mb-0.5">Спарк-детектив:</span>
                {activeMessage}
              </div>
            </div>

            {/* Кнопка перехода к исправлению кнопки */}
            {isAllFound && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onComplete();
                }}
                className="w-full mt-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] hover:from-[#E96820] hover:to-[#CC7700] text-white font-black text-sm uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] cursor-pointer shadow-lg flex items-center justify-center gap-2 active:translate-y-1 active:border-b-2 transition-all"
              >
                <span>Исправить кнопку! 🛠️</span>
                <ArrowRight size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindProblem;
