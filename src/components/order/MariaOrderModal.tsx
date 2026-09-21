// src/components/order/MariaOrderModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cake, ChevronRight, Award, MapPin, CheckCircle2 } from 'lucide-react';
import { MariaCharacter } from '../mascot/MariaCharacter';
import { sound } from '../../utils/soundManager';
import { speech } from '../../utils/speechManager';
import { SpeechButton } from '../ui/SpeechButton';

interface MariaOrderModalProps {
  isOpen: boolean;
  userName: string;
  onAccept: () => void;
  onClose?: () => void;
}

export const MariaOrderModal: React.FC<MariaOrderModalProps> = ({
  isOpen,
  userName,
  onAccept
}) => {
  if (!isOpen) return null;

  const mariaSpeech = `Привет, ${userName || 'дизайнер'}! Меня зовут Мария. Я открываю новую кондитерскую «Сладкая искра»! Покупатели уже ждут сладости, но наша витрина десертов пуста, и нам срочно требуется красивое меню и фирменный стиль! Поможешь мне?`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-rose-100 border-b-8 border-b-rose-300 text-[#17345F] overflow-hidden"
        >
          {/* Бейдж нового заказа */}
          <div className="flex items-center justify-between mb-4 border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-base font-black">
                🍰
              </span>
              <div>
                <span className="text-xs font-black uppercase text-rose-500 tracking-wider block">
                  Новый сюжетный заказ
                </span>
                <span className="text-sm sm:text-base font-black text-[#17345F]">
                  Заказ №1: Кондитерская «Сладкая искра»
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-black text-amber-700">
              <Sparkles size={14} className="text-amber-500" />
              <span>+50 монет</span>
            </div>
          </div>

          {/* Содержимое: Персонаж Марии (400×600 пропорция в карточке) + Диалог */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-6">
            {/* Карточка персонажа Марии 400×600 пропорции */}
            <div className="sm:col-span-5 bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 rounded-2xl p-4 border-2 border-rose-200 border-b-4 border-b-rose-300 flex flex-col items-center justify-center shadow-inner relative min-h-[260px]">
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-[11px] font-black text-rose-600 border border-rose-200 shadow-2xs flex items-center gap-1">
                <Cake size={12} />
                <span>Мария • Шеф-кондитер</span>
              </div>

              <div className="mt-4">
                <MariaCharacter size={160} />
              </div>
            </div>

            {/* Текст заказа и диалог */}
            <div className="sm:col-span-7 flex flex-col gap-3">
              <div className="p-4 bg-[#FFF9F5] rounded-2xl border-2 border-[#FED7AA] relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wide">
                    Мария говорит:
                  </span>
                  <SpeechButton text={mariaSpeech} size={15} />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                  «Привет, <span className="font-black text-rose-600">{userName || 'дизайнер'}</span>! Спарк порекомендовал тебя как отличного мастера. Моя кондитерская «Сладкая искра» открывается со дня на день, но витрина сладостей пуста, а меню не оформлено. Поможешь мне создать красивый стиль?»
                </p>
              </div>

              {/* Условия и цели заказа */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <MapPin size={16} className="text-rose-500 shrink-0" />
                  <span>Остров Десертов</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Award size={16} className="text-amber-500 shrink-0" />
                  <span>Награда: 50 💰 + 25 XP</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Задание: Создать логотип и витрину сладостей</span>
              </div>
            </div>
          </div>

          {/* Кнопка действия «Помочь Марии» */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => {
                sound.playCelebration();
                speech.stop();
                onAccept();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] hover:from-[#E96820] hover:to-[#CC7700] text-white font-black text-lg uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>Помочь Марии! 🧁</span>
              <ChevronRight size={22} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
