// src/components/layout/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { sound } from '../../utils/soundManager';

interface SidebarProps {
  onNavClick?: () => void;
  className?: string;
}

interface NavItemConfig {
  id: string;
  name: string;
  path?: string;
  modalType?: 'backpack' | 'profile' | 'achievements' | 'settings';
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  activeBorderBottom: string;
  icon: (active: boolean) => React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavClick, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    player,
    userName,
    openModal,
    activeNavTab,
    setActiveNavTab,
    isSidebarCollapsed,
    toggleSidebarCollapsed
  } = usePlayer();

  const handleLogout = () => {
    sound.playClick();
    localStorage.removeItem('user_name');
    if (onNavClick) onNavClick();
    navigate('/');
  };

  const navItems: NavItemConfig[] = [
    {
      id: 'map',
      name: 'Карта мира',
      path: '/',
      activeColor: 'text-[#E07A00]',
      activeBg: 'bg-[#FFF3DB]',
      activeBorder: 'border-[#FFB74D]',
      activeBorderBottom: 'border-b-[#E07A00]',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${active ? 'text-[#E07A00] scale-110' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2.2" />
          <polygon
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            fill={active ? '#FFB74D' : 'none'}
            strokeWidth="1.8"
          />
        </svg>
      )
    },
    {
      id: 'backpack',
      name: 'Рюкзак',
      modalType: 'backpack',
      activeColor: 'text-[#7E22CE]',
      activeBg: 'bg-[#F3E8FF]',
      activeBorder: 'border-[#C084FC]',
      activeBorderBottom: 'border-b-[#7E22CE]',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${active ? 'text-[#7E22CE] scale-110' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 9 6 C 9 3.5, 15 3.5, 15 6" />
          <rect x="5" y="6" width="14" height="15" rx="4" fill={active ? '#E9D5FF' : 'none'} />
          <path d="M 5 12 L 19 12" />
          <rect x="8" y="14" width="8" height="5" rx="2" fill={active ? '#A855F7' : 'none'} />
        </svg>
      )
    },
    {
      id: 'profile',
      name: 'Профиль',
      modalType: 'profile',
      activeColor: 'text-[#0D9488]',
      activeBg: 'bg-[#CCFBF1]',
      activeBorder: 'border-[#5EEAD4]',
      activeBorderBottom: 'border-b-[#0F766E]',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${active ? 'text-[#0D9488] scale-110' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" fill={active ? '#99F6E4' : 'none'} />
        </svg>
      )
    },
    {
      id: 'achievements',
      name: 'Достижения',
      modalType: 'achievements',
      activeColor: 'text-[#B45309]',
      activeBg: 'bg-[#FEF3C7]',
      activeBorder: 'border-[#FCD34D]',
      activeBorderBottom: 'border-b-[#B45309]',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${active ? 'text-[#B45309] scale-110' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 4h16v6a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V4z" fill={active ? '#FDE68A' : 'none'} />
          <path d="M12 16v4" />
          <path d="M8 20h8" />
        </svg>
      )
    },
    {
      id: 'settings',
      name: 'Настройки',
      modalType: 'settings',
      activeColor: 'text-[#334155]',
      activeBg: 'bg-[#F1F5F9]',
      activeBorder: 'border-[#CBD5E1]',
      activeBorderBottom: 'border-b-[#64748B]',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${active ? 'text-[#334155] scale-110' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" fill={active ? '#CBD5E1' : 'none'} />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  const handleItemClick = (item: NavItemConfig) => {
    sound.playClick();
    setActiveNavTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
    if (item.modalType) {
      openModal(item.modalType);
    }
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between p-3 bg-[#FFF9EA] border-r-2 border-[#F3E5C7] select-none text-[#233C5F] shadow-[0_4px_20px_rgba(23,52,95,0.06)] z-30 font-sans transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-[84px]' : 'w-[240px]'
      } ${className}`}
      id="casual-game-sidebar"
    >
      {/* ВЕРХНЯЯ ЧАСТЬ: Логотип + Навигация */}
      <div>
        {/* 1. Логотип Duolingo Style (3D button effect) */}
        <div
          onClick={() => {
            sound.playClick();
            navigate('/');
            setActiveNavTab('map');
            if (onNavClick) onNavClick();
          }}
          className={`flex items-center rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] hover:bg-slate-50 cursor-pointer transition-all active:translate-y-0.5 active:border-b-2 shadow-xs ${
            isSidebarCollapsed ? 'p-2 justify-center' : 'p-2.5 gap-2.5'
          }`}
          title="Спарк Студия • На главную"
          id="sidebar-logo"
        >
          {/* Иконка: огонёк Спарка в круге с 3D ободком */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF9600] to-[#FF5E00] flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden border-2 border-white">
            <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
              <defs>
                <linearGradient id="sparkDuolingoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#FF9600" />
                </linearGradient>
              </defs>
              <path
                d="M 18 3 C 21 8, 28 14, 27 23 C 26 29, 22 33, 18 33 C 14 33, 10 29, 9 23 C 8 14, 15 8, 18 3 Z"
                fill="url(#sparkDuolingoGrad)"
              />
              <path
                d="M 18 13 C 20 16, 23 20, 22 25 C 21 28, 19 30, 18 30 C 17 30, 15 28, 14 25 C 13 20, 16 16, 18 13 Z"
                fill="#FFFBEB"
              />
              <circle cx="15.5" cy="20" r="1.5" fill="#17345F" />
              <circle cx="20.5" cy="20" r="1.5" fill="#17345F" />
              <path d="M 16 24 Q 18 26 20 24" stroke="#17345F" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col leading-tight min-w-0 overflow-hidden">
              <span className="text-[17px] font-black text-[#17345F] tracking-tight leading-snug whitespace-nowrap">
                Спарк Студия
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Learn by Doing
              </span>
            </div>
          )}
        </div>

        {/* 2. Навигация в стиле Duolingo с 3D-кнопками */}
        <nav className="mt-5 space-y-2" id="sidebar-nav">
          {navItems.map((item) => {
            const isMapRoute = location.pathname === '/' || location.pathname === '/map';
            const isActive = item.id === 'map' ? isMapRoute && activeNavTab === 'map' : activeNavTab === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleItemClick(item)}
                title={isSidebarCollapsed ? item.name : undefined}
                className={`w-full rounded-2xl transition-all duration-150 cursor-pointer select-none text-left flex items-center ${
                  isSidebarCollapsed
                    ? 'justify-center h-12 p-0'
                    : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? `${item.activeBg} ${item.activeColor} border-2 ${item.activeBorder} border-b-4 ${item.activeBorderBottom} font-black shadow-xs`
                    : 'bg-transparent hover:bg-white/90 text-[#475569] font-extrabold border-2 border-transparent hover:border-[#E5D5BA] hover:border-b-4 hover:border-b-[#D4C3A3]'
                }`}
                id={`sidebar-item-${item.id}`}
              >
                {/* SVG Иконка (24px) */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {item.icon(isActive)}
                </div>

                {/* Текст кнопки в стиле Duolingo */}
                {!isSidebarCollapsed && (
                  <span className="text-[13px] tracking-wide uppercase font-black whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ: Кнопка сворачивания + Профиль игрока */}
      <div className="space-y-2.5 pt-2 border-t-2 border-[#F3E5C7]" id="sidebar-bottom">
        {/* Кнопка сворачивания/разворачивания (Duolingo 3D Button) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            toggleSidebarCollapsed();
          }}
          className={`w-full rounded-2xl bg-white hover:bg-slate-50 border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-[#475569] hover:text-[#17345F] font-black text-xs transition-all active:translate-y-0.5 active:border-b-2 flex items-center justify-center cursor-pointer shadow-xs ${
            isSidebarCollapsed ? 'p-2.5' : 'py-2 px-3 gap-2'
          }`}
          title={isSidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          id="sidebar-toggle-collapse-btn"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={18} strokeWidth={2.8} />
          ) : (
            <>
              <ChevronLeft size={16} strokeWidth={2.8} />
              <span className="uppercase tracking-wider text-[11px] font-black">
                Свернуть меню
              </span>
            </>
          )}
        </button>

        {/* Карточка профиля игрока («Кристина», 💰 120, [Выйти]) */}
        <div
          className={`rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] shadow-xs flex items-center justify-between transition-all ${
            isSidebarCollapsed ? 'p-1.5 flex-col gap-1.5' : 'p-2.5 gap-2'
          }`}
          id="sidebar-profile"
        >
          {/* Аватар и имя */}
          <div
            onClick={() => {
              sound.playClick();
              openModal('profile');
              if (onNavClick) onNavClick();
            }}
            className={`flex items-center cursor-pointer overflow-hidden min-w-0 ${
              isSidebarCollapsed ? 'flex-col gap-1' : 'flex-1 gap-2.5'
            }`}
            title="Открыть профиль"
          >
            {/* Круглый аватар Duolingo-style */}
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#FF9600] to-[#52D2CC] p-0.5 shadow-xs border-2 border-white">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xs text-[#17345F]">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            {!isSidebarCollapsed ? (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-xs font-black text-[#17345F] truncate">
                  {userName}
                </span>
                <span className="text-[11px] font-black text-amber-600 flex items-center gap-1 mt-0.5">
                  💰 {player.coins}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-black text-amber-600 leading-none">
                {player.coins}
              </span>
            )}
          </div>

          {/* Кнопка «Выйти» (LogOut) */}
          <button
            type="button"
            onClick={handleLogout}
            title="Выйти из игры"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer active:scale-95"
            aria-label="Выйти"
            id="sidebar-logout-btn"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
