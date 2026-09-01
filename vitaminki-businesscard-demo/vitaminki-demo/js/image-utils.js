/** Убирает белый фон у PNG — для стартового экрана */

export function removeWhiteBackground(src, threshold = 238) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function applyCutoutToImages(root, selector = 'img[data-cutout]') {
  const images = root.querySelectorAll(selector);
  await Promise.all([...images].map(async (el) => {
    try {
      el.src = await removeWhiteBackground(el.dataset.src || el.src);
    } catch {
      /* оставляем исходник */
    }
  }));
}
