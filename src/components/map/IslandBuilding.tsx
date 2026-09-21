// src/components/map/IslandBuilding.tsx
import React from 'react';
import { IslandTheme } from '../../data/islands';

interface IslandBuildingProps {
  theme: IslandTheme;
  className?: string;
}

export const IslandBuilding: React.FC<IslandBuildingProps> = ({ theme, className = '' }) => {
  return (
    <svg
      viewBox="0 0 300 200"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиенты для зданий */}
        <linearGradient id="cafeWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A75A0" />
          <stop offset="100%" stopColor="#2A4B6E" />
        </linearGradient>

        <linearGradient id="screenGradCyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BAF3F0" />
          <stop offset="100%" stopColor="#38D1C9" />
        </linearGradient>

        <linearGradient id="screenGradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Небоскребы Мегаполиса */}
        <linearGradient id="skyScraperYellow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        <linearGradient id="skyScraperCyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="skyScraperBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="skyScraperPurple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        <linearGradient id="skyScraperPink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>

      {/* ОСТРОВ 1: КОФЕЙНЯ МАРИ */}
      {theme === 'orange' && (
        <g id="marie-cafe" transform="translate(112, 28)">
          {/* Стены кафе */}
          <rect x="14" y="24" width="48" height="32" rx="4" fill="url(#cafeWallGrad)" stroke="#1E3A5F" strokeWidth="2" />
          <rect x="22" y="38" width="14" height="18" rx="2" fill="#E2E8F0" />
          <rect x="42" y="36" width="14" height="12" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

          {/* Полосатый козырек (Awning) */}
          <g transform="translate(10, 18)">
            <path d="M 0 0 L 56 0 L 52 10 L 4 10 Z" fill="#EF4444" />
            <path d="M 10 0 L 19 0 L 17 10 L 9 10 Z" fill="#FFFFFF" />
            <path d="M 28 0 L 37 0 L 35 10 L 27 10 Z" fill="#FFFFFF" />
            <path d="M 46 0 L 55 0 L 51 10 L 44 10 Z" fill="#FFFFFF" />
          </g>

          {/* Гигантская чашка кофе на крыше (как на референсе) */}
          <g transform="translate(26, -3)">
            {/* Блюдце */}
            <ellipse cx="14" cy="18" rx="16" ry="3.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            {/* Ручка чашки */}
            <path d="M 24 6 C 29 6, 29 14, 24 14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Сама чашка */}
            <path d="M 3 4 L 23 4 C 23 16, 3 16, 3 4 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Напиток кофе внутри */}
            <ellipse cx="13" cy="5" rx="9" ry="2.5" fill="#78350F" />
            <ellipse cx="13" cy="5" rx="6" ry="1.5" fill="#B45309" />
            {/* Клубящийся пар */}
            <path d="M 9 1 Q 12 -4 8 -8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 15 2 Q 18 -3 15 -7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        </g>
      )}

      {/* ОСТРОВ 2: ТЕХНО-ХАБ КИРИЛЛА */}
      {theme === 'teal' && (
        <g id="kirill-tech" transform="translate(85, 20)">
          {/* Большой центральный монитор */}
          <g transform="translate(42, 6)">
            {/* Подставка */}
            <rect x="20" y="38" width="6" height="8" rx="1" fill="#64748B" />
            <rect x="12" y="44" width="22" height="3" rx="1.5" fill="#475569" />
            {/* Корпус монитора */}
            <rect x="0" y="0" width="46" height="38" rx="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="3" />
            {/* Экран монитора */}
            <rect x="4" y="4" width="38" height="30" rx="3" fill="url(#screenGradCyan)" />
            {/* Строки интерфейса на мониторе */}
            <rect x="8" y="9" width="16" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
            <rect x="8" y="16" width="30" height="2" rx="1" fill="#0284C7" opacity="0.5" />
            <rect x="8" y="21" width="22" height="2" rx="1" fill="#0284C7" opacity="0.5" />
            <rect x="8" y="26" width="26" height="2" rx="1" fill="#0284C7" opacity="0.5" />
          </g>

          {/* Ноутбук слева */}
          <g transform="translate(10, 24)">
            {/* Крышка ноутбука */}
            <rect x="4" y="0" width="32" height="24" rx="3" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="7" y="3" width="26" height="18" rx="2" fill="url(#screenGradCyan)" />
            <rect x="10" y="7" width="12" height="2" rx="1" fill="#0284C7" />
            {/* Клавиатура */}
            <path d="M 0 24 L 40 24 L 36 29 L 4 29 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          </g>

          {/* Смартфон / планшет справа */}
          <g transform="translate(94, 22)">
            <rect x="0" y="0" width="18" height="30" rx="4" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="2.5" y="4" width="13" height="22" rx="2" fill="url(#screenGradCyan)" />
            <circle cx="9" cy="28" r="1" fill="#FFFFFF" />
          </g>

          {/* Серверная стойка / кулер позади */}
          <g transform="translate(118, 38)">
            <rect x="0" y="0" width="12" height="24" rx="2" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <rect x="2" y="4" width="8" height="2" rx="0.5" fill="#FFFFFF" />
            <rect x="2" y="9" width="8" height="2" rx="0.5" fill="#FFFFFF" />
            <circle cx="6" cy="18" r="1.5" fill="#22C55E" />
          </g>
        </g>
      )}

      {/* ОСТРОВ 3: МАСТЕРСКАЯ СОНИ */}
      {theme === 'purple' && (
        <g id="sonya-workshop" transform="translate(100, 24)">
          {/* Студия Сони */}
          <rect x="18" y="24" width="64" height="38" rx="5" fill="#F3E8FF" stroke="#6B21A8" strokeWidth="2.5" />

          {/* Фиолетовая скатная крыша */}
          <path
            d="M 12 26 L 50 6 L 88 26 Z"
            fill="#8B5CF6"
            stroke="#581C87"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Сердечко / Круглое окно на крыше */}
          <circle cx="50" cy="18" r="6.5" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="1.5" />
          <path d="M 47 18 C 47 16, 50 16, 50 18 C 50 16, 53 16, 53 18 C 53 20, 50 21, 50 22 C 50 21, 47 20, 47 18 Z" fill="#EC4899" />

          {/* Большое панорамное окно мастерской */}
          <rect x="24" y="32" width="22" height="18" rx="2" fill="#E9D5FF" stroke="#7C3AED" strokeWidth="1" />
          <line x1="35" y1="32" x2="35" y2="50" stroke="#7C3AED" strokeWidth="1" />
          <line x1="24" y1="41" x2="46" y2="41" stroke="#7C3AED" strokeWidth="1" />

          {/* Дверь студии */}
          <rect x="54" y="34" width="18" height="28" rx="3" fill="#6B21A8" />
          <circle cx="68" cy="48" r="1.5" fill="#FDE047" />
        </g>
      )}

      {/* ОСТРОВ 4: МЕГАПОЛИС */}
      {theme === 'blue' && (
        <g id="metropolis-skyline" transform="translate(70, 10)">
          {/* 1. Желтый небоскреб слева */}
          <rect x="15" y="36" width="26" height="60" rx="3" fill="url(#skyScraperYellow)" stroke="#CA8A04" strokeWidth="1.5" />
          <g fill="#FFFFFF" opacity="0.8">
            <rect x="19" y="42" width="6" height="4" rx="1" />
            <rect x="30" y="42" width="6" height="4" rx="1" />
            <rect x="19" y="52" width="6" height="4" rx="1" />
            <rect x="30" y="52" width="6" height="4" rx="1" />
            <rect x="19" y="62" width="6" height="4" rx="1" />
            <rect x="30" y="62" width="6" height="4" rx="1" />
            <rect x="19" y="72" width="6" height="4" rx="1" />
            <rect x="30" y="72" width="6" height="4" rx="1" />
          </g>

          {/* 2. Высокий голубой небоскреб */}
          <rect x="46" y="10" width="28" height="86" rx="3" fill="url(#skyScraperCyan)" stroke="#0284C7" strokeWidth="1.5" />
          <g fill="#FFFFFF" opacity="0.85">
            <rect x="50" y="18" width="6" height="5" rx="1" />
            <rect x="63" y="18" width="6" height="5" rx="1" />
            <rect x="50" y="28" width="6" height="5" rx="1" />
            <rect x="63" y="28" width="6" height="5" rx="1" />
            <rect x="50" y="38" width="6" height="5" rx="1" />
            <rect x="63" y="38" width="6" height="5" rx="1" />
            <rect x="50" y="48" width="6" height="5" rx="1" />
            <rect x="63" y="48" width="6" height="5" rx="1" />
            <rect x="50" y="58" width="6" height="5" rx="1" />
            <rect x="63" y="58" width="6" height="5" rx="1" />
          </g>

          {/* 3. Синий небоскреб по центру */}
          <rect x="79" y="24" width="28" height="72" rx="3" fill="url(#skyScraperBlue)" stroke="#1D4ED8" strokeWidth="1.5" />
          <g fill="#93C5FD" opacity="0.9">
            <rect x="84" y="32" width="8" height="5" rx="1" />
            <rect x="95" y="32" width="7" height="5" rx="1" />
            <rect x="84" y="42" width="8" height="5" rx="1" />
            <rect x="95" y="42" width="7" height="5" rx="1" />
            <rect x="84" y="52" width="8" height="5" rx="1" />
            <rect x="95" y="52" width="7" height="5" rx="1" />
            <rect x="84" y="62" width="8" height="5" rx="1" />
            <rect x="95" y="62" width="7" height="5" rx="1" />
          </g>

          {/* 4. Фиолетовый небоскреб справа */}
          <rect x="112" y="18" width="24" height="78" rx="3" fill="url(#skyScraperPurple)" stroke="#6B21A8" strokeWidth="1.5" />
          <g fill="#F3E8FF" opacity="0.9">
            <rect x="116" y="26" width="6" height="4" rx="1" />
            <rect x="126" y="26" width="6" height="4" rx="1" />
            <rect x="116" y="36" width="6" height="4" rx="1" />
            <rect x="126" y="36" width="6" height="4" rx="1" />
            <rect x="116" y="46" width="6" height="4" rx="1" />
            <rect x="126" y="46" width="6" height="4" rx="1" />
            <rect x="116" y="56" width="6" height="4" rx="1" />
            <rect x="126" y="56" width="6" height="4" rx="1" />
          </g>

          {/* 5. Розовый небоскреб с краю */}
          <rect x="140" y="44" width="22" height="52" rx="3" fill="url(#skyScraperPink)" stroke="#BE185D" strokeWidth="1.5" />
          <g fill="#FCE7F3" opacity="0.9">
            <rect x="144" y="52" width="6" height="4" rx="1" />
            <rect x="153" y="52" width="6" height="4" rx="1" />
            <rect x="144" y="62" width="6" height="4" rx="1" />
            <rect x="153" y="62" width="6" height="4" rx="1" />
          </g>
        </g>
      )}
    </svg>
  );
};
