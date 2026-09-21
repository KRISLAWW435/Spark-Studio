// src/pages/WorldMap.tsx
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Header } from '../components/Header';
import { QuickAccessBar } from '../components/QuickAccessBar';
import { BackpackModal } from '../components/ui/BackpackModal';
import { SparkFlameCore } from '../components/common/SparkFlameCore';
import { 
  WORLD_LOCATIONS, 
  INITIAL_PLAYER_STATE, 
  PlayerWorldState,
  WorldLocation
} from '../data/worldMap';
import { usePersistentState } from '../hooks/usePersistentState';
import { sound } from '../utils/soundManager';
import { useSpeech } from '../hooks/useSpeech';
import { Lock, Sparkles, X, ChevronRight } from 'lucide-react';

interface OutletContextType {
  openSidebar?: () => void;
}

export function WorldMap() {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const outletCtx = useOutletContext<OutletContextType>();

  const [playerState] = usePersistentState<PlayerWorldState>('player_world_state_v1', INITIAL_PLAYER_STATE);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [lockedLocationModal, setLockedLocationModal] = useState<WorldLocation | null>(null);

  // Переход на локацию или показ превью
  const handleLocationClick = (locationId: string) => {
    const loc = WORLD_LOCATIONS.find((l) => l.id === locationId);
    if (!loc) {
      navigate(`/location/${locationId}`);
      return;
    }

    if (loc.status === 'locked') {
      sound.playError();
      setLockedLocationModal(loc);
      speak(`Сектор «${loc.title}» пока закрыт. Он станет доступен в следующем спринте!`);
      return;
    }

    sound.playSuccess();
    speak(`Отправляемся к ${loc.character?.name || loc.title}!`);
    navigate(`/location/${loc.id}`);
  };

  const handleSparkClick = () => {
    sound.playSuccess();
    speak('Привет! Выбирай остров: Кофейня Мари, Техно-хаб Кирилла или Мастерская Сони! А впереди нас ждут Неоновый мегаполис и Башня Арт-директора!');
  };

  return (
    <div className="w-full h-screen min-h-[600px] flex flex-col items-center justify-between p-2 sm:p-3 md:p-4 bg-[#FBF3E4] select-none overflow-hidden animate-in fade-in duration-300">
      <div className="w-full max-w-[1440px] h-full flex flex-col justify-between">
        {/* 1. ВЕРХНИЙ ХЕДЕР */}
      <Header 
        coins={playerState.coins} 
        backpackCount={playerState.backpack.length} 
        onBackpackClick={() => {
          sound.playClick();
          setIsBackpackOpen(true);
        }}
        onMenuClick={() => {
          sound.playClick();
          outletCtx?.openSidebar?.();
        }}
      />

      {/* 2. ЦЕНТРАЛЬНОЕ ИГРОВОЕ ОКНО С КАРТОЙ МИРА */}
      <div className="relative flex-1 w-full my-2 sm:my-2.5 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/80 bg-gradient-to-b from-[#1472D4] via-[#2D9DEE] to-[#7ED4FD] flex items-center justify-center">
        
        {/* Верхний бейдж мира */}
        <div className="absolute top-3.5 left-4 z-20 pointer-events-none flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-slate-800 font-black text-xs sm:text-sm border border-white/80">
          <span className="text-base text-cyan-500 animate-spin" style={{ animationDuration: '8s' }}>🌀</span>
          <span>Архипелаг UX • 5 островов</span>
        </div>

        {/* ======================================================== */}
        {/* КАРТА SVG ВЫСОКОЙ ДЕТАЛИЗАЦИИ (1280 x 700) */}
        {/* ======================================================== */}
        <svg 
          viewBox="0 0 1280 700" 
          className="w-full h-full object-contain overflow-visible select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Небесный градиент */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1472D4" />
              <stop offset="40%" stopColor="#2D9DEE" />
              <stop offset="80%" stopColor="#66C6FC" />
              <stop offset="100%" stopColor="#A8E4FE" />
            </linearGradient>

            {/* Мягкие объемные тени */}
            <filter id="islandShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#024D82" floodOpacity="0.45" />
            </filter>
            <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#091E42" floodOpacity="0.3" />
            </filter>
            <filter id="cloudSoftShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0284C7" floodOpacity="0.2" />
            </filter>

            {/* Неоновое свечение Техно-хаба */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feFlood floodColor="#38BDF8" floodOpacity="0.9" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Фиолетовое неоновое свечение Мегаполиса */}
            <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feFlood floodColor="#C084FC" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Золотое сияние Цитадели */}
            <filter id="goldAura" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feFlood floodColor="#FDE047" floodOpacity="0.75" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Градиенты пород островов */}
            {/* 1. Мари: Теплый песчаник и терракота */}
            <linearGradient id="mariTopGrass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="mariRockStrata" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="40%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>

            {/* 2. Кирилл: Бирюзовый кибер-кристалл */}
            <linearGradient id="kirillTopGrass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id="kirillRockStrata" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="50%" stopColor="#0E7490" />
              <stop offset="100%" stopColor="#164E63" />
            </linearGradient>

            {/* 3. Соня: Аметистовый творческий кристалл */}
            <linearGradient id="sonyaTopGrass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="sonyaRockStrata" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="50%" stopColor="#7E22CE" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>

            {/* 4. Неоновый Мегаполис: Обсидиан и темная сталь */}
            <linearGradient id="cyberTopPlatform" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="cyberRockStrata" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#020617" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            {/* 5. Башня Арт-директора: Слоновая кость и чистое золото */}
            <linearGradient id="citadelTopMarble" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>
            <linearGradient id="citadelRockStrata" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="40%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Золотой градиент замка */}
            <linearGradient id="goldLockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Фон неба */}
          <rect width="1280" height="700" fill="url(#skyGrad)" />

          {/* ======================================================== */}
          {/* СЛОЙ 1: ФОНОВЫЕ ДАЛЬНИЕ ОБЛАКА И СОЗВЕЗДИЯ (ВНЕ ЗОНЫ ОСТРОВОВ) */}
          {/* ======================================================== */}
          {/* Верхнее левое облако */}
          <g transform="translate(80, 25)" opacity="0.7" filter="url(#cloudSoftShadow)">
            <ellipse cx="70" cy="30" rx="90" ry="24" fill="#FFFFFF" />
            <ellipse cx="40" cy="20" rx="45" ry="18" fill="#FFFFFF" />
            <ellipse cx="105" cy="18" rx="40" ry="16" fill="#FFFFFF" />
            <ellipse cx="70" cy="38" rx="70" ry="10" fill="#BAE6FD" opacity="0.4" />
          </g>

          {/* Верхнее центральное облако */}
          <g transform="translate(560, 20)" opacity="0.65" filter="url(#cloudSoftShadow)">
            <ellipse cx="80" cy="25" rx="85" ry="20" fill="#FFFFFF" />
            <ellipse cx="50" cy="16" rx="40" ry="14" fill="#FFFFFF" />
            <ellipse cx="110" cy="16" rx="35" ry="14" fill="#FFFFFF" />
          </g>

          {/* Верхнее правое облако */}
          <g transform="translate(1000, 30)" opacity="0.75" filter="url(#cloudSoftShadow)">
            <ellipse cx="85" cy="30" rx="95" ry="24" fill="#FFFFFF" />
            <ellipse cx="50" cy="18" rx="50" ry="18" fill="#FFFFFF" />
            <ellipse cx="120" cy="20" rx="45" ry="16" fill="#FFFFFF" />
            <ellipse cx="85" cy="38" rx="75" ry="10" fill="#BAE6FD" opacity="0.4" />
          </g>

          {/* Золотые мерцающие звездочки */}
          <g fill="#FDE047">
            <circle cx="340" cy="90" r="3" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="360" cy="115" r="2" />
            <circle cx="680" cy="70" r="2.5" />
            <circle cx="705" cy="95" r="3" className="animate-pulse" />
            <circle cx="1180" cy="130" r="2.5" />
            <circle cx="120" cy="280" r="2.5" />
          </g>

          {/* Геометрическое созвездие слева */}
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3,3">
            <line x1="70" y1="210" x2="105" y2="195" />
            <line x1="105" y1="195" x2="135" y2="225" />
            <line x1="135" y1="225" x2="155" y2="215" />
            <circle cx="70" cy="210" r="2.5" fill="#FFFFFF" />
            <circle cx="105" cy="195" r="2.5" fill="#FFFFFF" />
            <circle cx="135" cy="225" r="2.5" fill="#FFFFFF" />
            <circle cx="155" cy="215" r="2.5" fill="#FFFFFF" />
          </g>

          {/* ======================================================== */}
          {/* СЛОЙ 2: ПУНКТИРНЫЕ ТРАЕКТОРИИ ПОЛЕТОВ МЕЖДУ ОСТРОВАМИ */}
          {/* ======================================================== */}
          {/* Траектория 1: Мари (210, 390) -> Кирилл (460, 200) */}
          <g>
            <path
              d="M 280 340 Q 360 250 430 220"
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="6"
              strokeDasharray="12,10"
              strokeLinecap="round"
              transform="translate(0, 3)"
            />
            <path
              d="M 280 340 Q 360 250 430 220"
              fill="none"
              stroke="#FDE047"
              strokeWidth="5"
              strokeDasharray="12,10"
              strokeLinecap="round"
            />
          </g>

          {/* Траектория 2: Кирилл (460, 200) -> Соня (1010, 330) */}
          <g>
            <path
              d="M 540 220 Q 750 180 940 310"
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="6"
              strokeDasharray="12,10"
              strokeLinecap="round"
              transform="translate(0, 3)"
            />
            <path
              d="M 540 220 Q 750 180 940 310"
              fill="none"
              stroke="#FDE047"
              strokeWidth="5"
              strokeDasharray="12,10"
              strokeLinecap="round"
            />
          </g>

          {/* Траектория 3: Кирилл (460, 200) -> Неоновый Мегаполис (580, 490) */}
          <g>
            <path
              d="M 480 270 Q 510 370 550 430"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeDasharray="8,8"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Траектория 4: Мегаполис (580, 490) -> Башня Арт-директора (790, 120) */}
          <g>
            <path
              d="M 640 440 Q 730 330 770 200"
              fill="none"
              stroke="#A855F7"
              strokeWidth="4"
              strokeDasharray="8,8"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Траектория 5: Соня (1010, 330) -> Башня Арт-директора (790, 120) */}
          <g>
            <path
              d="M 950 280 Q 890 190 840 160"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="4"
              strokeDasharray="8,8"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Серебристый замок на пути к Мегаполису */}
          <g 
            transform="translate(520, 350)" 
            className="cursor-pointer group select-none" 
            onClick={() => handleLocationClick('cyber_metropolis')}
          >
            <circle r="16" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" filter="url(#badgeShadow)" />
            <path d="M -5 -3 A 5 5 0 0 1 5 -3 V 1 H 3 V -3 A 3 3 0 0 0 -3 -3 V 1 H -5 Z" fill="#64748B" />
            <rect x="-8" y="0" width="16" height="12" rx="3" fill="#64748B" />
            <circle cx="0" cy="5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Золотой замок на пути к Цитадели Арт-директора */}
          <g 
            transform="translate(890, 210)" 
            className="cursor-pointer group select-none" 
            onClick={() => handleLocationClick('art_director_citadel')}
          >
            <circle r="18" fill="#FEF08A" stroke="#B45309" strokeWidth="2.5" filter="url(#badgeShadow)" />
            <path d="M -6 -4 A 6 6 0 0 1 6 -4 V 2 H 4 V -4 A 4 4 0 0 0 -4 -4 V 2 H -6 Z" fill="#B45309" />
            <rect x="-9" y="1" width="18" height="14" rx="3.5" fill="url(#goldLockGrad)" stroke="#78350F" strokeWidth="1" />
            <circle cx="0" cy="7" r="2" fill="#78350F" />
          </g>


          {/* ======================================================== */}
          {/* СЛОЙ 3: 5 3D-РЕАЛИСТИЧНЫХ ПАРЯЩИХ ОСТРОВОВ */}
          {/* ======================================================== */}

          {/* -------------------------------------------------------- */}
          {/* 1. ОСТРОВ: КОФЕЙНЯ МАРИ (X: 210, Y: 390) */}
          {/* -------------------------------------------------------- */}
          <g 
            id="island-cafe_marie"
            transform="translate(210, 390)" 
            className="cursor-pointer group select-none"
            onClick={() => handleLocationClick('cafe_marie')}
          >
            {/* Парящая тень на облаках */}
            <ellipse cx="0" cy="115" rx="125" ry="32" fill="#024D82" opacity="0.32" filter="url(#islandShadow)" />

            {/* Подвешенные мелкие летающие камушки */}
            <g opacity="0.85">
              <ellipse cx="-135" cy="50" rx="9" ry="6" fill="#C2410C" />
              <ellipse cx="-135" cy="48" rx="8" ry="4" fill="#FB923C" />
              <ellipse cx="130" cy="65" rx="11" ry="7" fill="#C2410C" />
              <ellipse cx="130" cy="63" rx="10" ry="5" fill="#FB923C" />
            </g>

            {/* 3D Толща скалистого острова (Strata layers) */}
            {/* Нижний скалистый пик со сталактитами */}
            <path
              d="
                M -120 0 
                C -125 35, -95 85, -50 115
                C -20 135, 0 145, 10 148
                C 25 142, 60 110, 95 75
                C 120 40, 125 15, 120 0
                Z
              "
              fill="url(#mariRockStrata)"
            />

            {/* Каменные складки и прожилки в толще породы */}
            <path d="M -80 30 Q -40 90 5 140" stroke="#7C2D12" strokeWidth="2.5" fill="none" opacity="0.7" />
            <path d="M 40 25 Q 60 70 85 90" stroke="#7C2D12" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M -30 20 Q -10 60 12 110" stroke="#7C2D12" strokeWidth="1.8" fill="none" opacity="0.7" />

            {/* Верхний свежий слой земли с сочной травяной шапкой */}
            <path
              d="
                M -125 -10
                C -130 -30, -80 -45, -20 -45
                C 40 -45, 125 -35, 125 -10
                C 125 15, 60 25, 0 25
                C -60 25, -125 15, -125 -10 Z
              "
              fill="url(#mariTopGrass)"
              stroke="#FFF7ED"
              strokeWidth="2"
              className="group-hover:brightness-105 transition-all"
            />

            {/* Мощеная каменная дорожка */}
            <path d="M -40 -8 Q 0 5 35 -5" stroke="#FED7AA" strokeWidth="6" strokeDasharray="5,3" fill="none" />

            {/* Здание Кофейни Мари (3D European Cafe) */}
            <g transform="translate(-30, -95)">
              {/* Тень от здания */}
              <ellipse cx="32" cy="72" rx="42" ry="12" fill="#7C2D12" opacity="0.3" />

              {/* Стены кофейни */}
              <rect x="0" y="24" width="65" height="46" rx="4" fill="#FFFBEB" stroke="#B45309" strokeWidth="2" />

              {/* Двускатная черепичная крыша с текстурой */}
              <polygon points="32.5,2 -8,25 73,25" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <polygon points="32.5,5 -3,24 68,24" fill="#D97706" />
              {/* Полоски черепицы */}
              <line x1="8" y1="18" x2="57" y2="18" stroke="#78350F" strokeWidth="1.5" />
              <line x1="16" y1="11" x2="49" y2="11" stroke="#78350F" strokeWidth="1.5" />

              {/* Кирпичная печная труба с клубящимся паром */}
              <rect x="46" y="-6" width="10" height="18" rx="1.5" fill="#991B1B" stroke="#7F1D1D" strokeWidth="1.2" />
              <ellipse cx="51" cy="-14" rx="4" ry="3" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="54" cy="-22" rx="6" ry="4" fill="#FFFFFF" opacity="0.6" />

              {/* Полосатый маркиз кофейни */}
              <g transform="translate(3, 26)">
                <rect x="0" y="0" width="59" height="14" fill="#EA580C" rx="2" />
                <rect x="9" y="0" width="9" height="14" fill="#FFFFFF" />
                <rect x="27" y="0" width="9" height="14" fill="#FFFFFF" />
                <rect x="45" y="0" width="9" height="14" fill="#FFFFFF" />
              </g>

              {/* Входная дверь и светящееся окно */}
              <rect x="24" y="44" width="18" height="26" rx="2" fill="#78350F" />
              <rect x="27" y="47" width="12" height="10" fill="#FEF08A" opacity="0.9" />
              <rect x="5" y="45" width="14" height="16" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              <line x1="12" y1="45" x2="12" y2="61" stroke="#B45309" strokeWidth="1" />

              {/* Дымящаяся фирменная чашка кофе на вывеске */}
              <g transform="translate(24, -2)">
                <rect x="2" y="3" width="14" height="10" rx="2.5" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
                <path d="M 16 5 Q 21 8 16 11" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                <path d="M 6 0 Q 5 -3 8 -5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M 11 0 Q 13 -3 11 -6" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            </g>

            {/* Терраса со столиком и зонтиком */}
            <g transform="translate(48, -45)">
              <ellipse cx="12" cy="15" rx="14" ry="6" fill="#78350F" opacity="0.25" />
              {/* Столик */}
              <ellipse cx="12" cy="8" rx="9" ry="5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
              <line x1="12" y1="8" x2="12" y2="15" stroke="#78350F" strokeWidth="2" />
              {/* Чашка на столике */}
              <rect x="10" y="4" width="4" height="4" rx="1" fill="#FFFFFF" />
            </g>

            {/* Объемные пышные зеленые 3D-деревья */}
            <g transform="translate(-95, -60)">
              <rect x="9" y="18" width="5" height="16" rx="2" fill="#78350F" />
              <circle cx="11.5" cy="12" r="17" fill="#15803D" />
              <circle cx="14.5" cy="8" r="13" fill="#22C55E" />
              <circle cx="16.5" cy="5" r="7" fill="#86EFAC" opacity="0.8" />
            </g>
            <g transform="translate(-60, -75)">
              <rect x="7" y="14" width="4" height="12" rx="1.5" fill="#78350F" />
              <circle cx="9" cy="10" r="13" fill="#166534" />
              <circle cx="11" cy="7" r="10" fill="#16A34A" />
            </g>

            {/* Аватар Мари и табличка */}
            <g transform="translate(0, 15)">
              <circle r="36" fill="#FB923C" stroke="#FFFFFF" strokeWidth="4" filter="url(#badgeShadow)" className="group-hover:scale-110 transition-transform" />
              <text textAnchor="middle" dy="13" fontSize="36" className="pointer-events-none">👩‍🦰</text>
            </g>
            <g transform="translate(0, 68)">
              <rect x="-65" y="-13" width="130" height="26" rx="13" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="2" filter="url(#badgeShadow)" />
              <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="#1E293B">Кофейня Мари</text>
            </g>
          </g>


          {/* -------------------------------------------------------- */}
          {/* 2. ОСТРОВ: ТЕХНО-ХАБ КИРИЛЛА (X: 460, Y: 200) */}
          {/* -------------------------------------------------------- */}
          <g 
            id="island-tech_kirill"
            transform="translate(460, 200)" 
            className="cursor-pointer group select-none"
            onClick={() => handleLocationClick('tech_kirill')}
          >
            {/* Тень острова */}
            <ellipse cx="0" cy="110" rx="125" ry="30" fill="#024D82" opacity="0.35" filter="url(#islandShadow)" />

            {/* Парящие кристаллы */}
            <polygon points="-130,30 -125,20 -120,30 -125,40" fill="#38BDF8" filter="url(#cyanGlow)" />
            <polygon points="125,45 130,35 135,45 130,55" fill="#38BDF8" filter="url(#cyanGlow)" />

            {/* Толща скалы с бирюзовыми неоновыми платами */}
            <path
              d="
                M -120 0 
                C -125 40, -90 90, -45 118
                C -15 135, 5 142, 12 144
                C 30 135, 65 105, 95 70
                C 120 40, 125 15, 120 0
                Z
              "
              fill="url(#kirillRockStrata)"
            />

            {/* Неоновые линии схем в скале */}
            <path d="M -70 25 L -50 60 L -30 60 L -10 110" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.85" filter="url(#cyanGlow)" />
            <path d="M 30 20 L 50 50 L 70 50 L 80 80" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.85" filter="url(#cyanGlow)" />
            <circle cx="-10" cy="110" r="3" fill="#67E8F9" />
            <circle cx="80" cy="80" r="3" fill="#67E8F9" />

            {/* Поверхность техно-острова с неоновым свечением */}
            <path
              d="
                M -125 -10
                C -130 -30, -80 -45, -20 -45
                C 40 -45, 125 -35, 125 -10
                C 125 15, 60 25, 0 25
                C -60 25, -125 15, -125 -10 Z
              "
              fill="url(#kirillTopGrass)"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              filter="url(#cyanGlow)"
              className="group-hover:brightness-110 transition-all"
            />

            {/* Сетка высокотехнологичных гексагонов на платформе */}
            <g stroke="#0891B2" strokeWidth="1" fill="none" opacity="0.5">
              <polygon points="0,-15 10,-9 10,3 0,9 -10,3 -10,-9" />
              <polygon points="20,-15 30,-9 30,3 20,9 10,3 10,-9" />
              <polygon points="-20,-15 -10,-9 -10,3 -20,9 -30,3 -30,-9" />
            </g>

            {/* Лабораторный комплекс и мониторы Кирилла */}
            <g transform="translate(-40, -100)">
              {/* Главный серверный купол */}
              <ellipse cx="40" cy="65" rx="35" ry="12" fill="#0F172A" opacity="0.3" />
              <path d="M 10 65 C 10 35, 70 35, 70 65 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <ellipse cx="40" cy="45" rx="16" ry="7" fill="#38BDF8" opacity="0.4" />

              {/* Центральный ультраширокий монитор с кодом/дизайном */}
              <rect x="22" y="32" width="36" height="24" rx="2.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="26" y1="38" x2="42" y2="38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="44" x2="52" y2="44" stroke="#67E8F9" strokeWidth="1.2" />
              <line x1="26" y1="49" x2="46" y2="49" stroke="#67E8F9" strokeWidth="1.2" />

              {/* Левый вспомогательный монитор */}
              <rect x="-4" y="40" width="22" height="18" rx="2" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.2" />
              <line x1="-1" y1="46" x2="14" y2="46" stroke="#FEF08A" strokeWidth="1.2" />
              <line x1="-1" y1="51" x2="10" y2="51" stroke="#FFFFFF" strokeWidth="1.2" />

              {/* Спутниковая тарелка и антенна */}
              <g transform="translate(68, 30)">
                <line x1="6" y1="20" x2="6" y2="4" stroke="#64748B" strokeWidth="2" />
                <path d="M 0 10 Q 6 2 12 10" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <circle cx="6" cy="3" r="2.5" fill="#F43F5E" className="animate-ping" style={{ animationDuration: '2s' }} />
              </g>

              {/* Серверная стойка справа с мигающими огнями */}
              <rect x="76" y="44" width="18" height="26" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx="81" cy="50" r="1.5" fill="#22C55E" />
              <circle cx="86" cy="50" r="1.5" fill="#38BDF8" />
              <circle cx="81" cy="56" r="1.5" fill="#FACC15" />
              <circle cx="86" cy="56" r="1.5" fill="#22C55E" />
              <circle cx="81" cy="62" r="1.5" fill="#EF4444" />
            </g>

            {/* Аватар Кирилла и табличка */}
            <g transform="translate(0, 15)">
              <circle r="36" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="4" filter="url(#badgeShadow)" className="group-hover:scale-110 transition-transform" />
              <text textAnchor="middle" dy="13" fontSize="36" className="pointer-events-none">🧑‍💻</text>
            </g>
            <g transform="translate(0, 68)">
              <rect x="-72" y="-13" width="144" height="26" rx="13" fill="#FFFFFF" stroke="#67E8F9" strokeWidth="2" filter="url(#badgeShadow)" />
              <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="#1E293B">Техно-хаб Кирилла</text>
            </g>
          </g>


          {/* -------------------------------------------------------- */}
          {/* 3. ОСТРОВ: МАСТЕРСКАЯ СОНИ (X: 1010, Y: 330) */}
          {/* -------------------------------------------------------- */}
          <g 
            id="island-art_sonya"
            transform="translate(1010, 330)" 
            className="cursor-pointer group select-none"
            onClick={() => handleLocationClick('art_sonya')}
          >
            {/* Тень */}
            <ellipse cx="0" cy="115" rx="125" ry="32" fill="#024D82" opacity="0.32" filter="url(#islandShadow)" />

            {/* Парящие аметистовые кристаллы */}
            <polygon points="-125,35 -120,20 -115,35 -120,45" fill="#C084FC" />
            <polygon points="120,30 125,18 130,30 125,40" fill="#E879F9" />

            {/* Скалистая толща острова с кристаллическими фиолетовыми жилами */}
            <path
              d="
                M -120 0 
                C -125 35, -95 85, -50 115
                C -20 135, 0 145, 10 148
                C 25 142, 60 110, 95 75
                C 120 40, 125 15, 120 0
                Z
              "
              fill="url(#sonyaRockStrata)"
            />

            {/* Радужный водопад вдохновения, стекающий с края скалы */}
            <g opacity="0.85">
              <path d="M 75 10 Q 82 50 80 90 Q 78 120 85 145" stroke="#E879F9" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 80 12 Q 86 52 84 92 Q 82 122 88 145" stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="85" cy="148" rx="8" ry="4" fill="#FFFFFF" opacity="0.7" />
            </g>

            {/* Травяная поверхность острова Сони */}
            <path
              d="
                M -125 -10
                C -130 -30, -80 -45, -20 -45
                C 40 -45, 125 -35, 125 -10
                C 125 15, 60 25, 0 25
                C -60 25, -125 15, -125 -10 Z
              "
              fill="url(#sonyaTopGrass)"
              stroke="#FDF4FF"
              strokeWidth="2"
              className="group-hover:brightness-105 transition-all"
            />

            {/* Арт-павильон Сони с витражами и мольбертом */}
            <g transform="translate(-40, -95)">
              {/* Стеклянный павильон */}
              <rect x="0" y="22" width="68" height="46" rx="4" fill="#FAF5FF" stroke="#7E22CE" strokeWidth="2" />
              <polygon points="34,4 -6,22 74,22" fill="#7E22CE" stroke="#581C87" strokeWidth="1.5" />
              
              {/* Панорамные окна студии с фиолетовым отблеском */}
              <rect x="6" y="30" width="24" height="28" rx="2" fill="#E9D5FF" stroke="#9333EA" strokeWidth="1.2" />
              <rect x="38" y="30" width="24" height="28" rx="2" fill="#E9D5FF" stroke="#9333EA" strokeWidth="1.2" />
              <line x1="18" y1="30" x2="18" y2="58" stroke="#9333EA" strokeWidth="1" />
              <line x1="50" y1="30" x2="50" y2="58" stroke="#9333EA" strokeWidth="1" />

              {/* Большой деревянный мольберт с картиной перед входом */}
              <g transform="translate(-30, 24)">
                {/* Ножки мольберта */}
                <line x1="4" y1="36" x2="12" y2="8" stroke="#78350F" strokeWidth="2" />
                <line x1="20" y1="36" x2="12" y2="8" stroke="#78350F" strokeWidth="2" />
                {/* Холст на мольберте с закатным градиентом */}
                <rect x="2" y="10" width="20" height="16" rx="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
                <circle cx="8" cy="16" r="3" fill="#F43F5E" />
                <polygon points="2,26 12,18 22,26" fill="#38BDF8" opacity="0.8" />
              </g>

              {/* Палитра красок на крыше студии */}
              <g transform="translate(24, -8)">
                <ellipse cx="10" cy="6" rx="12" ry="7" fill="#FFFFFF" stroke="#7E22CE" strokeWidth="1.5" />
                <circle cx="5" cy="5" r="2" fill="#EC4899" />
                <circle cx="10" cy="4" r="2" fill="#EAB308" />
                <circle cx="15" cy="6" r="2" fill="#06B6D4" />
              </g>
            </g>

            {/* Классическая греческая мраморная колонна */}
            <g transform="translate(48, -48)">
              <rect x="0" y="8" width="10" height="24" fill="#FFFFFF" stroke="#7E22CE" strokeWidth="1" />
              <rect x="-2" y="5" width="14" height="4" fill="#FFFFFF" stroke="#7E22CE" strokeWidth="1" />
              <rect x="-2" y="31" width="14" height="4" fill="#FFFFFF" stroke="#7E22CE" strokeWidth="1" />
            </g>

            {/* Фиолетовые цветущие деревца */}
            <g transform="translate(-85, -55)">
              <rect x="8" y="16" width="4" height="12" fill="#581C87" rx="1" />
              <circle cx="10" cy="10" r="14" fill="#A855F7" />
              <circle cx="13" cy="7" r="10" fill="#E879F9" />
            </g>

            {/* Аватар Сони и табличка */}
            <g transform="translate(0, 15)">
              <circle r="36" fill="#A855F7" stroke="#FFFFFF" strokeWidth="4" filter="url(#badgeShadow)" className="group-hover:scale-110 transition-transform" />
              <text textAnchor="middle" dy="13" fontSize="36" className="pointer-events-none">👩‍🎨</text>
            </g>
            <g transform="translate(0, 68)">
              <rect x="-68" y="-13" width="136" height="26" rx="13" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="2" filter="url(#badgeShadow)" />
              <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="#1E293B">Мастерская Сони</text>
            </g>
          </g>


          {/* -------------------------------------------------------- */}
          {/* 4. ОСТРОВ: НЕОНОВЫЙ МЕГАПОЛИС (X: 580, Y: 490) */}
          {/* -------------------------------------------------------- */}
          <g 
            id="island-cyber_metropolis"
            transform="translate(580, 490)" 
            className="cursor-pointer group select-none"
            onClick={() => handleLocationClick('cyber_metropolis')}
          >
            {/* Тень */}
            <ellipse cx="0" cy="115" rx="135" ry="34" fill="#024D82" opacity="0.38" filter="url(#islandShadow)" />

            {/* Сопла гравитационных двигателей под платформой с голубым пламенем */}
            <g opacity="0.75">
              <polygon points="-50,90 -45,130 -40,90" fill="#38BDF8" filter="url(#cyanGlow)" />
              <polygon points="40,90 45,130 50,90" fill="#38BDF8" filter="url(#cyanGlow)" />
            </g>

            {/* Темная обсидиановая скалистая толща острова со светящимися кабелями */}
            <path
              d="
                M -130 0 
                C -135 40, -100 85, -50 115
                C -20 135, 0 145, 10 148
                C 25 142, 70 110, 105 75
                C 130 40, 135 15, 130 0
                Z
              "
              fill="url(#cyberRockStrata)"
            />

            {/* Неоновые светящиеся магистрали в скале */}
            <path d="M -90 20 Q -40 80 5 120" stroke="#C084FC" strokeWidth="2.2" fill="none" opacity="0.8" filter="url(#cyberGlow)" />
            <path d="M 40 25 Q 70 65 95 85" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.85" filter="url(#cyanGlow)" />

            {/* Темная платформа мегаполиса с неоновым контуром */}
            <path
              d="
                M -135 -10
                C -140 -30, -90 -45, -20 -45
                C 40 -45, 135 -35, 135 -10
                C 135 15, 70 25, 0 25
                C -70 25, -135 15, -135 -10 Z
              "
              fill="url(#cyberTopPlatform)"
              stroke="#38BDF8"
              strokeWidth="2"
              filter="url(#cyberGlow)"
              className="group-hover:brightness-110 transition-all"
            />

            {/* Силуэты футуристических стеклянных небоскребов */}
            <g transform="translate(-70, -115)">
              {/* Небоскреб 1 (Левый) */}
              <rect x="0" y="24" width="28" height="66" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Светящиеся окна */}
              <rect x="4" y="32" width="6" height="5" fill="#38BDF8" />
              <rect x="16" y="32" width="6" height="5" fill="#FEF08A" />
              <rect x="4" y="44" width="6" height="5" fill="#C084FC" />
              <rect x="16" y="44" width="6" height="5" fill="#38BDF8" />
              <rect x="4" y="56" width="6" height="5" fill="#FEF08A" />
              <rect x="16" y="56" width="6" height="5" fill="#C084FC" />

              {/* Небоскреб 2 (Главная башня) */}
              <rect x="34" y="0" width="36" height="90" rx="3" fill="#1E1B4B" stroke="#C084FC" strokeWidth="2" />
              <polygon points="52,-15 42,0 62,0" fill="#C084FC" />
              <line x1="52" y1="-15" x2="52" y2="-28" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="52" cy="-28" r="2.5" fill="#F43F5E" className="animate-ping" style={{ animationDuration: '1.5s' }} />

              {/* Сетка окон главной башни */}
              <g fill="#67E8F9" opacity="0.9">
                <rect x="38" y="10" width="6" height="6" />
                <rect x="49" y="10" width="6" height="6" fill="#FDE047" />
                <rect x="60" y="10" width="6" height="6" />
                <rect x="38" y="24" width="6" height="6" fill="#F472B6" />
                <rect x="49" y="24" width="6" height="6" />
                <rect x="60" y="24" width="6" height="6" fill="#FDE047" />
                <rect x="38" y="38" width="6" height="6" />
                <rect x="49" y="38" width="6" height="6" fill="#F472B6" />
                <rect x="60" y="38" width="6" height="6" />
              </g>

              {/* Небоскреб 3 (Правый скошенный) */}
              <rect x="76" y="18" width="30" height="72" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <polygon points="76,18 106,8 106,18" fill="#38BDF8" opacity="0.8" />
              <rect x="82" y="26" width="6" height="5" fill="#FDE047" />
              <rect x="94" y="26" width="6" height="5" fill="#38BDF8" />
              <rect x="82" y="38" width="6" height="5" fill="#C084FC" />
              <rect x="94" y="38" width="6" height="5" fill="#FDE047" />
              <rect x="82" y="50" width="6" height="5" fill="#38BDF8" />
              <rect x="94" y="50" width="6" height="5" fill="#C084FC" />

              {/* Парящий голографический график над башнями (FinTech & UX Data) */}
              <g transform="translate(10, -32)">
                <rect x="0" y="0" width="55" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" opacity="0.9" filter="url(#cyanGlow)" />
                {/* Столбики графика */}
                <rect x="6" y="12" width="6" height="8" fill="#34D399" />
                <rect x="16" y="8" width="6" height="12" fill="#38BDF8" />
                <rect x="26" y="5" width="6" height="15" fill="#FBBF24" />
                <rect x="36" y="2" width="6" height="18" fill="#F43F5E" />
                {/* Трендовая линия */}
                <path d="M 9 12 L 19 8 L 29 5 L 39 2" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            </g>

            {/* Эстакада с неоновым светом */}
            <path d="M -90 -5 Q 0 15 90 -5" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6,4" fill="none" opacity="0.9" />

            {/* Аватар Мегаполиса и табличка */}
            <g transform="translate(0, 15)">
              <circle r="36" fill="#1E293B" stroke="#38BDF8" strokeWidth="4" filter="url(#badgeShadow)" className="group-hover:scale-110 transition-transform" />
              <text textAnchor="middle" dy="13" fontSize="34" className="pointer-events-none">🏙️</text>
            </g>
            <g transform="translate(0, 68)">
              <rect x="-78" y="-13" width="156" height="26" rx="13" fill="#FFFFFF" stroke="#818CF8" strokeWidth="2" filter="url(#badgeShadow)" />
              <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="#1E293B">Неоновый мегаполис</text>
            </g>
          </g>


          {/* -------------------------------------------------------- */}
          {/* 5. ОСТРОВ: БАШНЯ АРТ-ДИРЕКТОРА (X: 790, Y: 120) */}
          {/* -------------------------------------------------------- */}
          <g 
            id="island-art_director_citadel"
            transform="translate(790, 120)" 
            className="cursor-pointer group select-none"
            onClick={() => handleLocationClick('art_director_citadel')}
          >
            {/* Тень */}
            <ellipse cx="0" cy="115" rx="125" ry="30" fill="#024D82" opacity="0.3" filter="url(#islandShadow)" />

            {/* Золотой ореол величия Цитадели */}
            <circle cx="0" cy="-30" r="80" fill="url(#goldAura)" opacity="0.35" />

            {/* Белая мраморная толща острова с золотыми прожилками */}
            <path
              d="
                M -115 0 
                C -120 35, -90 85, -45 115
                C -18 135, 0 145, 10 148
                C 25 142, 60 110, 95 75
                C 115 40, 120 15, 115 0
                Z
              "
              fill="url(#citadelRockStrata)"
            />

            {/* Золотые кристаллические сталактиты снизу */}
            <polygon points="-20,110 -15,135 -10,110" fill="#FDE047" />
            <polygon points="15,105 20,130 25,105" fill="#FDE047" />

            {/* Верхнее мраморное плато острова */}
            <path
              d="
                M -120 -10
                C -125 -30, -75 -45, -15 -45
                C 40 -45, 120 -35, 120 -10
                C 120 15, 60 25, 0 25
                C -60 25, -120 15, -120 -10 Z
              "
              fill="url(#citadelTopMarble)"
              stroke="#FEF08A"
              strokeWidth="2.5"
              className="group-hover:brightness-105 transition-all"
            />

            {/* Величественная Башня Арт-директора с золотым шпилем */}
            <g transform="translate(-35, -115)">
              {/* Колоннада фундамента башни */}
              <rect x="0" y="45" width="70" height="28" rx="3" fill="#FFFFFF" stroke="#B45309" strokeWidth="2" />
              {/* Мраморные колонны */}
              <line x1="14" y1="45" x2="14" y2="73" stroke="#B45309" strokeWidth="2" />
              <line x1="28" y1="45" x2="28" y2="73" stroke="#B45309" strokeWidth="2" />
              <line x1="42" y1="45" x2="42" y2="73" stroke="#B45309" strokeWidth="2" />
              <line x1="56" y1="45" x2="56" y2="73" stroke="#B45309" strokeWidth="2" />

              {/* Второй ярус башни */}
              <rect x="12" y="18" width="46" height="28" rx="2" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.8" />
              <polygon points="35,0 8,18 62,18" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />

              {/* Высокий золотой шпиль */}
              <polygon points="35,-45 31,0 39,0" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
              
              {/* Сияющий кристалл на вершине шпиля */}
              <polygon points="35,-56 30,-48 35,-40 40,-48" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" filter="url(#goldAura)" />

              {/* Парящее орбитальное золотое кольцо вокруг шпиля */}
              <ellipse cx="35" cy="-20" rx="22" ry="7" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.9" />

              {/* Королевские штандарты по бокам башни */}
              <g fill="#991B1B">
                <polygon points="4,48 -4,54 4,60" />
                <polygon points="66,48 74,54 66,60" />
              </g>
            </g>

            {/* Аватар Башни (Корона мастера) и табличка */}
            <g transform="translate(0, 15)">
              <circle r="36" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="4" filter="url(#badgeShadow)" className="group-hover:scale-110 transition-transform" />
              <text textAnchor="middle" dy="13" fontSize="36" className="pointer-events-none">👑</text>
            </g>
            <g transform="translate(0, 68)">
              <rect x="-78" y="-13" width="156" height="26" rx="13" fill="#FFFFFF" stroke="#FDE047" strokeWidth="2" filter="url(#badgeShadow)" />
              <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="#1E293B">Башня Арт-директора</text>
            </g>
          </g>

          {/* ======================================================== */}
          {/* СЛОЙ 4: ПЫШНЫЕ КУЧЕВЫЕ ОБЛАКА СТРОГО ПО САМОМУ НИЗУ ЭКРАНА */}
          {/* (РАСПОЛОЖЕНЫ НА Y > 630 И НИ В КОЕМ СЛУЧАЕ НЕ КАСАЮТСЯ ОСТРОВОВ!) */}
          {/* ======================================================== */}
          <g transform="translate(0, 630)" opacity="0.9" filter="url(#cloudSoftShadow)">
            {/* Голубоватая мягкая подложка облачного горизонта */}
            <ellipse cx="140" cy="50" rx="180" ry="45" fill="#BAE6FD" opacity="0.6" />
            <ellipse cx="460" cy="55" rx="220" ry="50" fill="#BAE6FD" opacity="0.6" />
            <ellipse cx="800" cy="50" rx="200" ry="45" fill="#BAE6FD" opacity="0.6" />
            <ellipse cx="1140" cy="55" rx="190" ry="50" fill="#BAE6FD" opacity="0.6" />

            {/* Белые кучевые шапки облаков */}
            <ellipse cx="60" cy="45" rx="120" ry="38" fill="#FFFFFF" />
            <ellipse cx="220" cy="35" rx="130" ry="36" fill="#FFFFFF" />
            <ellipse cx="380" cy="45" rx="140" ry="40" fill="#FFFFFF" />
            <ellipse cx="560" cy="35" rx="130" ry="36" fill="#FFFFFF" />
            <ellipse cx="720" cy="42" rx="140" ry="38" fill="#FFFFFF" />
            <ellipse cx="900" cy="35" rx="130" ry="35" fill="#FFFFFF" />
            <ellipse cx="1060" cy="45" rx="140" ry="40" fill="#FFFFFF" />
            <ellipse cx="1220" cy="35" rx="120" ry="35" fill="#FFFFFF" />
          </g>
        </svg>

        {/* ======================================================== */}
        {/* 3. ОГОНЁК СПАРК: ИДЕАЛЬНЫЙ, ЦЕЛЬНЫЙ И АНИМИРОВАННЫЙ В УГЛУ */}
        {/* (ПОСТАВЛЕН В УГЛОВОЙ ОВЕРЛЕЙ, НЕ ЗАДЕВАЕТ НИ ОДИН ОСТРОВ!) */}
        {/* ======================================================== */}
        <div 
          id="spark-mascot-corner"
          onClick={handleSparkClick}
          className="absolute bottom-2.5 right-3 sm:bottom-3.5 sm:right-5 z-30 select-none cursor-pointer flex flex-col items-center pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
          title="Спросить Спарка"
        >
          <SparkFlameCore
            emotion="happy"
            size={110}
            waving={true}
            standingOnCloud={true}
            showBubble={true}
            bubbleText="Куда пойдём?"
            onBubbleClick={handleSparkClick}
          />
        </div>

      </div>

      {/* 4. НИЖНЯЯ ПАНЕЛЬ БЫСТРОГО ДОСТУПА ПО ВСЕМ 5 ОСТРОВАМ */}
      <QuickAccessBar onSelectLocation={handleLocationClick} />

      {/* Модальное окно рюкзака */}
      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        playerState={playerState}
      />

      {/* Модальное окно заблокированной локации (Неоновый мегаполис / Башня) */}
      {lockedLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-slate-100 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            {/* Кнопка закрытия */}
            <button
              onClick={() => setLockedLocationModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Иконка локации */}
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-inner mb-4">
              <span>{lockedLocationModal.id === 'cyber_metropolis' ? '🏙️' : '👑'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider mb-2">
              <Lock size={12} className="text-amber-600" />
              <span>{lockedLocationModal.badge}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {lockedLocationModal.title}
            </h3>

            <p className="text-xs font-bold text-slate-400 mb-3">
              {lockedLocationModal.subtitle}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {lockedLocationModal.description}
            </p>

            {/* Цитата Спарка */}
            <div className="w-full bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/70 text-left flex items-start gap-3 mb-6">
              <span className="text-2xl shrink-0">🔥</span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-amber-800">Совет от Спарка:</span>
                <span className="text-xs font-medium text-amber-900/90 leading-snug mt-0.5">
                  {lockedLocationModal.sparkQuote}
                </span>
              </div>
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={() => {
                sound.playClick();
                setLockedLocationModal(null);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF9600] hover:bg-[#E08500] text-white font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              Понятно, возвращаюсь к обучению!
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
