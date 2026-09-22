// src/components/SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Mic,
  MicOff,
  Sparkles,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [musicMuted, setMusicMuted] = useState<boolean>(() => soundManager.isMusicMuted());
  const [musicVolume, setMusicVolume] = useState<number>(() => soundManager.getMusicVolume());
  const [voiceMuted, setVoiceMuted] = useState<boolean>(() => soundManager.isVoiceMuted());
  const [voiceVolume, setVoiceVolume] = useState<number>(() => soundManager.getVoiceVolume());

  // Синхронизация состояний при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setMusicMuted(soundManager.isMusicMuted());
      setMusicVolume(soundManager.getMusicVolume());
      setVoiceMuted(soundManager.isVoiceMuted());
      setVoiceVolume(soundManager.getVoiceVolume());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMusic = () => {
    soundManager.playClick();
    const next = !musicMuted;
    setMusicMuted(next);
    soundManager.setMusicMuted(next);
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    soundManager.setMusicVolume(val);
    if (musicMuted && val > 0) {
      setMusicMuted(false);
      soundManager.setMusicMuted(false);
    }
  };

  const handleToggleVoice = () => {
    soundManager.playClick();
    const next = !voiceMuted;
    setVoiceMuted(next);
    soundManager.setVoiceMuted(next);
  };

  const handleVoiceVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVoiceVolume(val);
    soundManager.setVoiceVolume(val);
    if (voiceMuted && val > 0) {
      setVoiceMuted(false);
      soundManager.setVoiceMuted(false);
    }
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const musicPercent = musicMuted ? 0 : Math.round(musicVolume * 100);
  const voicePercent = voiceMuted ? 0 : Math.round(voiceVolume * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 select-none">
        {/* Затемнение фона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Контейнер модалки: точный размер, цвет и скругления */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[calc(100vw-48px)] sm:w-full max-w-[720px] sm:max-w-[460px] max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-48px)] bg-slate-50/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/70 flex flex-col overflow-hidden"
        >
          {/* Декоративное мягкое свечение */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* 1. ШАПКА */}
          <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200/60 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#22D3EE] flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-tight">
                  Настройки звука
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                  Настройте комфортный уровень звука для игры
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0 ml-2"
              title="Закрыть"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* 2. ТЕЛО МОДАЛКИ: компактные блоки на mobile, оба полностью видны */}
          <div className="relative flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-2.5 sm:space-y-4 custom-scrollbar">
            {/* БЛОК 1: Музыка */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2 sm:space-y-3">
              {/* Строка 1: иконка + заголовок + тумблер */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-100/80 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">Музыка</h3>
                    <p className="hidden sm:block text-[10px] sm:text-xs text-slate-500">Фоновые мелодии и атмосфера</p>
                  </div>
                </div>

                {/* Тумблер Музыки */}
                <button
                  type="button"
                  onClick={handleToggleMusic}
                  className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center shrink-0 ${
                    !musicMuted
                      ? 'bg-gradient-to-r from-[#A855F7] to-[#22D3EE] justify-end'
                      : 'bg-slate-300 justify-start'
                  }`}
                  title={musicMuted ? 'Включить музыку' : 'Выключить музыку'}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700"
                  >
                    {!musicMuted ? (
                      <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                    ) : (
                      <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    )}
                  </motion.div>
                </button>
              </div>

              {/* Строка 2: проценты + слайдер */}
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-[#17345F] w-10 sm:w-12 shrink-0 text-left">
                  {musicPercent}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicMuted ? 0 : musicVolume}
                  onChange={handleMusicVolumeChange}
                  className="flex-1 h-1 sm:h-1.5 sound-slider cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A855F7 0%, #22D3EE ${musicPercent}%, #E2E8F0 ${musicPercent}%, #E2E8F0 100%)`,
                  }}
                />
              </div>
            </div>

            {/* БЛОК 2: Спарк */}
            <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2 sm:space-y-3">
              {/* Строка 1: иконка + заголовок + тумблер */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-cyan-100/80 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">Спарк</h3>
                    <p className="hidden sm:block text-[10px] sm:text-xs text-slate-500">Озвучка подсказок и диалогов</p>
                  </div>
                </div>

                {/* Тумблер Спарка */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center shrink-0 ${
                    !voiceMuted
                      ? 'bg-gradient-to-r from-[#A855F7] to-[#22D3EE] justify-end'
                      : 'bg-slate-300 justify-start'
                  }`}
                  title={voiceMuted ? 'Включить Спарка' : 'Выключить Спарка'}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700"
                  >
                    {!voiceMuted ? (
                      <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-600" />
                    ) : (
                      <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    )}
                  </motion.div>
                </button>
              </div>

              {/* Строка 2: проценты + слайдер */}
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-[#17345F] w-10 sm:w-12 shrink-0 text-left">
                  {voicePercent}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceMuted ? 0 : voiceVolume}
                  onChange={handleVoiceVolumeChange}
                  className="flex-1 h-1 sm:h-1.5 sound-slider cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A855F7 0%, #22D3EE ${voicePercent}%, #E2E8F0 ${voicePercent}%, #E2E8F0 100%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. ФУТЕР: кнопка «Готово» */}
          <div className="relative px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-200/60 shrink-0 bg-slate-50/80 backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.012, filter: 'brightness(1.05)' }}
              whileTap={{ scale: 0.985 }}
              onClick={handleClose}
              className="w-full h-10 sm:h-12 md:h-13 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm sm:text-base md:text-lg shadow-[0_8px_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
              }}
            >
              <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              <span>Готово</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SettingsModal;
