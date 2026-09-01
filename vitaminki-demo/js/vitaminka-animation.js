import { getVitaminkaCutoutSrc } from './vitaminka-utils.js';

/**
 * Запускает вылет витаминок от правильных карточек к счётчику.
 */
export function animateVitaminkasToCounter(screen, correctOptionIds, points = 10) {
  const target = screen.querySelector('.vitamins-count');
  if (!target || !correctOptionIds.length) return;

  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width * 0.2;
  const targetY = targetRect.top + targetRect.height / 2;

  const totalFly = Math.max(1, Math.round(points / 10));

  getVitaminkaCutoutSrc().then((vitaminkaSrc) => {
    correctOptionIds.forEach((id, cardIndex) => {
      const card = screen.querySelector(`.product-card[data-id="${id}"]`);
      if (!card) return;

      const startRect = card.getBoundingClientRect();
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      const perCard = Math.ceil(totalFly / correctOptionIds.length);

      for (let i = 0; i < perCard; i += 1) {
        const delay = cardIndex * 280 + i * 180;
        setTimeout(() => spawnFlyingVitaminka(startX, startY, targetX, targetY, vitaminkaSrc), delay);
      }
    });

    setTimeout(() => {
      target.classList.add('vitamins-count--pop');
      setTimeout(() => target.classList.remove('vitamins-count--pop'), 500);
    }, 900 + correctOptionIds.length * 220);
  });
}

function spawnFlyingVitaminka(startX, startY, endX, endY, vitaminkaSrc) {
  const fly = document.createElement('img');
  fly.src = vitaminkaSrc;
  fly.alt = '';
  fly.className = 'flying-vitaminka';
  fly.style.left = `${startX}px`;
  fly.style.top = `${startY}px`;
  document.body.appendChild(fly);

  const offsetX = (Math.random() - 0.5) * 36;
  const offsetY = (Math.random() - 0.5) * 24;
  const midX = (startX + endX) / 2 + offsetX;
  const midY = Math.min(startY, endY) - 80 - Math.random() * 40;

  requestAnimationFrame(() => {
    fly.animate([
      { transform: 'translate(-50%, -50%) scale(0.85)', opacity: 1 },
      { transform: `translate(calc(-50% + ${midX - startX}px), calc(-50% + ${midY - startY}px)) scale(1.15)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${endX - startX}px), calc(-50% + ${endY - startY}px)) scale(0.5)`, opacity: 0.35 },
    ], {
      duration: 1600,
      easing: 'cubic-bezier(0.25, 0.85, 0.35, 1)',
      fill: 'forwards',
    }).onfinish = () => fly.remove();
  });
}
