// src/hooks/useSoundSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { SoundManager } from '../services/SoundManager';

export interface SoundSettings {
  musicVolume: number; // 0–100, по умолчанию 40
  voiceVolume: number; // 0–100, по умолчанию 65
  isMusicMuted: boolean; // по умолчанию false
  isVoiceMuted: boolean; // по умолчанию false
  updatedAt: string; // ISO-дата
}

export const SOUND_SETTINGS_STORAGE_KEY = 'spark_studio_sound_settings';
export const SOUND_SETTINGS_VERSION_KEY = 'spark_studio_sound_settings_version';
export const CURRENT_SETTINGS_VERSION = 3; // сброс до дефолтов 40/65

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  musicVolume: 40,   // дефолт музыки 40%
  voiceVolume: 65,   // дефолт голоса 65%
  isMusicMuted: false,
  isVoiceMuted: false,
  updatedAt: new Date().toISOString(),
};

/**
 * Чтение сохранённых настроек из localStorage с миграцией версий
 */
export function getStoredSoundSettings(): SoundSettings {
  if (typeof window === 'undefined') return DEFAULT_SOUND_SETTINGS;
  try {
    const savedVersion = localStorage.getItem(SOUND_SETTINGS_VERSION_KEY);

    // Если версия старая или отсутствует — сбрасываем к новым дефолтам (40/65)
    if (savedVersion !== String(CURRENT_SETTINGS_VERSION)) {
      localStorage.removeItem(SOUND_SETTINGS_STORAGE_KEY);
      localStorage.setItem(SOUND_SETTINGS_VERSION_KEY, String(CURRENT_SETTINGS_VERSION));
      localStorage.setItem('music_volume', '0.40');
      localStorage.setItem('voice_volume', '0.65');
      return DEFAULT_SOUND_SETTINGS;
    }

    const raw = localStorage.getItem(SOUND_SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        musicVolume: typeof parsed.musicVolume === 'number' && parsed.musicVolume > 0
          ? Math.max(0, Math.min(100, parsed.musicVolume))
          : DEFAULT_SOUND_SETTINGS.musicVolume,
        voiceVolume: typeof parsed.voiceVolume === 'number' && parsed.voiceVolume > 0
          ? Math.max(0, Math.min(100, parsed.voiceVolume))
          : DEFAULT_SOUND_SETTINGS.voiceVolume,
        isMusicMuted: typeof parsed.isMusicMuted === 'boolean' ? parsed.isMusicMuted : DEFAULT_SOUND_SETTINGS.isMusicMuted,
        isVoiceMuted: typeof parsed.isVoiceMuted === 'boolean' ? parsed.isVoiceMuted : DEFAULT_SOUND_SETTINGS.isVoiceMuted,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[useSoundSettings] Failed to parse sound settings:', err);
  }
  return DEFAULT_SOUND_SETTINGS;
}

/**
 * Применение настроек звука к SoundManager
 */
export function applySoundSettings(settings: SoundSettings): void {
  SoundManager.setMusicVolume(settings.musicVolume / 100);
  SoundManager.setVoiceVolume(settings.voiceVolume / 100);
  SoundManager.setMusicMuted(settings.isMusicMuted);
  SoundManager.setVoiceMuted(settings.isVoiceMuted);
}

/**
 * Хук для управления настройками звука
 */
export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(() => getStoredSoundSettings());

  // Инициализация при первом монтировании
  useEffect(() => {
    const stored = getStoredSoundSettings();
    setSettings(stored);
    applySoundSettings(stored);
  }, []);

  const saveSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSettings((prev) => {
      const updated: SoundSettings = {
        ...prev,
        ...newSettings,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(SOUND_SETTINGS_VERSION_KEY, String(CURRENT_SETTINGS_VERSION));
      }
      applySoundSettings(updated);
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    saveSettings(DEFAULT_SOUND_SETTINGS);
  }, [saveSettings]);

  const reloadSettings = useCallback(() => {
    const stored = getStoredSoundSettings();
    setSettings(stored);
    applySoundSettings(stored);
    return stored;
  }, []);

  return {
    settings,
    musicVolume: settings.musicVolume,
    voiceVolume: settings.voiceVolume,
    isMusicMuted: settings.isMusicMuted,
    isVoiceMuted: settings.isVoiceMuted,
    setMusicVolume: (v: number) => saveSettings({ musicVolume: v }),
    setVoiceVolume: (v: number) => saveSettings({ voiceVolume: v }),
    setIsMusicMuted: (m: boolean) => saveSettings({ isMusicMuted: m }),
    setIsVoiceMuted: (m: boolean) => saveSettings({ isVoiceMuted: m }),
    toggleMusicMute: () => saveSettings({ isMusicMuted: !settings.isMusicMuted }),
    toggleVoiceMute: () => saveSettings({ isVoiceMuted: !settings.isVoiceMuted }),
    resetToDefaults,
    saveSettings,
    reloadSettings,
  };
}
