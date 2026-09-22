// src/App.tsx
import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { PlayerProvider } from './context/PlayerContext';
import { AppLayout } from './components/layout/AppLayout';
import { WorldMap } from './components/map/WorldMap';
import { MainMenu } from './pages/MainMenu';
import { SplashScreen } from './pages/SplashScreen';
import { LoadingScreen } from './pages/LoadingScreen';
import { SparkBirth } from './components/intro/SparkBirth';
import { Intro } from './pages/Intro';
import { StudioSetup } from './pages/StudioSetup';
import { Practice } from './pages/Practice';
import { Final } from './pages/Final';
import { SubtitlesBar } from './components/ui/SubtitlesBar';
import { StartOverlay } from './components/StartOverlay';

export default function App() {
  // Экран «Магия творчества» показывается каждый раз при входе для разблокировки звука в браузерах
  const [isStarted, setIsStarted] = useState(false);

  return (
    <PlayerProvider>
      {/* Волшебный стартовый экран «Магия творчества» */}
      {!isStarted && <StartOverlay onStart={() => setIsStarted(true)} />}

      <HashRouter>
        <SubtitlesBar />
        <Routes>
          {/* Стартовый экран Splash Screen */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/splash" element={<SplashScreen />} />

          {/* Экран загрузки с анимированной шкалой-краской */}
          <Route path="/loading" element={<LoadingScreen />} />

          {/* Главное меню игры (Спринт 1) */}
          <Route path="/menu" element={<MainMenu />} />

          {/* Заставка «Рождение Спарка» */}
          <Route path="/intro" element={<SparkBirth />} />
          <Route path="/intro/slides" element={<Intro />} />

          {/* Создание студии (Спринт 3) */}
          <Route path="/studio" element={<StudioSetup />} />

          {/* Практика: Интерактив кнопки */}
          <Route path="/practice" element={<Practice />} />

          {/* Финальный экран с получением ключа .spark */}
          <Route path="/final" element={<Final />} />

          {/* Основной игровой лейаут: Карта мира Архипелаг UX */}
          <Route element={<AppLayout />}>
            <Route path="/map" element={<WorldMap />} />
          </Route>

          {/* Fallback на главный экран */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PlayerProvider>
  );
}
