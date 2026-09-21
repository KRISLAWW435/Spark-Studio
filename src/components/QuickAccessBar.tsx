// src/components/QuickAccessBar.tsx
import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { sound } from '../utils/soundManager';

interface QuickAccessBarProps {
  onSelectLocation: (locationId: string) => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({ onSelectLocation }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 w-full select-none z-20">
      {/* 1. Мари */}
      <div
        id="quick-access-cafe_marie"
        onClick={() => {
          sound.playClick();
          onSelectLocation('cafe_marie');
        }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-100"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FFEDD5] border border-orange-200 flex items-center justify-center text-xl shrink-0 shadow-inner">
            <span>👩‍🦰</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-amber-700/80 leading-tight">
              Мари
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate leading-snug">
              Кофейня
            </span>
          </div>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFEDD5] group-hover:bg-[#EA580C] text-[#EA580C] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
          <ArrowRight size={15} strokeWidth={2.8} />
        </div>
      </div>

      {/* 2. Кирилл */}
      <div
        id="quick-access-tech_kirill"
        onClick={() => {
          sound.playClick();
          onSelectLocation('tech_kirill');
        }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-teal-100"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#CCFBF1] border border-teal-200 flex items-center justify-center text-xl shrink-0 shadow-inner">
            <span>🧑‍💻</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-teal-700/80 leading-tight">
              Кирилл
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate leading-snug">
              Техно-хаб
            </span>
          </div>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CCFBF1] group-hover:bg-[#0D9488] text-[#0D9488] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
          <ArrowRight size={15} strokeWidth={2.8} />
        </div>
      </div>

      {/* 3. Соня */}
      <div
        id="quick-access-art_sonya"
        onClick={() => {
          sound.playClick();
          onSelectLocation('art_sonya');
        }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-purple-100"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F3E8FF] border border-purple-200 flex items-center justify-center text-xl shrink-0 shadow-inner">
            <span>👩‍🎨</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-purple-700/80 leading-tight">
              Соня
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate leading-snug">
              Мастерская
            </span>
          </div>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F3E8FF] group-hover:bg-[#9333EA] text-[#9333EA] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
          <ArrowRight size={15} strokeWidth={2.8} />
        </div>
      </div>

      {/* 4. Неоновый Мегаполис */}
      <div
        id="quick-access-cyber_metropolis"
        onClick={() => {
          sound.playClick();
          onSelectLocation('cyber_metropolis');
        }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-indigo-100"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xl shrink-0 shadow-inner">
            <span>🏙️</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-indigo-600/80 leading-tight">
              Спринт 2
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate leading-snug">
              Мегаполис
            </span>
          </div>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-600 text-indigo-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
          <Lock size={13} strokeWidth={2.6} />
        </div>
      </div>

      {/* 5. Башня Арт-директора */}
      <div
        id="quick-access-art_director_citadel"
        onClick={() => {
          sound.playClick();
          onSelectLocation('art_director_citadel');
        }}
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-200 col-span-2 sm:col-span-1"
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-xl shrink-0 shadow-inner">
            <span>👑</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-amber-700/80 leading-tight">
              Цитадель
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate leading-snug">
              Арт-директор
            </span>
          </div>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
          <Lock size={13} strokeWidth={2.6} />
        </div>
      </div>
    </div>
  );
};
