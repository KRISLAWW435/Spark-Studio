// src/components/map/WorldMap.tsx
import React, { useState, useEffect } from 'react';
import { ISLANDS, IslandData } from '../../data/islands';
import { MapBackground } from './MapBackground';
import { MapPath } from './MapPath';
import { Island } from './Island';
import { Mascot, MascotMood } from '../mascot/Mascot';
import { SpeechBubble } from '../mascot/SpeechBubble';
import { GameHeader } from '../hud/GameHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { Toast, ToastData } from '../ui/Toast';
import { usePlayer } from '../../context/PlayerContext';

export const WorldMap: React.FC = () => {
  const { player, setPlayer, openModal, setIsMobileSidebarOpen } = usePlayer();
  const [selectedIslandId, setSelectedIslandId] = useState<string>('marie');
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [speechMessage, setSpeechMessage] = useState<string>(
    'Ура! Куда дальше?\nДавай выберем остров!'
  );
  const [toast, setToast] = useState<ToastData | null>(null);

  // Сброс маскота в idle через некоторое время после действия
  useEffect(() => {
    if (mascotMood !== 'idle') {
      const timer = setTimeout(() => {
        setMascotMood('idle');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mascotMood]);

  // Обработка клика по острову
  const handleSelectIsland = (island: IslandData) => {
    setSelectedIslandId(island.id);

    if (island.state === 'locked') {
      setMascotMood('locked');
      setSpeechMessage('🔒 Этот остров пока закрыт.\nСначала пройди предыдущие задания!');
      setToast({
        id: Date.now().toString(),
        message: 'Остров «Мегаполис» заблокирован! Пройди 3 предыдущих острова.',
        type: 'lock'
      });
    } else {
      setPlayer((prev) => ({
        ...prev,
        currentIsland: island.id
      }));
      setMascotMood('happy');
      setSpeechMessage(`Открываем: ${island.title}!\nЗдесь тебя ждут новые UX-задания!`);
      setToast({
        id: Date.now().toString(),
        message: `Локация выбрана: ${island.title} ⭐`,
        type: 'success'
      });
    }
  };

  // Обработка клика по боковым замкам
  const handleLockClick = (variant: 'silver' | 'gold') => {
    setMascotMood('locked');
    setSpeechMessage('🔒 Этот секретный путь откроется позже!');
    setToast({
      id: Date.now().toString(),
      message: variant === 'gold' ? 'Золотой путь откроется в Спринте 2!' : 'Секретная бухта пока недоступна!',
      type: 'lock'
    });
  };

  // Клик по маскоту
  const handleMascotClick = () => {
    setMascotMood('success');
    setSpeechMessage('Привет! Я Спарк — твой помощник\nв изучении дизайна интерфейсов!');
  };

  return (
    <main
      className="relative w-full h-full overflow-hidden bg-[#58C9F3] flex flex-col justify-between select-none"
      id="game-viewport"
    >
      {/* 1. Верхний компактный HUD и Заголовок игры */}
      <GameHeader
        player={player}
        onCoinsClick={() => openModal('coins')}
        onBackpackClick={() => openModal('backpack')}
        onStreakClick={() => openModal('profile')}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
      />

      {/* 2. Основной масштабируемый холст карты (1600x900) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative pointer-events-auto"
          style={{
            width: '1600px',
            height: '900px',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '16 / 9',
            transformOrigin: 'center center'
          }}
          id="map-canvas-container"
        >
          {/* Фон: Небо, Океан, Облака, Далекие острова */}
          <MapBackground />

          {/* Пути со стрелками и боковыми замками */}
          <MapPath onLockClick={handleLockClick} />

          {/* 4 Острова карты */}
          {ISLANDS.map((island, index) => (
            <Island
              key={island.id}
              data={island}
              isSelected={selectedIslandId === island.id}
              onSelect={handleSelectIsland}
              floatingDelay={index * 0.45}
            />
          ))}
        </div>
      </div>

      {/* 3. Нижняя секция: Навигация (слева) и Маскот со Спичбабблом (справа) */}
      <footer className="w-full flex items-end justify-between px-3 sm:px-6 pb-3 sm:pb-5 pointer-events-none z-20">
        {/* Нижняя навигация по островам (слева) */}
        <BottomNavigation
          currentIslandId={selectedIslandId}
          onSelectIsland={(id) => {
            const found = ISLANDS.find((i) => i.id === id);
            if (found) handleSelectIsland(found);
          }}
        />

        {/* Маскот и речевой пузырь (справа) */}
        <div className="flex items-center gap-2.5 sm:gap-4 pointer-events-auto filter drop-shadow-xl" id="mascot-hud">
          {/* Спичбаббл маскота */}
          <SpeechBubble message={speechMessage} className="hidden md:block" />

          {/* Сам милый огненный маскот */}
          <Mascot
            mood={mascotMood}
            onClick={handleMascotClick}
            size={180}
          />
        </div>
      </footer>

      {/* 4. Мобильный спичбаббл (на узких экранах размещается по центру внизу) */}
      <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <SpeechBubble message={speechMessage} />
      </div>

      {/* 5. Уведомления (Toast) */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
};

export default WorldMap;
