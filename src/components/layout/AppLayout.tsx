// src/components/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { usePlayer } from '../../context/PlayerContext';
import { GameModals } from '../ui/GameModals';

export const AppLayout: React.FC = () => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, isSidebarCollapsed } = usePlayer();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#58C9F3] relative font-sans">
      {/* 1. Десктопный сворачиваемый сайдбар (240px в развернутом виде, 84px в свернутом) */}
      <div
        className={`hidden lg:block h-full shrink-0 z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-[84px]' : 'w-[240px]'
        }`}
      >
        <Sidebar />
      </div>

      {/* 2. Мобильный выдвижной сайдбар (Drawer) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Панель меню */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative w-[260px] h-full shadow-2xl z-50"
            >
              <Sidebar
                className="w-full h-full shadow-2xl"
                onNavClick={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Основная рабочая область: Карта мира */}
      <main className="flex-1 h-full min-w-0 relative overflow-hidden">
        <Outlet />
      </main>

      {/* 4. Глобальные казуальные модалки (Казна, Рюкзак, Профиль, Достижения, Настройки) */}
      <GameModals />
    </div>
  );
};

export default AppLayout;
