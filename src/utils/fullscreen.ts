// src/utils/fullscreen.ts

export const isFullscreenActive = (): boolean => {
  if (typeof document === 'undefined') return false;
  const doc = document as any;
  return Boolean(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
};

export const requestFullscreen = (target?: Element | null): void => {
  if (typeof document === 'undefined') return;
  if (isFullscreenActive()) return;

  const el = (target || document.documentElement) as any;
  const body = document.body as any;

  try {
    if (typeof el.requestFullscreen === 'function') {
      const p = el.requestFullscreen();
      if (p && typeof p.catch === 'function') {
        p.catch((err: any) => {
          console.warn('requestFullscreen on documentElement failed, trying body:', err);
          if (body && typeof body.requestFullscreen === 'function') {
            body.requestFullscreen().catch(() => {});
          } else if (body && typeof body.webkitRequestFullscreen === 'function') {
            body.webkitRequestFullscreen();
          }
        });
      }
    } else if (typeof el.webkitRequestFullscreen === 'function') {
      el.webkitRequestFullscreen();
    } else if (typeof el.webkitRequestFullScreen === 'function') {
      el.webkitRequestFullScreen();
    } else if (typeof el.mozRequestFullScreen === 'function') {
      el.mozRequestFullScreen();
    } else if (typeof el.msRequestFullscreen === 'function') {
      el.msRequestFullscreen();
    } else if (body && typeof body.webkitRequestFullscreen === 'function') {
      body.webkitRequestFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen execution exception:', err);
  }
};

export const exitFullscreen = (): void => {
  if (typeof document === 'undefined') return;
  const doc = document as any;
  if (!isFullscreenActive()) return;

  try {
    if (typeof doc.exitFullscreen === 'function') {
      doc.exitFullscreen().catch((err: any) => console.warn(err));
    } else if (typeof doc.webkitExitFullscreen === 'function') {
      doc.webkitExitFullscreen();
    } else if (typeof doc.mozCancelFullScreen === 'function') {
      doc.mozCancelFullScreen();
    } else if (typeof doc.msExitFullscreen === 'function') {
      doc.msExitFullscreen();
    }
  } catch (err) {
    console.warn('Exit fullscreen exception:', err);
  }
};

export const toggleFullscreen = (): void => {
  if (isFullscreenActive()) {
    exitFullscreen();
  } else {
    requestFullscreen();
  }
};
