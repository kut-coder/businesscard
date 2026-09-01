import { getCharacterImage, hasCharacterImage, hasNeutralImage, VITAMINKA_IMAGE } from './characters.js';
import { WRONG_MESSAGE } from './data.js';
import { applyCutoutToImages } from './image-utils.js';

function renderProductVisual(option, state, useImage, preferNeutral = false) {
  if (useImage) {
    const imageSrc = getCharacterImage(option.id, state, { preferNeutral });
    if (imageSrc) {
      const neutralFallback = preferNeutral && !hasNeutralImage(option.id);
      const imageClass = neutralFallback ? 'product-image product-image--neutral-fallback' : 'product-image';
      return `<div class="product-visual"><img class="${imageClass}" src="${imageSrc}" alt="" loading="lazy"></div>`;
    }
  }

  return `<div class="product-visual product-emoji" aria-hidden="true">${option.emoji}</div>`;
}

/** Компонент карточки продукта */

export function createProductCard(option, { onSelect, state = 'neutral', disabled = false, multiSelected = false, useImage = true, preferNeutral = false, textOption = false }) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'product-card';
  card.dataset.id = option.id;

  if (textOption) {
    card.classList.add('text-option-card');
  } else if (useImage && hasCharacterImage(option.id)) {
    card.classList.add('has-image');
  }

  if (disabled) card.classList.add('disabled');
  if (state === 'happy') card.classList.add('state-happy', 'selected-correct');
  if (state === 'sad') card.classList.add('state-sad', 'selected-wrong');
  if (multiSelected) card.classList.add('selected-multi');

  if (textOption) {
    card.innerHTML = `
      <span class="text-option-icon" aria-hidden="true">${option.emoji}</span>
      <span class="text-option-label">${option.name}</span>
    `;
  } else {
    card.innerHTML = `
      ${renderProductVisual(option, state, useImage, preferNeutral)}
      <span class="product-name">${option.name}</span>
    `;
  }

  if (!disabled && state === 'neutral') {
    card.addEventListener('click', () => onSelect(option.id));
  }

  return card;
}

/** Компонент экрана вопроса */

