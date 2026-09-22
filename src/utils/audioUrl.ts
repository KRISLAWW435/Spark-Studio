// src/utils/audioUrl.ts

/**
 * Returns a reliable, absolute URL for public audio assets,
 * safe for use in iframes, hash routers, and subpaths.
 */
export function getAudioUrl(relativePath: string): string {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const baseUrl = import.meta.env.BASE_URL;

  if (!baseUrl || baseUrl === './' || baseUrl === '/') {
    return `/${cleanPath}`;
  }

  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const prefix = cleanBase.startsWith('/') ? cleanBase : `/${cleanBase}`;
  return `${prefix}${cleanPath}`;
}
