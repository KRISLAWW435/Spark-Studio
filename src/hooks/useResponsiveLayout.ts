// src/hooks/useResponsiveLayout.ts
import { useState, useEffect } from 'react';

export type LayoutSize = 'mobile' | 'tablet' | 'desktop';

function getInitialLayoutSize(): LayoutSize {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isLandscape = w > h;

  // Если landscape и высота < 500px — это точно телефон (напр. Xiaomi Redmi 9 936x432, iPhone 844x390)
  if (isLandscape && h < 500) {
    return 'mobile';
  } else if (w < 768) {
    return 'mobile';
  } else if (w < 1280) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export function useResponsiveLayout(): LayoutSize {
  const [size, setSize] = useState<LayoutSize>(getInitialLayoutSize);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLandscape = w > h;

      // Если landscape и высота < 500px — это точно телефон
      if (isLandscape && h < 500) {
        setSize('mobile');
      } else if (w < 768) {
        setSize('mobile');
      } else if (w < 1280) {
        setSize('tablet');
      } else {
        setSize('desktop');
      }
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
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
