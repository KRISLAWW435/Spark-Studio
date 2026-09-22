// src/utils/audioUrl.ts

/**
 * Returns a reliable, absolute URL for public audio assets,
 * safe for use in iframes, GitHub Pages, hash routers, and subpaths.
 */
export function getAudioUrl(relativePath: string): string {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  if (typeof window !== 'undefined') {
    // 1. If baseUrl is explicitly configured and not root / relative
    const baseUrl = import.meta.env.BASE_URL;
    if (baseUrl && baseUrl !== './' && baseUrl !== '/') {
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const basePrefix = cleanBase.startsWith('/') ? cleanBase : `/${cleanBase}`;
      return `${window.location.origin}${basePrefix}${cleanPath}`;
    }

    // 2. Resolve relative to actual deployment path in the browser
    // Handles GitHub Pages repository paths (e.g. /Spark-Studio/), subfolders, and root domain
    try {
      const pathname = window.location.pathname;
      // Get the base directory path (e.g. /Spark-Studio/ or /)
      const lastSlashIndex = pathname.lastIndexOf('/');
      const dirPath = lastSlashIndex >= 0 ? pathname.substring(0, lastSlashIndex + 1) : '/';
      return new URL(cleanPath, `${window.location.origin}${dirPath}`).href;
    } catch {
      // fallback to relative
    }
  }

  return `./${cleanPath}`;
}
