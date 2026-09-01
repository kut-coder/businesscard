export const VITAMINKA_IMAGE = 'assets/characters/vitaminka.png';
export const NUTRITIONIST_IMAGE = 'assets/characters/nutritionist.png';
export const ICON_CHILD = 'assets/characters/icon-child.png';
export const ICON_GIRL = 'assets/characters/icon-girl.png';
export const ICON_ADULT = 'assets/characters/icon-adult.png';
export const ICON_WOMAN = 'assets/characters/icon-woman.png';

export const ASSET_VERSION = 'demo1';

function assetPath(name, mood) {
  return `assets/characters/${name}-${mood}.png?v=${ASSET_VERSION}`;
}

function trio(name) {
  return {
    neutral: assetPath(name, 'neutral'),
    happy: assetPath(name, 'happy'),
    sad: assetPath(name, 'sad'),
  };
}

const salmonImages = { happy: assetPath('salmon', 'happy') };

export const CHARACTER_IMAGES = {
  pepper: { happy: assetPath('pepper', 'happy') },
  carrot: trio('carrot'),
  broccoli: { happy: assetPath('broccoli', 'happy') },
  orange: { happy: assetPath('orange', 'happy') },
  spinach: trio('spinach'),
  egg: trio('egg'),
  rice: trio('rice'),
  pear: trio('pear'),
  bread: trio('bread'),
  apple: trio('apple'),
  avocado: trio('avocado'),
  fish: salmonImages,
  salmon: salmonImages,
};

export function getCharacterImage(optionId, state = 'neutral', { preferNeutral = false } = {}) {
  const images = CHARACTER_IMAGES[optionId];
  if (!images) return null;
  if (state === 'sad') return images.sad || images.happy;
  if (state === 'happy') return images.happy;
  if (preferNeutral && images.neutral) return images.neutral;
  return images.happy;
}

export function hasCharacterImage(optionId) {
  return Boolean(CHARACTER_IMAGES[optionId]);
}

export function hasNeutralImage(optionId) {
  return Boolean(CHARACTER_IMAGES[optionId]?.neutral);
}
