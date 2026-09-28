// src/utils/assetUrl.ts

/**
 * Returns a reliable asset URL supporting base URLs (such as GitHub Pages /Spark-Studio/),
 * relative paths, and root deployments.
 */
export function getAssetUrl(relativePath: string): string {
  if (!relativePath) return '';
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:')
  ) {
    return relativePath;
  }

  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBase}${cleanPath}`;
}
