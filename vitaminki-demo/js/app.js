import {
  CHILD_QUESTIONS,
  CHILD_PROFILES,
  ADULT_QUESTIONS,
  DEMO_CHILD_VITAMINS_SHOWCASE,
} from './data.js';
import {
  createQuestionScreen,
  createProfileScreen,
} from './components.js';
import { getCharacterImage, VITAMINKA_IMAGE, NUTRITIONIST_IMAGE, ICON_CHILD, ICON_GIRL } from './characters.js';
import { applyCutoutToImages } from './image-utils.js';
import { animateVitaminkasToCounter } from './vitaminka-animation.js';
import { preloadVitaminkaCutout } from './vitaminka-utils.js';

const app = document.getElementById('app');

const state = {
  mode: null,
  questionIndex: 0,
  vitamins: 0,
  wrongCount: 0,
  selectedIds: [],
  factVisible: false,
  showWrong: false,
  showHint: false,
  fromChildHandoff: false,
  justCorrect: false,
  shuffledOptions: null,
  shuffledOptionsKey: null,
};

let currentScreenId = null;
let navHistory = [];
let skipNextHistoryPush = false;

function cloneState() {
  return {
    mode: state.mode,
    questionIndex: state.questionIndex,
    vitamins: state.vitamins,
    wrongCount: state.wrongCount,
    selectedIds: [...state.selectedIds],
    factVisible: state.factVisible,
    showWrong: state.showWrong,
    showHint: state.showHint,
    fromChildHandoff: state.fromChildHandoff,
    justCorrect: state.justCorrect,
    shuffledOptions: state.shuffledOptions ? [...state.shuffledOptions] : null,
    shuffledOptionsKey: state.shuffledOptionsKey,
  };
}

function restoreState(snapshot) {
  Object.assign(state, {
    ...snapshot,
    selectedIds: [...snapshot.selectedIds],
    shuffledOptions: snapshot.shuffledOptions ? [...snapshot.shuffledOptions] : null,
  });
}

function renderScreenById(screenId) {
  switch (screenId) {
    case 'start':
      renderStart();
      break;
    case 'question':
      renderQuestion();
      break;
    case 'child-profile':
      renderChildProfile();
      break;
    case 'plate-transition':
      renderPlateTransition();
      break;
    case 'nutritionist':
      renderNutritionist();
      break;
    case 'contact-soon':
      renderContactSoon();
      break;
    default:
      break;
  }
}

function navigateTo(screenId) {
  if (!skipNextHistoryPush && currentScreenId !== null && currentScreenId !== screenId) {
    navHistory.push({ screenId: currentScreenId, state: cloneState() });
  }
  skipNextHistoryPush = false;
  currentScreenId = screenId;
  renderScreenById(screenId);
}

function goBack() {
  if (currentScreenId === 'question' && canUndoQuestionState()) {
    undoQuestionAttempt();
    renderQuestion();
    return;
  }

  if (navHistory.length === 0) return;

  const previous = navHistory.pop();
  restoreState(previous.state);
  skipNextHistoryPush = true;
  currentScreenId = previous.screenId;
  renderScreenById(previous.screenId);
}

function canUndoQuestionState() {
  if (state.factVisible) return true;
  if (state.showWrong && state.selectedIds.length > 0) return true;
  return false;
}

function undoQuestionAttempt() {
  const question = getCurrentQuestion();

  if (state.factVisible) {
    state.vitamins = Math.max(0, state.vitamins - question.points);
    state.factVisible = false;
    state.justCorrect = false;
    state.selectedIds = [];
    state.wrongCount = 0;
    state.showWrong = false;
    state.showHint = false;
    return;
  }

  if (state.showWrong && state.selectedIds.length > 0) {
    state.selectedIds = [];
    state.showWrong = false;
    state.wrongCount = Math.max(0, state.wrongCount - 1);
    if (state.wrongCount < 2) {
      state.showHint = false;
    }
  }
}

function goToBranchStart() {
  if (state.mode === 'child') {
    resetGame('child');
    navHistory = [];
    skipNextHistoryPush = true;
    currentScreenId = 'question';
    renderQuestion();
    return;
  }

  if (state.mode === 'adult') {
    const fromHandoff = state.fromChildHandoff;
    resetGame('adult', fromHandoff);
    navHistory = [];
    skipNextHistoryPush = true;
    currentScreenId = 'question';
    renderQuestion();
  }
}

