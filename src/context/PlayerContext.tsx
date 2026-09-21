// src/context/PlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PLAYER, PlayerState, InventoryItem } from '../data/player';
import { storage } from '../lib/storage';

export type GameModalType = 'coins' | 'backpack' | 'profile' | 'achievements' | 'settings' | null;

export interface PlayerProfile {
  id: string;
  name: string;
  studioName: string;
  avatarId: string;
  studioColor: string;
  coins: number;
  level: number;
  xp: number;
  lastPlayed: string;
  playerState: PlayerState;
}

export interface SparkSaveData {
  version: string;
  game: string;
  savedAt: string;
  name: string;
  studioName: string;
  avatarId: string;
  studioColor: string;
  coins: number;
  level: number;
  xp: number;
  completedLessons: string[];
  createdWorks: string[];
  player: PlayerState;
}

interface PlayerContextValue {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  addCoins: (amount: number) => void;
  addItem: (item: InventoryItem) => void;
  userName: string;
  setUserName: (name: string) => void;
  studioName: string;
  setStudioName: (name: string) => void;
  avatarId: string;
  setAvatarId: (avatar: string) => void;
  studioColor: string;
  setStudioColor: (color: string) => void;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  xp: number;
  addXp: (amount: number) => void;
  activeModal: GameModalType;
  openModal: (type: GameModalType) => void;
  closeModal: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebarCollapsed: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  exportSaveKey: () => void;
  importSaveKey: (jsonString: string) => { success: boolean; error?: string };
  hasSavedProgress: boolean;
  profiles: PlayerProfile[];
  currentProfileId: string;
  switchProfile: (profileId: string) => void;
  startNewGame: () => void;
  deleteProfile: (profileId: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

const STORAGE_KEY = 'spark_ux_player_state_v2';
const COLLAPSED_STORAGE_KEY = 'spark_sidebar_collapsed_v1';
const STUDIO_NAME_KEY = 'spark_studio_name';
const AVATAR_ID_KEY = 'spark_avatar_id';
const STUDIO_COLOR_KEY = 'spark_studio_color';
const XP_KEY = 'spark_player_xp';
const LEVEL_KEY = 'spark_player_level';
const HAS_STARTED_KEY = 'spark_game_started_flag';
const PROFILES_STORAGE_KEY = 'spark_profiles_list_v2';
const ACTIVE_PROFILE_ID_KEY = 'spark_active_profile_id_v2';

const DEFAULT_PROFILES: PlayerProfile[] = [
  {
    id: 'kristina_default',
    name: 'Кристина',
    studioName: 'SparkDesign',
    avatarId: 'cat',
    studioColor: '#7C3AED',
    coins: 315,
    level: 3,
    xp: 260,
    lastPlayed: new Date().toISOString(),
    playerState: {
      ...INITIAL_PLAYER,
      coins: 315
    }
  },
  {
    id: 'maxim_default',
    name: 'Максим',
    studioName: 'PixelCraft',
    avatarId: 'fox',
    studioColor: '#FF9600',
    coins: 100,
    level: 1,
    xp: 60,
    lastPlayed: new Date(Date.now() - 86400000).toISOString(),
    playerState: {
      ...INITIAL_PLAYER,
      coins: 100
    }
  },
  {
    id: 'sasha_default',
    name: 'Саша',
    studioName: 'Радуга UX',
    avatarId: 'bunny',
    studioColor: '#10B981',
    coins: 50,
    level: 1,
    xp: 20,
    lastPlayed: new Date(Date.now() - 172800000).toISOString(),
    playerState: {
      ...INITIAL_PLAYER,
      coins: 50
    }
  }
];

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Профили
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PROFILES;
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_PROFILE_ID_KEY) || 'kristina_default';
  });

  // Получаем текущий активный профиль
  const activeProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0] || DEFAULT_PROFILES[0];

  const [player, setPlayer] = useState<PlayerState>(() => {
    return activeProfile.playerState || { ...INITIAL_PLAYER, coins: activeProfile.coins };
  });

  const [userName, setUserNameState] = useState<string>(() => activeProfile.name || 'Кристина');
  const [studioName, setStudioNameState] = useState<string>(() => activeProfile.studioName || 'SparkDesign');
  const [avatarId, setAvatarIdState] = useState<string>(() => activeProfile.avatarId || 'cat');
  const [studioColor, setStudioColorState] = useState<string>(() => activeProfile.studioColor || '#7C3AED');
  const [xp, setXp] = useState<number>(() => activeProfile.xp || 40);
  const [level, setLevel] = useState<number>(() => activeProfile.level || 1);

  const [activeModal, setActiveModal] = useState<GameModalType>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return storage.local.get<boolean>(COLLAPSED_STORAGE_KEY, false);
  });
  const [activeNavTab, setActiveNavTab] = useState<string>('map');

  // Сохранение списка профилей в localStorage
  const persistProfiles = (updatedProfiles: PlayerProfile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
  };

  // Синхронизация текущего состояния в активный профиль
  useEffect(() => {
    setProfiles((prev) => {
      const updated = prev.map((p) => {
        if (p.id === currentProfileId) {
          return {
            ...p,
            name: userName,
            studioName,
            avatarId,
            studioColor,
            coins: player.coins,
            level,
            xp,
            lastPlayed: new Date().toISOString(),
            playerState: player
          };
        }
        return p;
      });
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    localStorage.setItem('user_name', userName);
    localStorage.setItem(STUDIO_NAME_KEY, studioName);
    localStorage.setItem(AVATAR_ID_KEY, avatarId);
    localStorage.setItem(STUDIO_COLOR_KEY, studioColor);
    localStorage.setItem(XP_KEY, String(xp));
    localStorage.setItem(LEVEL_KEY, String(level));
    localStorage.setItem(HAS_STARTED_KEY, 'true');
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, currentProfileId);
  }, [player, userName, studioName, avatarId, studioColor, xp, level, currentProfileId]);

  // Переключение активного профиля
  const switchProfile = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;

    setCurrentProfileId(target.id);
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, target.id);
    setUserNameState(target.name);
    setStudioNameState(target.studioName);
    setAvatarIdState(target.avatarId);
    setStudioColorState(target.studioColor);
    setXp(target.xp);
    setLevel(target.level);
    setPlayer(target.playerState || { ...INITIAL_PLAYER, coins: target.coins });
  };

  // Старт новой игры (сохраняет старый прогресс, создает новый чистый профиль)
  const startNewGame = () => {
    const newId = 'profile_' + Date.now();
    const newProfile: PlayerProfile = {
      id: newId,
      name: 'Юный Дизайнер',
      studioName: 'Спарк Студия',
      avatarId: 'cat',
      studioColor: '#7C3AED',
      coins: 0,
      level: 1,
      xp: 0,
      lastPlayed: new Date().toISOString(),
      playerState: {
        ...INITIAL_PLAYER,
        coins: 0
      }
    };

    const updated = [newProfile, ...profiles];
    persistProfiles(updated);
    switchProfile(newId);
  };

  // Удаление профиля
  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== profileId);
    persistProfiles(remaining);
    if (currentProfileId === profileId) {
      switchProfile(remaining[0].id);
    }
  };

  // Сохранение состояния сворачивания сайдбара
  useEffect(() => {
    storage.local.set(COLLAPSED_STORAGE_KEY, isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const setUserName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserNameState(trimmed);
  };

  const setStudioName = (name: string) => {
    setStudioNameState(name);
  };

  const setAvatarId = (avatar: string) => {
    setAvatarIdState(avatar);
  };

  const setStudioColor = (color: string) => {
    setStudioColorState(color);
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      if (next >= 100 && level === 1) {
        setLevel(2);
      } else if (next >= 250 && level < 3) {
        setLevel(3);
      }
      return next;
    });
  };

  const addCoins = (amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount)
    }));
  };

  const addItem = (item: InventoryItem) => {
    setPlayer((prev) => {
      if (prev.inventory.some((i) => i.id === item.id)) return prev;
      return {
        ...prev,
        inventory: [...prev.inventory, item]
      };
    });
  };

  const openModal = (type: GameModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Экспорт ключа сохранения (.spark)
  const exportSaveKey = () => {
    const saveData: SparkSaveData = {
      version: '1.0.0',
      game: 'spark-ux-studio',
      savedAt: new Date().toISOString(),
      name: userName,
      studioName,
      avatarId,
      studioColor,
      coins: player.coins,
      level,
      xp,
      completedLessons: ['intro_button_design'],
      createdWorks: ['Кнопка "Купить" для магазина игрушек'],
      player
    };

    const jsonString = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '_') || 'spark'}_save.spark`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Импорт ключа сохранения (.spark)
  // При загрузке ключа .spark:
  // Файл содержит имя игрока. Если имя совпадает с существующим — обновить прогресс.
  // Если новое — добавить как новый аккаунт в список и сделать активным!
  const importSaveKey = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Файл повреждён или не является верным форматом .spark' };
      }

      const importedName = data.name ? String(data.name).trim() : 'Игрок';
      const importedCoins = typeof data.coins === 'number' ? data.coins : (data.player?.coins ?? 100);
      const importedStudio = data.studioName || 'SparkDesign';
      const importedAvatar = data.avatarId || 'cat';
      const importedColor = data.studioColor || '#7C3AED';
      const importedXp = typeof data.xp === 'number' ? data.xp : 50;
      const importedLevel = typeof data.level === 'number' ? data.level : 1;

      const importedPlayerState: PlayerState = {
        coins: importedCoins,
        inventory: Array.isArray(data.player?.inventory) ? data.player.inventory : INITIAL_PLAYER.inventory,
        currentIsland: data.player?.currentIsland || 'marie',
        completedIslands: Array.isArray(data.player?.completedIslands) ? data.player.completedIslands : [],
        unlockedIslands: Array.isArray(data.player?.unlockedIslands) ? data.player.unlockedIslands : ['marie', 'kirill', 'sonya']
      };

      // Проверяем, есть ли уже профиль с таким именем
      const existingIndex = profiles.findIndex((p) => p.name.toLowerCase() === importedName.toLowerCase());

      let targetId = '';
      let updatedProfiles: PlayerProfile[] = [];

      if (existingIndex >= 0) {
        // Заменяем существующий
        targetId = profiles[existingIndex].id;
        updatedProfiles = profiles.map((p, idx) => {
          if (idx === existingIndex) {
            return {
              ...p,
              name: importedName,
              studioName: importedStudio,
              avatarId: importedAvatar,
              studioColor: importedColor,
              coins: importedCoins,
              xp: importedXp,
              level: importedLevel,
              lastPlayed: new Date().toISOString(),
              playerState: importedPlayerState
            };
          }
          return p;
        });
      } else {
        // Добавляем как новый аккаунт
        targetId = 'profile_' + Date.now();
        const newProf: PlayerProfile = {
          id: targetId,
          name: importedName,
          studioName: importedStudio,
          avatarId: importedAvatar,
          studioColor: importedColor,
          coins: importedCoins,
          xp: importedXp,
          level: importedLevel,
          lastPlayed: new Date().toISOString(),
          playerState: importedPlayerState
        };
        updatedProfiles = [newProf, ...profiles];
      }

      persistProfiles(updatedProfiles);
      switchProfile(targetId);

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Ошибка чтения JSON: ' + (e instanceof Error ? e.message : 'Неверный файл') };
    }
  };

  const hasSavedProgress = profiles.length > 0;

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
        addCoins,
        addItem,
        userName,
        setUserName,
        studioName,
        setStudioName,
        avatarId,
        setAvatarId,
        studioColor,
        setStudioColor,
        level,
        setLevel,
        xp,
        addXp,
        activeModal,
        openModal,
        closeModal,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapsed,
        activeNavTab,
        setActiveNavTab,
        exportSaveKey,
        importSaveKey,
        hasSavedProgress,
        profiles,
        currentProfileId,
        switchProfile,
        startNewGame,
        deleteProfile
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
