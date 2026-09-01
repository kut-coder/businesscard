import { VITAMINKA_IMAGE } from './characters.js';
import { removeWhiteBackground } from './image-utils.js';

let cachedVitaminkaSrc = null;

export async function getVitaminkaCutoutSrc() {
  if (!cachedVitaminkaSrc) {
    cachedVitaminkaSrc = await removeWhiteBackground(VITAMINKA_IMAGE);
  }
  return cachedVitaminkaSrc;
}

export function preloadVitaminkaCutout() {
  getVitaminkaCutoutSrc().catch(() => {});
}
