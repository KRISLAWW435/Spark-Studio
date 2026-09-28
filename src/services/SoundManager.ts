// src/services/SoundManager.ts
import { soundManager } from '../utils/soundManager';

export class SoundManager {
  private static musicVolume = 0.40;
  private static voiceVolume = 0.65;

  static setMusicVolume(volume: number): void {
    SoundManager.musicVolume = volume;
    soundManager.setMusicVolume(volume);
  }

  static setVoiceVolume(volume: number): void {
    SoundManager.voiceVolume = volume;
    soundManager.setVoiceVolume(volume);
  }

  static setMusicMuted(muted: boolean): void {
    soundManager.setMusicMuted(muted);
  }

  static setVoiceMuted(muted: boolean): void {
    soundManager.setVoiceMuted(muted);
  }

  static getMusicVolume(): number {
    return soundManager.getMusicVolume() ?? SoundManager.musicVolume;
  }

  static getVoiceVolume(): number {
    return soundManager.getVoiceVolume() ?? SoundManager.voiceVolume;
  }

  static isMusicMuted(): boolean {
    return soundManager.isMusicMuted();
  }

  static isVoiceMuted(): boolean {
    return soundManager.isVoiceMuted();
  }

  static playClick(): void {
    soundManager.playClick();
  }

  static playSuccess(): void {
    soundManager.playSuccess();
  }

  static playCelebration(): void {
    soundManager.playCelebration();
  }

  static playWhoosh(): void {
    soundManager.playWhoosh();
  }

  static playError(): void {
    soundManager.playError();
  }

  // Экземплярные методы для совместимости
  setMusicVolume(volume: number): void {
    SoundManager.setMusicVolume(volume);
  }

  setVoiceVolume(volume: number): void {
    SoundManager.setVoiceVolume(volume);
  }

  setMusicMuted(muted: boolean): void {
    SoundManager.setMusicMuted(muted);
  }

  setVoiceMuted(muted: boolean): void {
    SoundManager.setVoiceMuted(muted);
  }
}

export default SoundManager;
