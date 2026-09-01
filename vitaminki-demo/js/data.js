/** Демо-контент для встраивания в businesscard (сокращённый сценарий) */

export const DEMO_CHILD_VITAMINS_SHOWCASE = 90;

export const CHILD_QUESTIONS = [
  {
    id: 1,
    vitamin: 'A',
    question: 'Кто из этих героев богат витамином A?',
    hint: 'Подсказка: этот герой оранжевый и хрустящий 🥕',
    options: [
      { id: 'rice', emoji: '🍚', name: 'Рис', correct: false },
      { id: 'carrot', emoji: '🥕', name: 'Морковка', correct: true, character: 'Морковка' },
      { id: 'pear', emoji: '🍐', name: 'Груша', correct: false },
      { id: 'bread', emoji: '🥖', name: 'Хлеб', correct: false },
    ],
    reaction: '🥕 Морковка: «Конечно, я!»',
    factTitle: 'А зачем нам витамин A?',
    facts: [
      '👀 Чтобы глазки хорошо видели, особенно когда вокруг становится темно.',
      '🛡️ А ещё он помогает коже и защитникам твоего организма.',
    ],
    points: 10,
  },
];

export const ADULT_QUESTIONS = [
  {
    id: 1,
    vitamin: 'B12',
    question: 'Какой продукт является естественным источником витамина B12?',
    hint: 'Подсказка: продукт животного происхождения 🥚',
    options: [
      { id: 'spinach', emoji: '🥬', name: 'Шпинат', correct: false },
      { id: 'apple', emoji: '🍎', name: 'Яблоко', correct: false },
      { id: 'egg', emoji: '🥚', name: 'Яйцо', correct: true },
      { id: 'avocado', emoji: '🥑', name: 'Авокадо', correct: false },
    ],
    reaction: '🥚 Витамин B12 естественным образом содержится преимущественно в продуктах животного происхождения.',
    facts: [
      'Он необходим для нормального кроветворения и работы нервной системы.',
    ],
    points: 10,
  },
];

export const CHILD_PROFILES = [
  {
    min: 70,
    max: 90,
    title: '🏆 Витаминный суперсыщик',
    text: [
      'Вот это да! 🔎',
      'Ты умеешь находить витамины даже там, где они хорошо спрятались.',
      'Теперь ты знаешь, какие герои помогают:',
      '👀 глазкам хорошо видеть',
      '🦴 косточкам расти крепкими',
      '💪 мышцам работать',
      '🧠 мозгу хорошо трудиться',
      '🛡️ организму защищаться.',
      'Но в мире еды осталось ещё о-о-очень много секретов! 🌎🥦🍓🥚',
    ],
  },
];

export const ADULT_PROFILES = [];

export const WRONG_MESSAGE = 'Ой, не здесь! 👀 Попробуй ещё раз.';
