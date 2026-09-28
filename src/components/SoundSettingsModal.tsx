// src/components/SoundSettingsModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Mic,
  X,
  Check,
} from 'lucide-react';
import { SoundManager } from '../services/SoundManager';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import {
  getStoredSoundSettings,
  applySoundSettings,
  SOUND_SETTINGS_STORAGE_KEY,
  SOUND_SETTINGS_VERSION_KEY,
  CURRENT_SETTINGS_VERSION,
  SoundSettings,
} from '../hooks/useSoundSettings';
import { getAssetUrl } from '../utils/assetUrl';

export interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoundSettingsModal({ isOpen, onClose }: SoundSettingsModalProps) {
  const layout = useResponsiveLayout();
  // Мобильный режим: экран < 768px или ландшафт телефона (< 500px по высоте)
  const isMobile =
    layout === 'mobile' ||
    (typeof window !== 'undefined' && (window.innerWidth < 768 || (window.innerHeight < 500 && window.innerWidth < 1024)));

  const bgImage = isMobile
    ? getAssetUrl('assets/ui/sound-modal-mobile.webp')
    : getAssetUrl('assets/ui/sound-modal-desktop.webp');

  // Храним исходные настройки при открытии для отмены при закрытии крестиком на Desktop
  const initialSettingsRef = useRef<SoundSettings | null>(null);

  const [musicVolume, setMusicVolume] = useState<number>(() => getStoredSoundSettings().musicVolume);
  const [voiceVolume, setVoiceVolume] = useState<number>(() => getStoredSoundSettings().voiceVolume);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => getStoredSoundSettings().isMusicMuted);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => getStoredSoundSettings().isVoiceMuted);

  // При открытии модалки загружаем актуальные настройки
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredSoundSettings();
      initialSettingsRef.current = stored;
      setMusicVolume(stored.musicVolume);
      setVoiceVolume(stored.voiceVolume);
      setIsMusicMuted(stored.isMusicMuted);
      setIsVoiceMuted(stored.isVoiceMuted);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Автосохранение на мобилке при любом изменении
  const autoSaveIfMobile = (
    music: number,
    voice: number,
    musicMuted: boolean,
    voiceMuted: boolean
  ) => {
    if (isMobile) {
      const updated: SoundSettings = {
        musicVolume: music,
        voiceVolume: voice,
        isMusicMuted: musicMuted,
        isVoiceMuted: voiceMuted,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(SOUND_SETTINGS_VERSION_KEY, String(CURRENT_SETTINGS_VERSION));
      }
      applySoundSettings(updated);
    }
  };

  // Изменение громкости музыки в реальном времени
  const handleMusicChange = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    setMusicVolume(clamped);
    const unmuted = isMusicMuted && clamped > 0 ? false : isMusicMuted;
    if (isMusicMuted && clamped > 0) {
      setIsMusicMuted(false);
      SoundManager.setMusicMuted(false);
    }
    SoundManager.setMusicVolume(clamped / 100);
    autoSaveIfMobile(clamped, voiceVolume, unmuted, isVoiceMuted);
  };

  // Переключение Mute музыки
  const toggleMusicMute = () => {
    SoundManager.playClick();
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    SoundManager.setMusicMuted(next);
    autoSaveIfMobile(musicVolume, voiceVolume, next, isVoiceMuted);
  };

  // Изменение громкости голоса в реальном времени
  const handleVoiceChange = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    setVoiceVolume(clamped);
    const unmuted = isVoiceMuted && clamped > 0 ? false : isVoiceMuted;
    if (isVoiceMuted && clamped > 0) {
      setIsVoiceMuted(false);
      SoundManager.setVoiceMuted(false);
    }
    SoundManager.setVoiceVolume(clamped / 100);
    autoSaveIfMobile(musicVolume, clamped, isMusicMuted, unmuted);
  };

  // Переключение Mute голоса
  const toggleVoiceMute = () => {
    SoundManager.playClick();
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    SoundManager.setVoiceMuted(next);
    autoSaveIfMobile(musicVolume, voiceVolume, isMusicMuted, next);
  };

  // Сохранение настроек при нажатии кнопки «Готово» (Desktop)
  const handleSave = () => {
    SoundManager.playClick();
    const updated: SoundSettings = {
      musicVolume,
      voiceVolume,
      isMusicMuted,
      isVoiceMuted,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(SOUND_SETTINGS_VERSION_KEY, String(CURRENT_SETTINGS_VERSION));
    }
    applySoundSettings(updated);
    onClose();
  };

  // Закрытие крестиком или кликом на фон
  const handleClose = () => {
    SoundManager.playClick();
    // На мобилке автосохранение уже выполнено; на десктопе отменяем изменения до нажатия «Готово»
    if (!isMobile && initialSettingsRef.current) {
      applySoundSettings(initialSettingsRef.current);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Затемнение фона */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Обёртка модалки — точные пропорции PNG (Mobile: 960/540, Desktop: 1401/1198) */}
      <div
        className="relative max-h-[96vh] max-w-[95vw]"
        style={{
          width: isMobile
            ? 'min(95vw, 760px, calc(94vh * 960 / 540))'
            : 'min(95vw, 1200px, calc(94vh * 1401 / 1198))',
          aspectRatio: isMobile ? '960 / 540' : '1401 / 1198',
        }}
      >
        {/* PNG-плашка — растянута на всю обёртку */}
        <img
          src={bgImage}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-2xl"
          alt=""
        />

        {/* 2. Крестик — Desktop: top: 43%, right: 10%, w-12 h-12 (-23px Y) | Mobile: top: 44%, right: 15%, w-9 h-9 (-21px X, -27px Y) */}
        <button
          type="button"
          onClick={handleClose}
          className={
            isMobile
              ? 'absolute right-[15%] w-9 h-9 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center active:scale-90 transition-all z-30 cursor-pointer -translate-x-[21px] -translate-y-[27px]'
              : 'absolute right-[10%] w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center hover:border-[#A855F7] active:scale-90 transition-all z-30 cursor-pointer -translate-y-[23px]'
          }
          style={{ top: isMobile ? '44%' : '43%' }}
          title="Закрыть"
        >
          <X size={isMobile ? 16 : 22} className="text-slate-700" strokeWidth={2.5} />
        </button>

        {/* HTML-слой внутри рамки */}
        <div
          className={`absolute z-20 flex flex-col justify-between ${!isMobile ? 'translate-y-[34px]' : ''}`}
          style={
            isMobile
              ? {
                  top: '37%',
                  left: '18%',
                  right: '18%',
                  bottom: '12%',
                }
              : {
                  top: '36%',
                  left: '10%',
                  right: '10%',
                  bottom: '12%',
                }
          }
        >
          {/* 3. Заголовок */}
          <div className={`flex items-center ${isMobile ? 'gap-2 mb-2' : 'gap-3 sm:gap-4 mb-[3%]'} shrink-0`}>
            <div
              className={
                isMobile
                  ? 'w-9 h-9 rounded-lg bg-gradient-to-br from-[#A855F7] to-[#22D3EE] flex items-center justify-center shrink-0'
                  : 'w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#22D3EE] flex items-center justify-center shrink-0 shadow-sm'
              }
            >
              <Volume2 size={isMobile ? 16 : 24} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2
                className={
                  isMobile
                    ? 'text-sm font-black text-[#1A1A2E] leading-tight truncate'
                    : 'text-2xl font-black text-[#1A1A2E] leading-tight'
                }
              >
                Настройки звука
              </h2>
              <p
                className={
                  isMobile
                    ? 'text-xs text-slate-600 truncate'
                    : 'text-sm text-slate-600'
                }
              >
                Настройте звук для комфортной игры
              </p>
            </div>
          </div>

          {/* 4. Слайдер «Музыка» */}
          <div className={`flex items-center ${isMobile ? 'gap-2 mb-2' : 'gap-3 sm:gap-4 mt-[1%] mb-[5%]'}`}>
            {/* Иконка музыки слева */}
            <div
              className={
                isMobile
                  ? 'w-9 h-9 rounded-full bg-gradient-to-br from-[#A855F7] to-[#C084FC] flex items-center justify-center shrink-0 shadow-sm shadow-purple-300/40'
                  : 'w-14 h-14 rounded-full bg-gradient-to-br from-[#A855F7] to-[#C084FC] flex items-center justify-center shrink-0 shadow-md shadow-purple-300/50'
              }
            >
              <Music size={isMobile ? 16 : 26} className="text-white" />
            </div>

            {/* Трек и подписи */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center justify-between ${isMobile ? 'mb-1.5' : 'mb-3'}`}>
                <span
                  className={
                    isMobile
                      ? 'text-sm font-bold text-[#1A1A2E]'
                      : 'text-base xl:text-lg font-bold text-[#1A1A2E]'
                  }
                >
                  Музыка
                </span>
                <span
                  className={
                    isMobile
                      ? 'text-[11px] font-bold text-[#A855F7]'
                      : 'text-base xl:text-lg font-bold text-[#A855F7]'
                  }
                >
                  {musicVolume}%
                </span>
              </div>
              <div className={isMobile ? 'py-1 flex items-center' : 'py-2 min-h-[44px] flex items-center'}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => handleMusicChange(+e.target.value)}
                  className={`
                    w-full appearance-none cursor-pointer rounded-full
                    bg-gradient-to-r from-[#A855F7] to-[#E9D5FF]
                    ${isMobile ? 'h-2' : 'h-4'}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-[#A855F7]
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    ${
                      isMobile
                        ? '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:border-[3px]'
                        : '[&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:border-[3px]'
                    }
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-[#A855F7]
                    [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:cursor-grab
                    ${
                      isMobile
                        ? '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:border-[3px]'
                        : '[&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:border-[3px]'
                    }
                  `}
                />
              </div>
            </div>

            {/* Кнопка Mute музыки */}
            <button
              type="button"
              onClick={toggleMusicMute}
              aria-label={isMusicMuted ? 'Включить музыку' : 'Выключить музыку'}
              className={
                isMobile
                  ? 'w-9 h-9 rounded-full bg-purple-200 border-2 border-[#A855F7] flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer self-center'
                  : 'w-12 h-12 rounded-full bg-purple-200 hover:bg-purple-300 border-2 border-[#A855F7] shadow-md shadow-purple-300/40 flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer self-center'
              }
            >
              {isMusicMuted ? (
                <VolumeX size={isMobile ? 16 : 22} className="text-rose-600" strokeWidth={2.5} />
              ) : (
                <Volume2 size={isMobile ? 16 : 22} className="text-[#6B21A8]" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* 5. Слайдер «Голос» */}
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3 sm:gap-4 mb-[5%]'}`}>
            {/* Иконка голоса слева */}
            <div
              className={
                isMobile
                  ? 'w-9 h-9 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#67E8F9] flex items-center justify-center shrink-0 shadow-sm shadow-cyan-300/40'
                  : 'w-14 h-14 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#67E8F9] flex items-center justify-center shrink-0 shadow-md shadow-cyan-300/50'
              }
            >
              <Mic size={isMobile ? 16 : 26} className="text-white" />
            </div>

            {/* Трек и подписи */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center justify-between ${isMobile ? 'mb-1.5' : 'mb-3'}`}>
                <span
                  className={
                    isMobile
                      ? 'text-sm font-bold text-[#1A1A2E]'
                      : 'text-base xl:text-lg font-bold text-[#1A1A2E]'
                  }
                >
                  Голос
                </span>
                <span
                  className={
                    isMobile
                      ? 'text-[11px] font-bold text-[#22D3EE]'
                      : 'text-base xl:text-lg font-bold text-[#22D3EE]'
                  }
                >
                  {voiceVolume}%
                </span>
              </div>
              <div className={isMobile ? 'py-1 flex items-center' : 'py-2 min-h-[44px] flex items-center'}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  onChange={(e) => handleVoiceChange(+e.target.value)}
                  className={`
                    w-full appearance-none cursor-pointer rounded-full
                    bg-gradient-to-r from-[#22D3EE] to-[#CFFAFE]
                    ${isMobile ? 'h-2' : 'h-4'}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-[#22D3EE]
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    ${
                      isMobile
                        ? '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:border-[3px]'
                        : '[&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:border-[3px]'
                    }
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-[#22D3EE]
                    [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:cursor-grab
                    ${
                      isMobile
                        ? '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:border-[3px]'
                        : '[&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:border-[3px]'
                    }
                  `}
                />
              </div>
            </div>

            {/* Кнопка Mute голоса */}
            <button
              type="button"
              onClick={toggleVoiceMute}
              aria-label={isVoiceMuted ? 'Включить голос' : 'Выключить голос'}
              className={
                isMobile
                  ? 'w-9 h-9 rounded-full bg-cyan-200 border-2 border-[#22D3EE] flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer self-center'
                  : 'w-12 h-12 rounded-full bg-cyan-200 hover:bg-cyan-300 border-2 border-[#22D3EE] shadow-md shadow-cyan-300/40 flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer self-center'
              }
            >
              {isVoiceMuted ? (
                <VolumeX size={isMobile ? 16 : 22} className="text-rose-600" strokeWidth={2.5} />
              ) : (
                <Volume2 size={isMobile ? 16 : 22} className="text-[#0E7490]" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* 6. Кнопка «Готово» — ТОЛЬКО для десктопа */}
          {!isMobile && (
            <div className="mt-auto flex justify-center">
              <button
                type="button"
                onClick={handleSave}
                className="w-[70%] max-w-[420px] h-14
                  rounded-2xl
                  bg-gradient-to-r from-[#A855F7] to-[#22D3EE]
                  text-white font-black text-lg uppercase
                  shadow-[0_5px_0_#6B21A8]
                  hover:brightness-110
                  active:translate-y-1 active:shadow-none
                  transition-all
                  flex items-center justify-center gap-3
                  cursor-pointer"
              >
                <Check size={22} strokeWidth={3} />
                Готово
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SoundSettingsModal;