function showScreen(element) {
  app.innerHTML = '';
  app.appendChild(element);
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetGame(mode, fromHandoff = false) {
  state.mode = mode;
  state.questionIndex = 0;
  state.vitamins = 0;
  state.wrongCount = 0;
  state.selectedIds = [];
  state.factVisible = false;
  state.showWrong = false;
  state.showHint = false;
  state.fromChildHandoff = fromHandoff;
  state.justCorrect = false;
  state.shuffledOptions = null;
  state.shuffledOptionsKey = null;
}

function getQuestions() {
  return state.mode === 'child' ? CHILD_QUESTIONS : ADULT_QUESTIONS;
}

function getCurrentQuestion() {
  return getQuestions()[state.questionIndex];
}

function getQuestionWithShuffledOptions() {
  const question = getCurrentQuestion();
  const key = `${state.mode}-${state.questionIndex}`;

  if (!state.shuffledOptions || state.shuffledOptionsKey !== key) {
    state.shuffledOptions = shuffleArray(question.options);
    state.shuffledOptionsKey = key;
  }

  return { ...question, options: state.shuffledOptions };
}

function getChildProfile() {
  return CHILD_PROFILES[0];
}

function renderStart() {
  const screen = document.createElement('div');
  screen.className = 'screen screen--start active';

  screen.innerHTML = `
    <div class="start-heroes start-heroes--duo">
      <img class="peek-hero peek-hero--static" data-cutout src="${getCharacterImage('pepper', 'happy')}" alt="" aria-hidden="true">
      <img class="peek-hero peek-hero--static" data-cutout src="${getCharacterImage('orange', 'happy')}" alt="" aria-hidden="true">
    </div>
    <div class="start-content">
      <h1 class="screen-title screen-title--welcome"><span class="screen-title-line">Добро пожаловать в Витаминки!<img class="title-vitaminka" data-cutout src="${VITAMINKA_IMAGE}" alt="" aria-hidden="true"></span></h1>
      <p class="screen-subtitle">Узнай, где прячутся витамины, собирай Витаминки и познакомься с нашими героями.</p>
      <aside class="demo-note" role="note">
        <p class="demo-note-label">Демонстрация для специалистов</p>
        <p class="demo-note-sub">Сокращенная версия</p>
        <p class="demo-note-text">Познавательная игра для сайта или канала: ребёнок увлекается и зовёт родителя «набрать витаминок», а в финале специалист мягко предлагает разобрать реальную тарелку и приглашает на консультацию.</p>
      </aside>
    </div>
    <div class="btn-group start-btn-group">
      <button type="button" class="btn btn-primary start-child-btn">
        <span class="btn-icons" aria-hidden="true">
          <img class="btn-icon" data-cutout src="${ICON_CHILD}" alt="">
          <img class="btn-icon" data-cutout src="${ICON_GIRL}" alt="">
        </span>
        Играть
      </button>
    </div>
  `;

  screen.querySelector('.start-child-btn').addEventListener('click', () => {
    resetGame('child');
    navigateTo('question');
  });

  currentScreenId = 'start';
  navHistory = [];
  showScreen(screen);
  applyCutoutToImages(screen);
}

function renderQuestion() {
  const questions = getQuestions();
  const question = getQuestionWithShuffledOptions();

  const screen = createQuestionScreen({
    mode: state.mode,
    question,
    questionIndex: state.questionIndex,
    totalQuestions: questions.length,
    vitamins: state.vitamins,
    wrongCount: state.wrongCount,
    showHint: state.showHint,
    showWrong: state.showWrong,
    selectedIds: state.selectedIds,
    factVisible: state.factVisible,
    onSelect: handleSelect,
    onContinue: handleFactContinue,
  });

  showScreen(screen);

  if (state.factVisible && state.justCorrect) {
    state.justCorrect = false;
    const correctIds = question.options.filter((o) => o.correct).map((o) => o.id);
    requestAnimationFrame(() => {
      animateVitaminkasToCounter(screen, correctIds, question.points);
    });
  }
}

function handleWrongAnswer(optionId) {
  state.wrongCount += 1;
  state.showWrong = true;
  state.selectedIds = [optionId];
  if (state.wrongCount >= 2) {
    state.showHint = true;
  }
}

function handleSelect(optionId) {
  const question = getQuestionWithShuffledOptions();
  const option = question.options.find((o) => o.id === optionId);

  if (option.correct) {
    state.factVisible = true;
    state.showWrong = false;
    state.justCorrect = true;
    state.vitamins += question.points;
  } else {
    handleWrongAnswer(optionId);
  }

  renderQuestion();
}

function handleFactContinue() {
  const questions = getQuestions();

  if (state.questionIndex + 1 < questions.length) {
    navHistory.push({ screenId: 'question', state: cloneState() });
  }

  state.questionIndex += 1;
  state.wrongCount = 0;
  state.selectedIds = [];
  state.factVisible = false;
  state.showWrong = false;
  state.showHint = false;
  state.justCorrect = false;
  state.shuffledOptions = null;
  state.shuffledOptionsKey = null;

  if (state.questionIndex >= questions.length) {
    if (state.mode === 'child') {
      navigateTo('child-profile');
    } else {
      navigateTo('plate-transition');
    }
  } else {
    renderQuestion();
  }
}

function renderChildProfile() {
  const profile = getChildProfile();
  const screen = createProfileScreen({
    title: profile.title,
    textLines: profile.text,
    vitamins: DEMO_CHILD_VITAMINS_SHOWCASE,
    showAdultHandoff: true,
    onAdult: () => {
      resetGame('adult', true);
      navigateTo('question');
    },
  });
  showScreen(screen);
}

function renderNutritionistAvatar({ featured = false } = {}) {
  const featuredClass = featured ? ' nutritionist-avatar--featured' : '';
  return `<div class="nutritionist-avatar${featuredClass}" aria-hidden="true"><img class="nutritionist-image" data-cutout src="${NUTRITIONIST_IMAGE}" alt=""></div>`;
}

function renderPlateTransition() {
  const screen = document.createElement('div');
  screen.className = 'screen active';
  screen.innerHTML = `
    ${renderNutritionistAvatar()}
    <h2 class="screen-title">А как насчёт разнообразия вашего собственного рациона? 🍽️</h2>
    <div class="screen-text">
      <p>Мы потренировались на продуктах из игры и проверили, насколько хорошо вы знаете, где искать разные витамины.</p>
      <p style="font-weight:700;margin-top:16px">А что в вашей настоящей тарелке?</p>
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-plate next-btn">Далее</button>
    </div>
  `;

  screen.querySelector('.next-btn').addEventListener('click', () => navigateTo('nutritionist'));
  showScreen(screen);
  applyCutoutToImages(screen);
}

function renderNutritionist() {
  const screen = document.createElement('div');
  screen.className = 'screen active nutritionist-screen';
  screen.innerHTML = `
    <div class="nutritionist-stage nutritionist-stage--solo">
      ${renderNutritionistAvatar({ featured: true })}
    </div>
    <div class="nutritionist-card">
      <div class="nutritionist-card-plate" aria-hidden="true"></div>
      <div class="nutritionist-card-content">
        <div class="nutritionist-speech">
          <p class="nutritionist-quote-body">Я помогаю разобрать ваш рацион вместе с вами: посмотреть на разнообразие питания, привычки и продукты, которые регулярно появляются на вашей тарелке.</p>
        </div>
        <div class="nutritionist-chips" aria-hidden="true">
          <img class="nutritionist-chip" data-cutout src="${getCharacterImage('broccoli', 'happy')}" alt="">
          <img class="nutritionist-chip" data-cutout src="${getCharacterImage('apple', 'happy')}" alt="">
          <img class="nutritionist-chip" data-cutout src="${getCharacterImage('fish', 'happy')}" alt="">
          <img class="nutritionist-chip" data-cutout src="${VITAMINKA_IMAGE}" alt="">
        </div>
      </div>
    </div>
    <div class="btn-group nutritionist-actions">
      <button type="button" class="btn btn-primary cta-btn">Разобрать мой рацион</button>
    </div>
  `;

  screen.querySelector('.cta-btn').addEventListener('click', () => navigateTo('contact-soon'));
  showScreen(screen);
  applyCutoutToImages(screen);
}

function goToStart() {
  navHistory = [];
  resetGame('child');
  currentScreenId = 'start';
  renderStart();
}

function renderContactSoon() {
  const screen = document.createElement('div');
  screen.className = 'screen active contact-soon-screen';
  screen.innerHTML = `
    <div class="contact-soon">В полной версии здесь открывается запись на консультацию или чат с вами в мессенджере.</div>
    <button type="button" class="btn-link contact-restart">Вернуться в начало</button>
  `;

  screen.querySelector('.contact-restart').addEventListener('click', goToStart);
  showScreen(screen);
}

preloadVitaminkaCutout();
renderStart();
