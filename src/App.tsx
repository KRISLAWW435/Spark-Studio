// src/App.tsx
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
  return (
    <PlayerProvider>
      <HashRouter>
        <SubtitlesBar />
        <Routes>
          {/* 1. Стартовый экран «Магия творчества» (StartOverlay) */}
          <Route path="/" element={<StartOverlay />} />
          <Route path="/start" element={<StartOverlay />} />

          {/* 2. Заставка Спарк + Логотип (SplashScreen) */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/welcome-logo" element={<SplashScreen />} />

          {/* 3. Экран загрузки с анимированной шкалой-краской */}
          <Route path="/loading" element={<LoadingScreen />} />

          {/* 5. Главное меню игры */}
          <Route path="/menu" element={<MainMenu />} />

          {/* Маршруты создания студии и обучения */}
          <Route path="/intro" element={<SparkBirth />} />
          <Route path="/intro/slides" element={<Intro />} />
          <Route path="/studio" element={<StudioSetup />} />
          <Route path="/studios" element={<WorldMap />} />

          {/* Практика: Интерактив кнопки */}
          <Route path="/practice" element={<Practice />} />

          {/* Финальный экран с получением ключа .spark */}
          <Route path="/final" element={<Final />} />

          {/* Основной игровой лейаут: Карта мира Архипелаг UX */}
          <Route element={<AppLayout />}>
            <Route path="/map" element={<WorldMap />} />
          </Route>

          {/* Fallback на начальный экран */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PlayerProvider>
  );
}
