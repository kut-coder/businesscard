const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn?.addEventListener("click", () => nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => nav.classList.remove("open"));
});

const quizTexts = {
  coffee: {
    title: "Кофе держит вас в режиме «срочность»",
    text: "Это не про силу воли. Нервная система просит опору. На консультации разбираем, чем заменить гонку — без запрета любимой чашки.",
  },
  sweet: {
    title: "Сладкое утром — часто про перепад, не про характер",
    text: "Тело просит быстрый сигнал. Вместе ищем завтрак, после которого не хочется договариваться с собой до обеда.",
  },
  skip: {
    title: "Пропуск завтрака — тоже стратегия",
    text: "Иногда так спокойнее. Вопрос в том, чем платит вечер. На сессии смотрим, где можно вставить опору без «надо есть с 7:00».",
  },
  bowl: {
    title: "Автопилот тоже можно сделать добрее",
    text: "Тарелка есть, а энергии нет — частый сюжет. Разберём состав и ритм, не ломая привычку целиком.",
  },
};

document.querySelectorAll("[data-next='quiz']").forEach((btn) => {
  btn.addEventListener("click", () => showQuiz(1));
});
document.querySelectorAll(".choice").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pick = btn.dataset.pick;
    const data = quizTexts[pick];
    document.getElementById("quizTitle").textContent = data.title;
    document.getElementById("quizText").textContent = data.text;
    showQuiz(2);
  });
});
document.querySelector("[data-book]")?.addEventListener("click", (e) => {
  e.target.textContent = "Заявка отправлена специалисту";
});
function showQuiz(step) {
  document.querySelectorAll("[data-app='quiz']").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.step) === step);
  });
}

const dots = document.getElementById("habitDots");
if (dots) {
  for (let i = 1; i <= 21; i += 1) {
    const b = document.createElement("button");
    b.className = "dot" + (i < 7 ? " done" : i === 7 ? " today" : "");
    b.type = "button";
    b.title = "День " + i;
    dots.appendChild(b);
  }
}
document.getElementById("habitDone")?.addEventListener("click", (e) => {
  const today = document.querySelector(".dot.today");
  if (today) {
    today.classList.remove("today");
    today.classList.add("done");
    const next = today.nextElementSibling;
    if (next) next.classList.add("today");
  }
  e.target.textContent = "День отмечен. До завтра — без долга.";
});

document.querySelectorAll("[data-crm]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-crm]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".crm-view").forEach((v) => v.classList.remove("active"));
    document.getElementById("crm-" + btn.dataset.crm).classList.add("active");
  });
});

const mealPlans = {
  energy: [
    {
      title: "Завтрак",
      items: ["2 шт. яиц (омлет со шпинатом и помидором)", "50 г овсянки на воде", "1 горсть ягод"],
    },
    {
      title: "Перекус",
      items: ["150 г натурального йогурта", "10 шт. миндаля"],
    },
    {
      title: "Обед",
      items: ["150 г куриной грудки", "60 г гречки (сухой)", "салат из огурца и зелени", "1 ч. л. оливкового масла"],
    },
    {
      title: "Ужин",
      items: ["150 г трески на пару", "100 г брокколи", "100 г кабачка"],
    },
  ],
  cycle: [
    {
      title: "Завтрак",
      items: ["150 г творога 5%", "1 ст. л. семян тыквы", "1 горсть ягод"],
    },
    {
      title: "Перекус",
      items: ["2 шт. гречневых хлебцев", "2 ст. л. паштета из чечевицы", "5 шт. помидоров черри"],
    },
    {
      title: "Обед",
      items: ["120 г говядины тушёной", "70 г гречки (сухой)", "салат из капусты с лимонным соком"],
    },
    {
      title: "Ужин",
      items: ["150 г индейки запечённой", "200 г стручковой фасоли", "200 мл кефира"],
    },
  ],
  family: [
    {
      title: "Завтрак",
      items: ["2 шт. яиц всмятку", "1 ломтик ржаного хлеба", "20 г сыра", "1 шт. огурца"],
    },
    {
      title: "Обед",
      items: ["70 г бурого риса", "150 г куриного филе", "1 шт. среднего помидора", "½ шт. сладкого перца"],
    },
    {
      title: "Перекус",
      items: ["1 шт. яблока", "200 мл питьевого йогурта без сахара"],
    },
    {
      title: "Ужин",
      items: ["1 шт. кабачка", "1 шт. перца", "150 г брокколи", "150 г запечённой рыбы"],
    },
  ],
};

