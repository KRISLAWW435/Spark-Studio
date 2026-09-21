// src/components/ui/TermDiscoveryModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X } from 'lucide-react';
import { DesignTerm } from '../../data/terminology';
import { SparkEmotionSprite } from '../mascot/SparkEmotionSprite';
import { sound } from '../../utils/soundManager';
import { SpeechButton } from './SpeechButton';

interface TermDiscoveryModalProps {
  term: DesignTerm | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TermDiscoveryModal: React.FC<TermDiscoveryModalProps> = ({
  term,
  isOpen,
  onClose
}) => {
  if (!isOpen || !term) return null;

  const speechText = `Новое дизайн-открытие: ${term.childTerm}! В мире дизайнеров это называется ${term.technicalTerm}. Главный вопрос: ${term.question}. ${term.simpleExplanation}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs select-none">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-white/90 border-b-8 border-b-sky-700/20 z-10 text-[#17345F] text-center"
        >
          {/* Кнопка закрытия */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Иконка маскота и бейдж */}
          <div className="flex justify-center -mt-12 mb-2">
            <SparkEmotionSprite emotion="proud" size={110} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>Новое дизайн-открытие!</span>
          </div>

          {/* Термин */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl">{term.icon}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17345F]">
              {term.childTerm}
            </h3>
            <SpeechButton text={speechText} size={18} />
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
            (В дизайне: {term.technicalTerm})
          </p>

          {/* Карточка с ключевым вопросом */}
          <div
            className="p-4 rounded-2xl border-2 mb-4 text-left"
            style={{ backgroundColor: `${term.color}15`, borderColor: `${term.color}40` }}
          >
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
              Главный вопрос дизайнера:
            </div>
            <div className="text-base sm:text-lg font-black text-[#17345F]">
              «{term.question}»
            </div>
          </div>

          {/* Простое объяснение */}
          <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed mb-6">
            {term.fullExplanation}
          </p>

          {/* Кнопка «Понятно!» */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            style={{ backgroundColor: term.color }}
            className="w-full py-3.5 rounded-2xl text-white font-black text-base uppercase tracking-wider border-2 border-black/20 border-b-4 border-b-black/30 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Check size={20} />
            <span>Запомнил! ✨</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
