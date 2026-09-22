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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Затемнение фона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Контейнер модалки */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[460px] bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/70 overflow-hidden"
        >
          {/* Декоративное свечение */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Заголовок и кнопка закрытия */}
          <div className="relative flex items-center justify-between pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Sparkles size={20} className="fill-white/20" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Настройки звука
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Закрыть"
            >
              <X size={20} />
            </button>
          </div>

          {/* Секции настроек */}
          <div className="relative mt-6 space-y-6">
            {/* БЛОК 1: Музыка */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Music size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">Музыка</h3>
                    <p className="text-xs text-slate-500">Фоновые мелодии и атмосфера</p>
                  </div>
                </div>

                {/* Тумблер Музыки */}
                <button
                  onClick={handleToggleMusic}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center ${
                    !musicMuted
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 justify-end'
                      : 'bg-slate-300 justify-start'
                  }`}
                  title={musicMuted ? 'Включить музыку' : 'Выключить музыку'}
                >
                  <motion.div
                    layout
                    className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700"
                  >
                    {!musicMuted ? (
                      <Volume2 size={13} className="text-purple-600" />
                    ) : (
                      <VolumeX size={13} className="text-slate-400" />
                    )}
                  </motion.div>
                </button>
              </div>

              {/* Слайдер громкости музыки */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 w-8">
                  {musicMuted ? '0%' : `${Math.round(musicVolume * 100)}%`}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicMuted ? 0 : musicVolume}
                  onChange={handleMusicVolumeChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            {/* БЛОК 2: Голос Спарк */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                    <Mic size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">Голос Спарк</h3>
                    <p className="text-xs text-slate-500">Озвучка подсказок и диалогов</p>
                  </div>
                </div>

                {/* Тумблер Голоса */}
                <button
                  onClick={handleToggleVoice}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center ${
                    !voiceMuted
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 justify-end'
                      : 'bg-slate-300 justify-start'
                  }`}
                  title={voiceMuted ? 'Включить голос' : 'Выключить голос'}
                >
                  <motion.div
                    layout
                    className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700"
                  >
                    {!voiceMuted ? (
                      <Mic size={13} className="text-cyan-600" />
                    ) : (
                      <MicOff size={13} className="text-slate-400" />
                    )}
                  </motion.div>
                </button>
              </div>

              {/* Слайдер громкости голоса */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 w-8">
                  {voiceMuted ? '0%' : `${Math.round(voiceVolume * 100)}%`}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceMuted ? 0 : voiceVolume}
                  onChange={handleVoiceVolumeChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Кнопка «Готово» */}
          <div className="mt-7">
            <motion.button
              whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full h-13 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-[0_8px_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
              }}
            >
              <Check size={20} className="stroke-[2.5]" />
              <span>Готово</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default SettingsModal;
