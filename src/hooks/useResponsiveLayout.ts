// src/hooks/useResponsiveLayout.ts
import { useState, useEffect } from 'react';

export type LayoutSize = 'mobile' | 'tablet' | 'desktop';

export function useResponsiveLayout(): LayoutSize {
  const [size, setSize] = useState<LayoutSize>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setSize('mobile');
      else if (w < 1280) setSize('tablet');
      else setSize('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

export function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    const check = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isPortrait;
}
