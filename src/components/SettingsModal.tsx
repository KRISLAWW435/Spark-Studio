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
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
        {/* Затемнение фона для закрытия */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Контейнер модалки: 3 изолированных блока, max-h-[85vh], overflow-hidden */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-b from-slate-50 to-white w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden"
        >
          {/* Декоративное мягкое свечение */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* 1. ФИКСИРОВАННАЯ ШАПКА */}
          <div className="flex-none p-6 pb-4 border-b border-slate-100 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#22D3EE] flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#1A1A2E] leading-tight">
                  Настройки звука
                </h2>
                <p className="text-xs text-[#64748B] font-medium leading-tight mt-0.5">
                  Настройте комфортный уровень звука для игры
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0 ml-2"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. СКРОЛЛИРУЕМОЕ ТЕЛО */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar relative z-10">
            {/* БЛОК 1: Музыка */}
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
              {/* Верхняя строка: иконка + заголовки + переключатель */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/80 flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 text-[#A855F7]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1A1A2E] leading-tight">
                      Музыка
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium mt-0.5">
                      Фоновые мелодии и атмосфера
                    </p>
                  </div>
                </div>

                {/* Переключатель (Toggle Switch) */}
                <button
                  type="button"
                  onClick={handleToggleMusic}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 relative cursor-pointer flex items-center shrink-0 ${
                    !musicMuted ? 'bg-[#A855F7]' : 'bg-slate-200'
                  }`}
                  title={musicMuted ? 'Включить музыку' : 'Выключить музыку'}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                      !musicMuted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {!musicMuted ? (
                      <Volume2 className="w-3 h-3 text-[#A855F7]" />
                    ) : (
                      <VolumeX className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Нижняя строка: слайдер громкости + процент справа */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicMuted ? 0 : musicVolume}
                  onChange={handleMusicVolumeChange}
                  className="h-2 w-full bg-slate-100 rounded-full accent-[#A855F7] cursor-pointer"
                />
                <span className="text-[#A855F7] font-bold text-sm w-10 text-right shrink-0">
                  {musicPercent}%
                </span>
              </div>
            </div>

            {/* БЛОК 2: Спарк */}
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
              {/* Верхняя строка: иконка + заголовки + переключатель */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100/80 flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1A1A2E] leading-tight">
                      Спарк
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium mt-0.5">
                      Озвучка подсказок и диалогов
                    </p>
                  </div>
                </div>

                {/* Переключатель (Toggle Switch) */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 relative cursor-pointer flex items-center shrink-0 ${
                    !voiceMuted ? 'bg-[#A855F7]' : 'bg-slate-200'
                  }`}
                  title={voiceMuted ? 'Включить Спарка' : 'Выключить Спарка'}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                      !voiceMuted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {!voiceMuted ? (
                      <Mic className="w-3 h-3 text-cyan-600" />
                    ) : (
                      <MicOff className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Нижняя строка: слайдер громкости + процент справа */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceMuted ? 0 : voiceVolume}
                  onChange={handleVoiceVolumeChange}
                  className="h-2 w-full bg-slate-100 rounded-full accent-[#A855F7] cursor-pointer"
                />
                <span className="text-[#A855F7] font-bold text-sm w-10 text-right shrink-0">
                  {voicePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* 3. ФИКСИРОВАННЫЙ ФУТЕР */}
          <div className="flex-none p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 relative z-10">
            <motion.button
              whileHover={{ scale: 1.01, filter: 'brightness(1.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base shadow-[0_8px_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer bg-gradient-to-r from-[#A855F7] to-[#22D3EE]"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Готово</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SettingsModal;