let selectedGoal = "energy";
document.querySelectorAll("#goalChips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("#goalChips .chip").forEach((c) => c.classList.remove("on"));
    chip.classList.add("on");
    selectedGoal = chip.dataset.goal;
  });
});

document.getElementById("buildDay")?.addEventListener("click", () => {
  const limit = document.getElementById("goalLimit")?.value.trim();
  const board = document.getElementById("mealBoard");
  const meals = mealPlans[selectedGoal];
  board.innerHTML =
    (limit ? `<div class="meal-card" style="grid-column:1/-1"><b>Учтено</b><p>${limit}</p></div>` : "") +
    meals
      .map(
        (m) =>
          `<div class="meal-card"><b>${m.title}</b><ul>${m.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`
      )
      .join("");
  board.hidden = false;
  document.getElementById("planHint").hidden = false;
});

const sampleMenu = [
  {
    meal: "Завтрак",
    items: [
      { name: "Отварные яйца", amount: 2, unit: "шт." },
      { name: "Помидор черри", amount: 5, unit: "шт." },
      { name: "Листья салата", amount: 3, unit: "лист" },
      { name: "Хлеб на закваске", amount: 2, unit: "ломтика" },
    ],
  },
  {
    meal: "Обед",
    items: [
      { name: "Куриное филе", amount: 150, unit: "г" },
      { name: "Гречка", amount: 60, unit: "г" },
      { name: "Огурец", amount: 1, unit: "шт." },
      { name: "Листья салата", amount: 4, unit: "лист" },
      { name: "Оливковое масло", amount: 1, unit: "ст. л." },
    ],
  },
  {
    meal: "Ужин",
    items: [
      { name: "Гречка", amount: 60, unit: "г" },
      { name: "Шампиньоны", amount: 150, unit: "г" },
      { name: "Помидор черри", amount: 4, unit: "шт." },
      { name: "Огурец", amount: 1, unit: "шт." },
    ],
  },
];

function ruUnit(amount, unit) {
  if (unit !== "лист") return unit;
  const n = Math.abs(amount) % 100;
  const d = n % 10;
  if (n > 10 && n < 20) return "листов";
  if (d === 1) return "лист";
  if (d >= 2 && d <= 4) return "листа";
  return "листов";
}

function formatQty(item) {
  return item.amount + " " + ruUnit(item.amount, item.unit);
}
document.getElementById("loadMenu")?.addEventListener("click", () => {
  const box = document.getElementById("menuDay");
  box.innerHTML = sampleMenu
    .map(
      (block) =>
        `<div class="menu-block"><h4>${block.meal}</h4><ul>${block.items
          .map((i) => `<li><span>${i.name}</span><span class="qty">${formatQty(i)}</span></li>`)
          .join("")}</ul></div>`
    )
    .join("");
  box.hidden = false;
  document.getElementById("makeList").hidden = false;
  document.getElementById("shopList").hidden = true;
});

document.getElementById("makeList")?.addEventListener("click", () => {
  const totals = new Map();
  sampleMenu.forEach((block) => {
    block.items.forEach((item) => {
      const key = item.name + "|" + item.unit;
      const prev = totals.get(key);
      if (prev) prev.amount += item.amount;
      else totals.set(key, { name: item.name, amount: item.amount, unit: item.unit });
    });
  });
  const rows = [...totals.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const list = document.getElementById("shopList");
  list.innerHTML =
    "<h4>Итого к закупке</h4><ul>" +
    rows.map((r) => `<li><span>${r.name}</span><span class="total">${formatQty(r)}</span></li>`).join("") +
    "</ul><button class=\"shop-pdf\" type=\"button\">Скачать PDF</button>";
  list.hidden = false;
});

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
    bot: "Передала Ольге. <span class=\"hint\">В рабочей версии сообщение уйдёт ей в чат, а не останется в боте.</span>",
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

const toTop = document.getElementById("toTop");
const toggleToTop = () => {
  toTop?.classList.toggle("visible", window.scrollY > 280);
};
toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", toggleToTop, { passive: true });
toggleToTop();

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  localStorage.setItem("nutricode-lead", JSON.stringify(data));
  document.getElementById("toast").style.display = "block";
  e.target.reset();
});