export function createQuestionScreen({
  mode,
  question,
  questionIndex,
  totalQuestions,
  vitamins,
  showHint,
  showWrong,
  wrongCount = 0,
  selectedIds = [],
  factVisible = false,
  onSelect,
  onContinue,
}) {
  const container = document.createElement('div');
  container.className = 'screen active question-screen';

  if (question.vitamin === 'B12') {
    container.classList.add('question-screen--b12');
  }

  const progress = ((questionIndex + (factVisible ? 1 : 0)) / totalQuestions) * 100;

  container.innerHTML = `
    <div class="game-header">
      <span class="vitamins-count">
        <img class="vitamins-icon" data-cutout src="${VITAMINKA_IMAGE}" alt="" aria-hidden="true">
        <span class="vitamins-number">${vitamins}</span>
        <span class="vitamins-label">Витаминок</span>
      </span>
      <div class="progress-bar" role="progressbar" aria-valuenow="${questionIndex + 1}" aria-valuemin="0" aria-valuemax="${totalQuestions}" aria-label="Вопрос ${questionIndex + 1} из ${totalQuestions}">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    <div class="question-block">
      ${question.vitamin && question.vitamin !== 'variety' ? `<span class="question-vitamin">Витамин ${question.vitamin}</span>` : ''}
      <h2 class="question-text">${question.question}</h2>
    </div>
    <div class="messages-area"></div>
    ${question.multiSelect ? '<p class="multi-hint">Выбери оба правильных ответа</p>' : ''}
    <div class="products-grid ${question.textOptions ? 'text-options' : ''}"></div>
    <div class="fact-area"></div>
  `;

  const messagesArea = container.querySelector('.messages-area');
  const grid = container.querySelector('.products-grid');
  const factArea = container.querySelector('.fact-area');

  if (showWrong) {
    const wrong = document.createElement('div');
    wrong.className = 'wrong-message';
    wrong.innerHTML = WRONG_MESSAGE;
    messagesArea.appendChild(wrong);
  }

  if (showHint && question.hint) {
    const hint = document.createElement('div');
    hint.className = 'hint-box' + (wrongCount >= 2 ? ' hint-box--compact' : '');
    hint.textContent = question.hint;
    messagesArea.appendChild(hint);
  }

  if (question.multiSelect && selectedIds.length > 0 && !factVisible) {
    const count = document.createElement('p');
    count.className = 'selected-count';
    count.textContent = `Выбрано: ${selectedIds.length} из 2`;
    messagesArea.appendChild(count);
  }

  question.options.forEach((option) => {
    let cardState = 'neutral';
    let disabled = factVisible;

    if (factVisible) {
      if (option.correct) cardState = 'happy';
    } else if (selectedIds.includes(option.id) && !option.correct) {
      cardState = 'sad';
    }

    const preferNeutral = cardState === 'neutral' && !question.textOptions;

    const card = createProductCard(option, {
      onSelect,
      state: cardState,
      disabled,
      multiSelected: question.multiSelect && selectedIds.includes(option.id),
      useImage: !question.textOptions,
      preferNeutral,
      textOption: Boolean(question.textOptions),
    });

    grid.appendChild(card);
  });

  if (factVisible) {
    const panel = document.createElement('div');
    panel.className = 'fact-panel';

    let html = `
      <div class="fact-panel-plate" aria-hidden="true"></div>
      <div class="fact-panel-content${question.vitamin === 'B12' ? ' fact-panel-content--compact' : ''}">
        <div class="fact-speech${question.vitamin === 'B12' ? ' fact-speech--compact' : ''}">
          ${question.vitamin === 'B12' ? '' : '<span class="fact-speech-icon" aria-hidden="true">💬</span>'}
          <p class="fact-reaction">${question.reaction}</p>
        </div>
    `;

    if (question.factTitle) {
      html += `
        <div class="fact-title-row">
          <span class="fact-title-badge" aria-hidden="true">✨</span>
          <h3 class="fact-title">${question.factTitle}</h3>
        </div>
      `;
    }

    const allFacts = [...(question.facts || [])];
    if (allFacts.length > 0) {
      html += '<ul class="fact-list">';
      allFacts.forEach((f, index) => {
        html += `<li class="fact-list-item fact-list-item--${index % 3}">${f}</li>`;
      });
      html += '</ul>';
    }

    html += `
        <div class="points-badge">
          <img class="points-vitaminka" data-cutout src="${VITAMINKA_IMAGE}" alt="" aria-hidden="true">
          <span>+${question.points} Витаминок</span>
        </div>
        <div class="btn-group fact-actions">
          <button type="button" class="btn btn-primary fact-continue">Дальше →</button>
        </div>
      </div>
    `;

    panel.innerHTML = html;
    factArea.appendChild(panel);

    panel.querySelector('.fact-continue').addEventListener('click', onContinue);
  }

  applyCutoutToImages(container);

  return container;
}

/** Профиль результата */

export function createProfileScreen({ title, textLines, vitamins, showAdultHandoff, onAdult, onContinue }) {
  const screen = document.createElement('div');
  screen.className = 'screen active';

  let html = `
    <div class="profile-card">
      ${vitamins !== undefined ? `
        <div class="profile-vitamins">
          <img class="profile-vitaminka" data-cutout src="${VITAMINKA_IMAGE}" alt="" aria-hidden="true">
          ${vitamins}
        </div>` : ''}
      <h2 class="profile-title">${title}</h2>
      <div class="profile-text">
        ${textLines.map((t) => `<p>${t}</p>`).join('')}
      </div>
    </div>
  `;

  if (showAdultHandoff) {
    html += `
      <p class="screen-text" style="font-weight:700">🌶️ <strong>А мама или папа справятся?</strong></p>
      <p class="screen-text">Кажется, пришло время проверить взрослых! 😏</p>
      <div class="btn-group">
        <button type="button" class="btn btn-primary handoff-btn">Передать игру взрослому →</button>
      </div>
    `;
  } else if (onContinue) {
    html += `
      <div class="btn-group">
        <button type="button" class="btn btn-primary continue-btn">Дальше →</button>
      </div>
    `;
  }

  screen.innerHTML = html;

  if (showAdultHandoff) {
    screen.querySelector('.handoff-btn').addEventListener('click', onAdult);
  } else if (onContinue) {
    screen.querySelector('.continue-btn').addEventListener('click', onContinue);
  }

  applyCutoutToImages(screen);

  return screen;
}
