import { get, set, del } from 'idb-keyval';

export const storage = {
  local: {
    get: <T>(key: string, defaultValue: T): T => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
      }
    },
    set: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
  },
  db: {
    get: async <T>(key: string, defaultValue?: T): Promise<T | undefined> => {
      const val = await get(key);
      return val !== undefined ? val : defaultValue;
    },
    set: async <T>(key: string, value: T): Promise<void> => {
      await set(key, value);
    },
    del: async (key: string): Promise<void> => {
      await del(key);
    },
  },
};
