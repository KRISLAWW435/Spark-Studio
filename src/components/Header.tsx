// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  coins?: number;
  backpackCount?: number;
  onBackpackClick?: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  coins = 120,
  backpackCount = 2,
  onBackpackClick,
  onMenuClick,
}) => {
  return (
    <header className="relative w-full z-20 flex items-center justify-between select-none">
      {/* Левая часть: Бирюзовая плашка с книгой, заголовком и спринтом */}
      <div 
        className="flex-1 max-w-[620px] rounded-3xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-4 shadow-md"
        style={{ background: 'linear-gradient(135deg, #56D6D1 0%, #3DBEB9 100%)' }}
      >
        {/* Белый сквиркл с раскрытой книжкой */}
        <div 
          onClick={onMenuClick}
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-teal-900/10 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          title="Меню навигации"
        >
          <svg viewBox="0 0 36 36" width="28" height="28">
            {/* Обложка книги */}
            <path
              d="M 6 8 C 12 7, 16 9, 18 11 C 20 9, 24 7, 30 8 L 30 27 C 24 26, 20 28, 18 30 C 16 28, 12 26, 6 27 Z"
              fill="#2EB8B3"
            />
            {/* Страницы книги */}
            <path
              d="M 7 9 C 12 8, 16 10, 18 12 L 18 29 C 16 27, 12 25, 7 26 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 29 9 C 24 8, 20 10, 18 12 L 18 29 C 20 27, 24 25, 29 26 Z"
              fill="#F8FAFC"
            />
            {/* Корешок */}
            <line x1="18" y1="12" x2="18" y2="29" stroke="#1F9490" strokeWidth="1.5" />
            {/* Текстовые полосочки на страницах */}
            <line x1="10" y1="14" x2="15" y2="15" stroke="#99F6E4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="10" y1="18" x2="15" y2="19" stroke="#99F6E4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="21" y1="15" x2="26" y2="14" stroke="#99F6E4" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="21" y1="19" x2="26" y2="18" stroke="#99F6E4" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Заголовок и бейдж СПРИНТ 1 */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            Архипелаг UX • Карта мира
          </h1>
          <div className="bg-white/25 text-white px-3 py-1 rounded-full text-xs font-black backdrop-blur-sm border border-white/30 shadow-xs inline-flex items-center gap-1">
            <span className="text-amber-300">⭐</span>
            <span>СПРИНТ 1</span>
          </div>
        </div>
      </div>

      {/* Правая часть: Виджеты МОНЕТЫ и РЮКЗАК */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* МОНЕТЫ */}
        <div 
          className="w-24 sm:w-28 bg-[#805712] rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between border-2 border-[#68460B] shadow-lg shadow-amber-950/20 cursor-default"
          title="Ваши монеты"
        >
          <span className="text-[10px] sm:text-[11px] font-black text-amber-200 tracking-wider uppercase leading-none">
            МОНЕТЫ
          </span>

          {/* 3D рельефная золотая монета со стрелками */}
          <div className="my-1">
            <svg viewBox="0 0 44 44" width="36" height="36" className="drop-shadow-sm">
              <defs>
                <linearGradient id="coinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="40%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="coinRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              <ellipse cx="22" cy="23" rx="19" ry="19" fill="url(#coinRimGrad)" />
              <circle cx="22" cy="21" r="18" fill="url(#coinGoldGrad)" stroke="#FDE68A" strokeWidth="1.5" />
              <circle cx="22" cy="21" r="14" fill="none" stroke="#B45309" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
              {/* Рельефные изогнутые стрелки как на фото */}
              <path
                d="M 17 18 A 6 6 0 0 1 27 18 L 29 16 M 27 18 L 29 20"
                fill="none"
                stroke="#92400E"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 27 24 A 6 6 0 0 1 17 24 L 15 22 M 17 24 L 15 26"
                fill="none"
                stroke="#92400E"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Световой блик */}
              <ellipse cx="17" cy="14" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 17 14)" />
            </svg>
          </div>

          <span className="text-white font-black text-lg sm:text-xl leading-none tracking-tight">
            {coins}
          </span>
        </div>

        {/* РЮКЗАК */}
        <button
          onClick={onBackpackClick}
          className="w-24 sm:w-28 bg-[#A8381D] hover:bg-[#972E15] active:scale-95 transition-all rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between border-2 border-[#822710] shadow-lg shadow-red-950/20 cursor-pointer"
          title="Открыть рюкзак с собранными предметами"
        >
          <span className="text-[10px] sm:text-[11px] font-black text-rose-200 tracking-wider uppercase leading-none">
            РЮКЗАК
          </span>

          {/* Мультяшный 2D рюкзачок с ремешками и пряжками */}
          <div className="my-1">
            <svg viewBox="0 0 44 44" width="36" height="36" className="drop-shadow-sm">
              {/* Петля сверху */}
              <path d="M 18 10 Q 22 5 26 10" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Тело рюкзака */}
              <rect x="10" y="10" width="24" height="26" rx="6" fill="#C2410C" stroke="#7C2D12" strokeWidth="2" />
              {/* Верхний клапан */}
              <path d="M 10 16 Q 22 21 34 16 L 34 12 Q 22 10 10 12 Z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.5" />
              {/* Передний накладной карман */}
              <rect x="14" y="21" width="16" height="13" rx="3" fill="#D97706" stroke="#7C2D12" strokeWidth="1.5" />
              {/* Ремешки и пряжки */}
              <line x1="16" y1="11" x2="16" y2="34" stroke="#78350F" strokeWidth="1.8" />
              <line x1="28" y1="11" x2="28" y2="34" stroke="#78350F" strokeWidth="1.8" />
              <rect x="14.5" y="18" width="3" height="3" fill="#FDE047" stroke="#78350F" strokeWidth="0.8" />
              <rect x="26.5" y="18" width="3" height="3" fill="#FDE047" stroke="#78350F" strokeWidth="0.8" />
            </svg>
          </div>

          <span className="text-white font-black text-xs sm:text-sm leading-none tracking-tight">
            {backpackCount} предм.
          </span>
        </button>
      </div>
    </header>
  );
};
