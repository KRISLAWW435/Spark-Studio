import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => storage.local.get(key, initialValue));

  useEffect(() => {
    storage.local.set(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
