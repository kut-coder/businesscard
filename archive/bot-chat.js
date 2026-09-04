/* Логика демо-бота. Подключать только вместе с archive/bot-section.html */
const chatLog = document.getElementById("chatLog");
const chatQuick = document.getElementById("chatQuick");
const chatFlow = {
  start: {
    bot: "Привет! Я помощник Ольги. Какой у вас сейчас вопрос?",
    buttons: [
      { label: "По заменам", next: "swaps" },
      { label: "По режиму", next: "regime" },
      { label: "По самочувствию", next: "feel" },
    ],
  },
  swaps: {
    bot: "Что хотите заменить в меню протокола?",
    buttons: [
      { label: "Нет яиц", next: "swap_eggs" },
      { label: "Нет гречки", next: "swap_buck" },
      { label: "Без молочного", next: "swap_dairy" },
    ],
  },
  swap_eggs: {
    bot: "Яйца в завтраке можно заменить на 120 г тофу или 150 г творога 5%. Порцию белка сохраняем. Если замена нужна надолго, лучше согласовать с Ольгой.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  swap_buck: {
    bot: "Гречку замените на бурый рис или киноа в той же сухой порции (около 60 г). Если крупы не идут совсем, Ольга пересоберёт гарнир.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  swap_dairy: {
    bot: "Молочное в протоколе не обязательное. Йогурт — на растительный без сахара или на порцию рыбы. При непереносимости Ольга скорректирует день.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  regime: {
    bot: "О каком моменте дня вопрос?",
    buttons: [
      { label: "Пропускаю завтрак", next: "reg_breakfast" },
      { label: "Ужин поздний", next: "reg_dinner" },
      { label: "Перекусы сбились", next: "reg_snack" },
    ],
  },
  reg_breakfast: {
    bot: "По протоколу «тихая энергия» завтрак с белком — опора. Если утром не естся, поставьте тёплый приём до 11:00: яйца или йогурт. Если так несколько дней, напишите Ольге.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  reg_dinner: {
    bot: "Ужин лучше за 2–3 часа до сна, тёплый, без большой порции крупы. Если график не даёт, Ольга подстроит окно под вашу смену.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  reg_snack: {
    bot: "Перекус — если голод между едой, не «за компанию». Йогурт, орехи, яблоко. Если тянет сладкое каждые два часа, это уже к Ольге: я не разбираю дневник целиком.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel: {
    bot: "Что сейчас с самочувствием? Я подскажу по протоколу. Если тревожно, сразу переключу на Ольгу.",
    buttons: [
      { label: "Тяга к сладкому", next: "feel_sweet" },
      { label: "Нет сил утром", next: "feel_tired" },
      { label: "Тревожит состояние", next: "feel_alert" },
    ],
  },
  feel_sweet: {
    bot: "Тяга часто после пропущенного обеда или кофе натощак. Сначала доберите белок в основной еде. Если тяга резкая и новая, Ольга посмотрит дневник.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel_tired: {
    bot: "Утренний спад — частый сюжет. Проверьте белок за завтраком и не уехал ли ужин за полночь. Если слабость держится, напишите Ольге: я диагноз не ставлю.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel_alert: {
    bot: "Если самочувствие тревожит — сыпь, резкий спад, боль — я не консультирую. Свяжитесь с Ольгой, при необходимости она направит к врачу.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  olga: {
    bot: "Передала ваш запрос Ольге, в ближайшее время она с вами свяжется.<br><br><span class=\"hint\">В рабочей версии сообщение уходит к вам в мессенджер.</span>",
    buttons: [{ label: "Сначала", next: "start" }],
  },
};

function renderChat(key) {
  const node = chatFlow[key];
  const msg = document.createElement("div");
  msg.className = "msg bot";
  msg.innerHTML = node.bot;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
  chatQuick.innerHTML = "";
  node.buttons.forEach((b) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = b.label;
    btn.addEventListener("click", () => {
      if (b.next === "start") {
        chatLog.innerHTML = "";
        renderChat("start");
        return;
      }
      const user = document.createElement("div");
      user.className = "msg user";
      user.textContent = b.label;
      chatLog.appendChild(user);
      renderChat(b.next);
    });
    chatQuick.appendChild(btn);
  });
}
if (chatLog) renderChat("start");
